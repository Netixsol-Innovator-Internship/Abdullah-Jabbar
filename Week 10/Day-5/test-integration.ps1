# Test Backend API Endpoints
# Run this after starting the backend server

$baseUrl = "http://localhost:4000"

Write-Host "Testing Assignment Evaluation API" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n[1] Testing Health Check (GET /)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method Get
    Write-Host "✓ Health check successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
}

# Test 2: Create Assignment
Write-Host "`n[2] Testing Create Assignment (POST /assignments)..." -ForegroundColor Yellow
$assignmentData = @{
    topic = "Test Essay on Climate Change"
    instructions = "Write a 500-word essay discussing climate change impacts"
    wordCount = 500
    mode = "strict"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/assignments" -Method Post -Body $assignmentData -ContentType "application/json"
    Write-Host "✓ Assignment created successfully" -ForegroundColor Green
    $assignmentId = $response._id
    Write-Host "Assignment ID: $assignmentId" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed to create assignment: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Get All Assignments
Write-Host "`n[3] Testing Get All Assignments (GET /assignments)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/assignments" -Method Get
    Write-Host "✓ Retrieved $($response.Count) assignment(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get assignments: $_" -ForegroundColor Red
}

# Test 4: Get Single Assignment
Write-Host "`n[4] Testing Get Single Assignment (GET /assignments/$assignmentId)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/assignments/$assignmentId" -Method Get
    Write-Host "✓ Retrieved assignment: $($response.topic)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get assignment: $_" -ForegroundColor Red
}

# Note: File upload tests require actual PDF files
Write-Host "`n[5] File Upload Test (Skipped - Requires PDF files)" -ForegroundColor Yellow
Write-Host "To test file upload, use the frontend or create a PDF and use:" -ForegroundColor Cyan
Write-Host "curl -X POST '$baseUrl/assignments/$assignmentId/submissions/upload' -F 'files=@path/to/file.pdf'" -ForegroundColor Gray

Write-Host "`n=================================" -ForegroundColor Green
Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 to use the frontend" -ForegroundColor White
Write-Host "2. Create an assignment and upload PDF files" -ForegroundColor White
Write-Host "3. Start evaluation and watch real-time progress" -ForegroundColor White
