# PowerShell script to test LangGraph workflow
$BaseUrl = "http://localhost:4000"

Write-Host "🧪 Testing LangGraph workflow..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Cricket question (should work)
Write-Host "📋 Test 1: Cricket ODI question" -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri "$BaseUrl/ask" -Method Post -Body (@{question = "How many matches did India win in ODI format?" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response1 | ConvertTo-Json -Depth 10)
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "----------------------------------------"

# Test 2: Another cricket question
Write-Host "📋 Test 2: Highest score question" -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "$BaseUrl/ask" -Method Post -Body (@{question = "What is the highest score by Australia in Test matches?" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response2 | ConvertTo-Json -Depth 10)
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "----------------------------------------"

# Test 3: T20 specific question
Write-Host "📋 Test 3: T20 specific question" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$BaseUrl/ask" -Method Post -Body (@{question = "Show me T20 matches where Pakistan scored more than 180 runs" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response3 | ConvertTo-Json -Depth 10)
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "----------------------------------------"

# Test 4: Non-cricket question (should be rejected)
Write-Host "📋 Test 4: Non-cricket question (should be rejected)" -ForegroundColor Yellow
try {
    $response4 = Invoke-RestMethod -Uri "$BaseUrl/ask" -Method Post -Body (@{question = "What is the weather like today?" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Response received:" -ForegroundColor Green
    Write-Host ($response4 | ConvertTo-Json -Depth 10)
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "----------------------------------------"

# Test 5: Health check
Write-Host "📋 Test 5: Health check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/" -Method Get
    Write-Host "✅ Backend is healthy!" -ForegroundColor Green
    Write-Host $health
}
catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the backend is running with: npm run start:dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Tests completed!" -ForegroundColor Cyan