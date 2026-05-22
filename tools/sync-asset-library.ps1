# 将 src 课件同步到 asset-library/assets 副本
# 在 motion-demo 根目录执行

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$root\src\maxDepth")) {
  throw "Run from motion-demo root (expected src/maxDepth)"
}

$assets = Join-Path $root "asset-library\assets"
$styles = Join-Path $assets "styles"

Write-Host "Sync maxDepth -> assets/md"
Copy-Item -Recurse -Force "$root\src\maxDepth\components" "$assets\md\components"
Copy-Item -Force "$root\src\maxDepth\animConfig.js","$root\src\maxDepth\animHooks.js","$root\src\maxDepth\deckTheme.js","$root\src\maxDepth\constants.js","$root\src\maxDepth\useDfsPlayback.js","$root\src\maxDepth\buildDfsSteps.js","$root\src\maxDepth\layoutBase.js" "$assets\md\"
Copy-Item -Force "$root\src\maxDepth\max-depth.css" "$styles\md.css"

Write-Host "Sync twoSum -> assets/ts"
Copy-Item -Recurse -Force "$root\src\twoSum\components" "$assets\ts\components"
Copy-Item -Force "$root\src\twoSum\constants.js","$root\src\twoSum\prefixHashSteps.js" "$assets\ts\"
Copy-Item -Force "$root\src\twoSum\two-sum.css" "$styles\ts.css"

Write-Host "Sync containsDuplicate -> assets/cd"
Copy-Item -Recurse -Force "$root\src\containsDuplicate\components" "$assets\cd\components"
Copy-Item -Force "$root\src\containsDuplicate\constants.js","$root\src\containsDuplicate\hashSteps.js" "$assets\cd\"
Copy-Item -Force "$root\src\containsDuplicate\contains-duplicate.css" "$styles\cd.css"

Write-Host "Sync dfs -> assets/dfs"
Copy-Item -Recurse -Force "$root\src\dfs\components" "$assets\dfs\components"
Copy-Item -Force "$root\src\dfs\constants.js" "$assets\dfs\"
Copy-Item -Force "$root\src\dfs\dfs.css" "$styles\dfs.css"

Copy-Item -Force "$root\src\index.css" "$styles\base.css"

# layoutBase 副本内 import 需指向 @motion-tuning
$layoutBase = Join-Path $assets "md\layoutBase.js"
(Get-Content $layoutBase -Raw) -replace 'from "\.\./motion-tuning/', 'from "@motion-tuning/' | Set-Content $layoutBase -NoNewline

Write-Host "Done."
