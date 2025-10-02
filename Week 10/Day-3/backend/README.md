# Healthcare AI Week 10 Day 3

A comprehensive healthcare AI backend built with NestJS that provides intelligent product recommendations, symptom checking, and AI-powered health consultations.

## 🚀 Features

### Core Features
- **User Authentication** - JWT-based authentication system
- **Product Management** - Healthcare products database with search and filtering
- **AI Chat Assistant** - Intelligent health consultation powered by Google's Gemini AI
- **Symptom Checker** - Advanced symptom detection and product recommendation system

### AI Capabilities
- Natural language processing for health queries
- Context-aware product recommendations
- Multi-modal chat interface support
- Health-focused response filtering and safety measures

## 📊 Symptom Checker Progress

### ✅ Completed Features

#### 1. **Backend Implementation**
- **Symptom Detection Service** (`src/symptom-checker/symptom-checker.service.ts`)
  - Rule-based symptom mapping system
  - Fuzzy matching algorithm for symptom recognition
  - Confidence scoring (high/medium/low)
  - Category-based product recommendations
  
- **API Endpoints** (`src/symptom-checker/symptom-checker.controller.ts`)
  - `POST /symptom-checker` - Check symptoms and get product recommendations
  - `GET /symptom-checker/available-symptoms` - List all available symptom mappings
  - `POST /symptom-checker/add-mapping` - Add new symptom-to-category mappings

- **AI Integration** (`src/ai/ai.service.ts`)
  - Seamless integration with AI chat system
  - Symptom hints passed to AI for context-aware responses
  - Enhanced product recommendation accuracy

#### 2. **Frontend Implementation**
- **Symptom Detection Utility** (`frontend/src/utils/symptomDetection.ts`)
  - Real-time symptom query detection
  - Pattern matching for health-related messages
  - Automatic routing to appropriate endpoints

- **Chat Integration**
  - Modularized ChatBot component (reduced from 600 to 160 lines)
  - Seamless symptom checker integration
  - Enhanced user experience with intelligent routing

#### 3. **Data Management**
- **Symptom Mapping Database** (`src/data/symptomMapping.json`)
  - Comprehensive symptom-to-category mappings
  - Support for multiple categories per symptom
  - Extensible JSON-based configuration

### 🔧 Technical Implementation

#### Symptom Detection Algorithm
```typescript
// Multi-layered matching approach:
1. Exact symptom match (confidence: high)
2. Word-based fuzzy matching (confidence: medium/high)
3. Substring matching (confidence: low)
4. AI fallback for unrecognized symptoms
```

#### API Response Structure
```typescript
interface SymptomCheckerResponse {
  categories: string[];           // Recommended product categories
  explanation: string;           // Human-readable explanation
  products: Product[];          // Relevant products
  confidence: 'high'|'medium'|'low'; // Match confidence
  source: 'mapping'|'ai_fallback';   // Detection method
  clarification?: string;        // Additional context
}
```

#### Integration Flow
```
User Message → Symptom Detection → AI Processing → Product Recommendations
     ↓              ↓                   ↓                    ↓
"Joint pain"  → Joint Health     → Enhanced AI     → Omega-3, Glucosamine
              → Omega-3           Response         → Anti-inflammatory
```

### 📈 Current Capabilities

#### Supported Symptom Categories
- **Pain Management**: Joint pain, back pain, headaches, muscle aches
- **Energy & Fatigue**: Tiredness, weakness, low energy, exhaustion
- **Mental Health**: Stress, anxiety, depression, mood issues
- **Sleep Issues**: Insomnia, restlessness, sleep quality
- **Digestive Health**: Bloating, gas, constipation, stomach issues
- **Skin & Hair**: Acne, dry skin, hair loss, skin conditions
- **Cognitive Function**: Memory issues, concentration, brain fog
- **Immune System**: Frequent infections, low immunity
- **Heart Health**: Cardiovascular concerns, cholesterol
- **Bone Health**: Osteoporosis, calcium deficiency

#### Confidence Levels
- **High Confidence (≥70% match)**: Direct symptom mapping found
- **Medium Confidence (50-69% match)**: Partial keyword matching
- **Low Confidence (30-49% match)**: Substring or fuzzy matching
- **AI Fallback (<30% match)**: AI-powered interpretation

### 🎯 Current Status: **75% Complete**

#### ✅ What's Working
- Core symptom detection and mapping
- API endpoints fully functional
- AI integration with context hints
- Frontend detection and routing
- Comprehensive symptom database
- Confidence scoring system

#### 🚧 In Progress
- **Enhanced AI Responses**: Improving AI's understanding of complex symptoms
- **User Feedback Loop**: Collecting user feedback to improve accuracy
- **Analytics Dashboard**: Tracking symptom query patterns

#### 📋 Upcoming Features
- **Personalized Recommendations**: User profile-based suggestions
- **Symptom History Tracking**: Long-term health pattern analysis
- **Integration with Health APIs**: External health data sources
- **Advanced NLP**: Machine learning-based symptom recognition
- **Multi-language Support**: Symptom detection in multiple languages

### 🧪 Testing Examples

#### Successful Symptom Detection
```bash
# Joint Pain Detection
curl -X POST http://localhost:3000/api/symptom-checker \
  -H "Content-Type: application/json" \
  -d '{"symptom": "I have severe joint pain in my knees"}'

# Response: Categories ["Joint Health", "Omega-3 Supplement"], confidence: "high"

# Sleep Issues Detection  
curl -X POST http://localhost:3000/api/symptom-checker \
  -H "Content-Type: application/json" \
  -d '{"symptom": "I can'\''t sleep and feel restless"}'

# Response: Categories ["Sleep Support"], confidence: "high"
```

#### AI Integration Example
```bash
# Chat with symptom context
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have joint pain and need help"}'

# AI receives symptom hint: "joint pain" → "Joint Health" category
# Response includes contextual product recommendations
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- pnpm

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm run start:dev
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/healthcare-ai
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
```

## 📚 API Documentation

### Authentication
All endpoints require JWT authentication except `/auth/login` and `/auth/register`.

### Core Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /products` - List products with filters
- `POST /ai/chat` - AI chat with symptom integration
- `POST /symptom-checker` - Direct symptom checking
- `GET /symptom-checker/available-symptoms` - List symptom mappings

### Response Formats
All responses follow standardized formats with proper error handling and validation.

## 🔧 Architecture

### Technology Stack
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini AI
- **Authentication**: JWT
- **Validation**: class-validator
- **Testing**: Jest

### Project Structure
```
src/
├── ai/                 # AI service and chat functionality
├── auth/               # Authentication system
├── products/           # Product management
├── symptom-checker/    # Symptom detection system
├── users/              # User management
└── shared/             # Shared DTOs and utilities
```

## 🚀 Deployment

The application is configured for deployment on Vercel with:
- Environment-based configuration
- Production MongoDB Atlas integration
- Optimized build process
- Health check endpoints

## 📈 Performance & Monitoring

- Response time optimization for AI queries
- Caching for frequently accessed product data
- Comprehensive logging for symptom detection accuracy
- Error tracking and monitoring

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting on AI endpoints
- Health information privacy compliance
- Secure environment variable management

## 🤝 Contributing

This is an active development project with ongoing enhancements to the symptom checker and AI capabilities. The system is designed to be extensible and maintainable.

---

**Project Status**: Active Development | **Symptom Checker**: 75% Complete | **Last Updated**: October 2025
