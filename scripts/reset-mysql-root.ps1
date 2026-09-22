#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Resets the local MySQL 8.0 root password, and guarantees the service is left running.

.DESCRIPTION
    Uses MySQL's documented --init-file recovery procedure for Windows.

    This is NOT destructive: it changes the root password and nothing else. The
    data directory is never touched, so every existing database is preserved.

    Three phases:
      A. Make sure MySQL is running, starting the service if needed.
      B. Check whether the new password already works, so a partial earlier run
         does not need repeating.
      C. Perform the reset, capturing mysqld's own error log so a failure reports
         the real cause.

    Note on why native calls go through Invoke-MySqlCli: under
    $ErrorActionPreference = 'Stop', PowerShell 5.1 promotes anything a native
    command writes to stderr into a terminating error. mysql.exe writes its
    "Using a password on the command line interface can be insecure" warning to
    stderr, which would abort the script immediately. The helper drops the
    error-action preference for the duration of the call and reads the real
    result from $LASTEXITCODE instead.

.EXAMPLE
    .\scripts\reset-mysql-root.ps1 -NewPassword 'YourStrongPassword!'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $NewPassword,

    [string] $ServiceName = 'MySQL80',
    [int]    $Port        = 3306
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$binDir       = 'C:\Program Files\MySQL\MySQL Server 8.0\bin'
$mysqld       = Join-Path $binDir 'mysqld.exe'
$mysql        = Join-Path $binDir 'mysql.exe'
$mysqladmin   = Join-Path $binDir 'mysqladmin.exe'
$defaults     = 'C:\ProgramData\MySQL\MySQL Server 8.0\my.ini'
$initFile     = Join-Path $env:TEMP 'mysql-password-reset-init.txt'
$tempErrorLog = Join-Path $env:TEMP 'mysql-password-reset-mysqld.err'

foreach ($required in @($mysqld, $mysql, $mysqladmin, $defaults)) {
    if (-not (Test-Path -LiteralPath $required)) { throw "Required path not found: $required" }
}

if ($NewPassword -match "'|`"") { throw 'Please choose a password without quote characters.' }

function Invoke-MySqlCli {
    <#
        Runs a native MySQL tool and returns its exit code.

        The error-action preference is relaxed for the call so that stderr output
        (warnings, "Access denied", ...) cannot raise a terminating error.
    #>
    param(
        [Parameter(Mandatory = $true)][string]   $Executable,
        [Parameter(Mandatory = $true)][string[]] $Arguments
    )

    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'

    try {
        & $Executable @Arguments 2>&1 | Out-Null
        return $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previous
    }
}

function Test-PortListening {
    param([int] $TargetPort)

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $client.Connect('127.0.0.1', $TargetPort)
        $client.Dispose()
        return $true
    }
    catch {
        $client.Dispose()
        return $false
    }
}

