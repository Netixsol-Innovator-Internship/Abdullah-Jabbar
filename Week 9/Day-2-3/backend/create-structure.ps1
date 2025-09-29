# Run from project-root
$dirs = @(
  "src",
  "src/models",
  "src/modules",
  "src/modules/ask",
  "src/modules/upload",
  "src/services",
  "src/ai",
  "src/utils"
)

foreach ($d in $dirs) {
  if (-not (Test-Path -LiteralPath $d)) {
    New-Item -ItemType Directory -Path $d | Out-Null
    Write-Host "Created dir: $d"
  } else {
    Write-Host "Exists: $d"
  }
}

$files = @(
  "package.json",
  "tsconfig.json",
  "README.md",
  "src/main.ts",
  "src/app.module.ts",
  "src/models/match.schema.ts",
  "src/modules/ask/ask.controller.ts",
  "src/modules/ask/ask.service.ts",
  "src/modules/ask/ask.module.ts",
  "src/modules/upload/upload.controller.ts",
  "src/modules/upload/upload.service.ts",
  "src/modules/upload/upload.module.ts",
  "src/services/relevancy.service.ts",
  "src/services/query-generator.service.ts",
  "src/services/query-validator.service.ts",
  "src/services/mongo-query.service.ts",
  "src/services/formatter.service.ts",
  "src/ai/gemini-adapter.ts",
  "src/utils/csv-importer.ts"
)

foreach ($f in $files) {
  if (-not (Test-Path -LiteralPath $f)) {
    New-Item -ItemType File -Path $f | Out-Null
    Write-Host "Created file: $f"
  } else {
    Write-Host "Skipped existing: $f"
  }
}
