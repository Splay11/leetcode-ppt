# 从 npmmirror 安装 Remotion 所需的 Chrome Headless Shell（避免 Google Storage 慢）
# 在 motion-demo 根目录执行: npm run video:browser

$ErrorActionPreference = "Stop"

$ChromeVersion = "149.0.7790.0"
$Platform = "win64"
$ZipName = "chrome-headless-shell-$Platform.zip"
$MirrorUrl = "https://cdn.npmmirror.com/binaries/chrome-for-testing/$ChromeVersion/$Platform/$ZipName"

$root = Split-Path -Parent $PSScriptRoot
$destRoot = Join-Path $root "node_modules\.remotion\chrome-headless-shell"
$platformDir = Join-Path $destRoot $Platform
$exePath = Join-Path $platformDir "chrome-headless-shell-$Platform\chrome-headless-shell.exe"
$versionFile = Join-Path $destRoot "VERSION"
$zipPath = Join-Path ([System.IO.Path]::GetTempPath()) "remotion-$ZipName"

if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath -ErrorAction SilentlyContinue
}

if ((Test-Path $exePath) -and (Test-Path $versionFile) -and ((Get-Content $versionFile -Raw).Trim() -eq $ChromeVersion)) {
  Write-Host "Chrome Headless Shell $ChromeVersion already installed:"
  Write-Host "  $exePath"
  exit 0
}

Write-Host "Downloading Chrome Headless Shell $ChromeVersion from npmmirror..."
Write-Host "  $MirrorUrl"

New-Item -ItemType Directory -Force -Path $destRoot | Out-Null

if (Test-Path $platformDir) {
  Remove-Item -Recurse -Force $platformDir
}

$ProgressPreference = "SilentlyContinue"
Invoke-WebRequest -Uri $MirrorUrl -OutFile $zipPath -UseBasicParsing
$ProgressPreference = "Continue"

Write-Host "Extracting..."
Expand-Archive -Path $zipPath -DestinationPath $platformDir -Force
Remove-Item -Force $zipPath

Set-Content -Path $versionFile -Value $ChromeVersion -NoNewline -Encoding ascii

if (-not (Test-Path $exePath)) {
  throw "Extract failed: expected $exePath"
}

Write-Host "Done. Chrome Headless Shell installed:"
Write-Host "  $exePath"