function Wait-PortState {
    param([int] $TargetPort, [bool] $Listening, [int] $TimeoutSeconds = 60)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if ((Test-PortListening -TargetPort $TargetPort) -eq $Listening) { return $true }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

function Wait-NoMysqldProcess {
    param([int] $TimeoutSeconds = 20)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (-not (Get-Process mysqld -ErrorAction SilentlyContinue)) { return $true }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

function Test-LoginWorks {
    param([string] $Password)

    $previous = $env:MYSQL_PWD
    $env:MYSQL_PWD = $Password
    try {
        $exitCode = Invoke-MySqlCli -Executable $mysql -Arguments @(
            '--protocol=TCP', '--host=127.0.0.1', "--port=$Port", '--user=root', '--execute=SELECT 1'
        )
        return ($exitCode -eq 0)
    }
    finally {
        if ($null -eq $previous) { Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue }
        else { $env:MYSQL_PWD = $previous }
    }
}

function Get-ServiceErrorLogTail {
    $dataDirLine  = Select-String -LiteralPath $defaults -Pattern '^\s*datadir\s*=\s*(.+)$'
    $errorLogLine = Select-String -LiteralPath $defaults -Pattern '^\s*log-error\s*=\s*(.+)$'

    if ($dataDirLine -and $errorLogLine) {
        $dataDir = $dataDirLine.Matches[0].Groups[1].Value.Trim().Trim('"')
        $logName = $errorLogLine.Matches[0].Groups[1].Value.Trim().Trim('"')
        $logPath = Join-Path $dataDir $logName

        if (Test-Path -LiteralPath $logPath) {
            Write-Host "--- tail of $logPath ---" -ForegroundColor DarkGray
            Get-Content -LiteralPath $logPath -Tail 30 | ForEach-Object { Write-Host "    $_" }
            return
        }
    }

    Write-Host '    (could not locate the MySQL error log)' -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
# Phase A: make sure MySQL is running before changing anything.
# ---------------------------------------------------------------------------
Write-Host 'Phase A: ensuring MySQL is running...' -ForegroundColor Cyan

if ((Get-Service -Name $ServiceName).Status -ne 'Running') {
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        Write-Host "  starting $ServiceName (attempt $attempt)..."
        try {
            Start-Service -Name $ServiceName -ErrorAction Stop
            break
        }
        catch {
            Write-Host "  attempt $attempt failed: $($_.Exception.Message)" -ForegroundColor Yellow
            Start-Sleep -Seconds 3
        }
    }
}

if (-not (Wait-PortState -TargetPort $Port -Listening $true -TimeoutSeconds 60)) {
    Write-Host 'ERROR: MySQL did not start.' -ForegroundColor Red
    Get-ServiceErrorLogTail
    throw 'The MySQL service could not be started. See the log tail above.'
}

Write-Host "  MySQL is up on port $Port." -ForegroundColor Green

# ---------------------------------------------------------------------------
# Phase B: has the password already been set by an earlier run?
# ---------------------------------------------------------------------------
Write-Host 'Phase B: checking the current password...' -ForegroundColor Cyan

if (Test-LoginWorks -Password $NewPassword) {
    Write-Host '  The new password already works - nothing to do.' -ForegroundColor Green
    Write-Host ''
    Write-Host "Done. MySQL root password: $NewPassword" -ForegroundColor Green
    return
}

Write-Host '  Not set yet; performing the reset.' -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Phase C: apply the reset.
# ---------------------------------------------------------------------------
$escapedPassword = $NewPassword.Replace("'", "''")
"ALTER USER 'root'@'localhost' IDENTIFIED BY '$escapedPassword';" |
    Set-Content -LiteralPath $initFile -Encoding ASCII

Remove-Item -LiteralPath $tempErrorLog -Force -ErrorAction SilentlyContinue

$temporaryServer = $null
$failure         = $null

try {
    Write-Host "  stopping $ServiceName..." -ForegroundColor Cyan
    Stop-Service -Name $ServiceName -Force
    (Get-Service -Name $ServiceName).WaitForStatus('Stopped', '00:00:30')

    # The data directory has to be fully released before a second server starts,
    # otherwise mysqld exits immediately on the file lock.
    [void](Wait-PortState -TargetPort $Port -Listening $false -TimeoutSeconds 30)
    [void](Wait-NoMysqldProcess -TimeoutSeconds 20)

    Write-Host '  starting the server once to apply the new password...' -ForegroundColor Cyan

    # --defaults-file must come first. Start-Process does not quote array
    # elements, so paths containing spaces are quoted explicitly here.
    # --log-error is redirected to a path we can read, so a startup failure
    # reports the real reason.
    $mysqldArgs = "--defaults-file=`"$defaults`" --init-file=`"$initFile`" --log-error=`"$tempErrorLog`""

    $temporaryServer = Start-Process -FilePath $mysqld -ArgumentList $mysqldArgs `
        -PassThru -WindowStyle Hidden

    Write-Host '  waiting for the new password to be accepted...' -ForegroundColor Cyan

    $applied = $false

    for ($attempt = 1; $attempt -le 60; $attempt++) {
        Start-Sleep -Milliseconds 750

        if (Test-LoginWorks -Password $NewPassword) { $applied = $true; break }

        if ($temporaryServer.HasExited) {
            $failure = "mysqld exited early with code $($temporaryServer.ExitCode)."
            break
        }
    }

    if (-not $applied -and -not $failure) {
        $failure = 'Timed out waiting for the new password to be accepted.'
    }

    if ($applied) {
        Write-Host '  password applied; shutting the temporary server down...' -ForegroundColor Cyan

        $previous = $env:MYSQL_PWD
        $env:MYSQL_PWD = $NewPassword
        try {
            [void](Invoke-MySqlCli -Executable $mysqladmin -Arguments @(
                    '--protocol=TCP', '--host=127.0.0.1', "--port=$Port", '--user=root', 'shutdown'
                ))
        }
        finally {
            if ($null -eq $previous) { Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue }
            else { $env:MYSQL_PWD = $previous }
        }

        $temporaryServer.WaitForExit(30000) | Out-Null
    }
}
catch {
    $failure = $_.Exception.Message
}
finally {
    if ($temporaryServer -and -not $temporaryServer.HasExited) {
        Stop-Process -Id $temporaryServer.Id -Force -ErrorAction SilentlyContinue
        $temporaryServer.WaitForExit(15000) | Out-Null
    }

    Remove-Item -LiteralPath $initFile -Force -ErrorAction SilentlyContinue

    # Report the real cause before attempting anything else.
    if ($failure) {
        Write-Host ''
        Write-Host "RESET FAILED: $failure" -ForegroundColor Red

        if (Test-Path -LiteralPath $tempErrorLog) {
            Write-Host '--- mysqld error log ---' -ForegroundColor DarkGray
            Get-Content -LiteralPath $tempErrorLog -Tail 40 | ForEach-Object { Write-Host "    $_" }
        }
    }

    # Always leave MySQL running.
    [void](Wait-PortState -TargetPort $Port -Listening $false -TimeoutSeconds 30)
    [void](Wait-NoMysqldProcess -TimeoutSeconds 20)

    Write-Host "  restarting $ServiceName..." -ForegroundColor Cyan

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            Start-Service -Name $ServiceName -ErrorAction Stop
            break
        }
        catch {
            Write-Host "  attempt $attempt failed: $($_.Exception.Message)" -ForegroundColor Yellow
            Start-Sleep -Seconds 3
        }
    }

    if (-not (Wait-PortState -TargetPort $Port -Listening $true -TimeoutSeconds 60)) {
        Write-Host 'WARNING: MySQL is NOT listening after the restart.' -ForegroundColor Red
        Get-ServiceErrorLogTail
    }
    else {
        Write-Host "  $ServiceName is running." -ForegroundColor Green
    }

    Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}

if ($failure) { throw "Password reset failed: $failure" }

Write-Host ''
Write-Host 'Done. The MySQL root password has been reset.' -ForegroundColor Green
Write-Host '  user:     root'
Write-Host "  password: $NewPassword"
Write-Host ''
Write-Host 'Put that same password into server/.env as DB_PASSWORD.'
