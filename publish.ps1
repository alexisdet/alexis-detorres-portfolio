param(
  [string]$Message = "Update portfolio website"
)

$ErrorActionPreference = "Stop"
$gitPath = "C:\Program Files\Git\cmd"
if (Test-Path $gitPath) {
  $env:Path = "$gitPath;" + $env:Path
}

Set-Location -LiteralPath $PSScriptRoot

git status --short

git add .
if (-not (git diff --cached --quiet)) {
  git commit -m $Message
  git push origin main
  Write-Host "Published. Your live site will update at: https://alexisdet.github.io/alexis-detorres-portfolio/"
} else {
  Write-Host "No changes to publish. Your live site is still: https://alexisdet.github.io/alexis-detorres-portfolio/"
}
