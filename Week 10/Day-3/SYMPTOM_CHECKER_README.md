# Symptom Checker Implementation Testing

## Test Cases

### 1. Symptom Detection Examples

These messages should be detected as symptoms and routed to `/symptom-checker`:

- "I have joint pain"
- "I'm feeling tired all the time"
- "My back hurts"
- "I can't sleep at night"
- "I'm stressed and anxious"
- "I have digestive issues"
- "My hair is falling out"
- "I feel weak and have low energy"

### 2. Product Query Examples

These should continue using the regular `/ai/chat` endpoint:

- "Tell me about Vitamin C"
- "What's the best multivitamin?"
- "How much does this cost?"
- "What are the ingredients in this supplement?"
- "Compare omega-3 supplements"

### 3. Backend Endpoints

#### Symptom Checker
```
POST /api/symptom-checker
Body: { "symptom": "I have joint pain" }

Response:
{
  "categories": ["Joint Health", "Omega-3 Supplement"],
  "explanation": "Based on your description of \"I have joint pain\", I've identified this as related to \"joint pain\". I recommend exploring Joint Health and Omega-3 Supplement products that can help address these concerns.",
  "products": [array of relevant products],
  "confidence": "high",
  "source": "mapping",
  "clarification": null
}
```

#### Available Symptoms
```
GET /api/symptom-checker/available-symptoms

Response:
{
  "symptoms": ["tired", "fatigue", "joint pain", ...],
  "total": 45
}
```

### 4. Frontend Integration

The ChatBot component now:
1. Detects symptom queries using `detectSymptomQuery()` utility
2. Routes symptom queries to `/symptom-checker` endpoint  
3. Routes product queries to `/ai/chat` endpoint
4. Displays responses using the same AgentBubble + ProductLink UI
5. Shows clarification questions when confidence is low

### 5. Symptom Mapping System

Located in `/backend/src/data/symptomMapping.json`:
- Maps symptom keywords to product categories
- Easy to extend with new symptoms
- Fallback to AI when no mapping found
- Confidence scoring for better UX

## Usage Flow

1. User types symptom (e.g., "I'm tired")
2. Frontend detects it's a symptom query
3. Calls `/symptom-checker` instead of `/ai/chat`
4. Backend checks `symptomMapping.json` first
5. If found → high confidence response
6. If not found → AI fallback with confidence scoring
7. Returns structured response with products
8. Frontend displays explanation + product cards
9. Includes clarification questions if needed

## Benefits

✅ **Fast Response**: Direct mapping for common symptoms  
✅ **AI Fallback**: Handles complex/unknown symptoms  
✅ **Confidence Scoring**: Better user experience  
✅ **Extensible**: Easy to add new symptom mappings  
✅ **Preserved Functionality**: Existing chat still works  
✅ **Structured Output**: Consistent response format  
✅ **Clarifying Questions**: Improves accuracy over time  
✅ **Smart Product Selection**: Returns only 3 most relevant products based on:
  - Cross-category relevance scoring
  - Ingredient comprehensiveness
  - Category priority (Multivitamin > Omega-3 > Probiotics, etc.)
  - Price sweet spot (15-40 USD range preferred)
  - Reduced noise and decision fatigue for users