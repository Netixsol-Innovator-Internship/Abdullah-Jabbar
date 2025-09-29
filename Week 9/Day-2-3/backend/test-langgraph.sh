#!/bin/bash

# Simple curl-based test for LangGraph workflow
BASE_URL="http://localhost:3000"

echo "🧪 Testing LangGraph workflow with curl..."
echo ""

# Test 1: Cricket question (should work)
echo "📋 Test 1: Cricket ODI question"
curl -X POST "$BASE_URL/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "How many matches did India win in ODI format?"}' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "----------------------------------------"

# Test 2: Another cricket question
echo "📋 Test 2: Highest score question"
curl -X POST "$BASE_URL/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the highest score by Australia in Test matches?"}' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "----------------------------------------"

# Test 3: Non-cricket question (should be rejected)
echo "📋 Test 3: Non-cricket question (should be rejected)"
curl -X POST "$BASE_URL/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the weather like today?"}' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "----------------------------------------"

# Test 4: Health check
echo "📋 Test 4: Health check"
curl -X GET "$BASE_URL/" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

echo "✨ Tests completed!"