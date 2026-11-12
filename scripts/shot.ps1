# Dev helper: headless-Edge screenshots at true widths.
#   ./scripts/shot.ps1 -Path / -Width 1440 -Height 900 -Name home-1440
# Widths < 520 use an iframe wrapper because headless Edge enforces a minimum window width.
param(
  [string]$Path = "/",
  [int]$Width = 1440,
  [int]$Height = 900,
  [string]$Name = "shot",
  [int]$Port = 3100
)
$dir = Join-Path $env:TEMP "revoo-shots"
New-Item -ItemType Directory -Force $dir | Out-Null
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$url = "http://localhost:$Port$Path"
$out = Join-Path $dir "$Name.png"
if (Test-Path $out) { Remove-Item $out -Force }
if ($Width -lt 520) {
  $html = Join-Path $dir "$Name.html"
  "<!doctype html><body style='margin:0;background:#777'><iframe src='$url' width='$Width' height='$Height' style='border:0;background:#fff'></iframe></body>" | Set-Content $html
  $ww = [Math]::Max($Width + 20, 560)
  $ws = "--window-size=$ww,$($Height + 10)"
  $target = "file:///$($html.Replace('\','/'))"
} else {
  $ws = "--window-size=$Width,$Height"
  $target = $url
}
& $edge --headless=new --disable-gpu --hide-scrollbars $ws --virtual-time-budget=9000 "--screenshot=$out" $target 2>&1 | Out-Null
if (Test-Path $out) { Write-Output $out } else { Write-Output "FAILED: $out" }
