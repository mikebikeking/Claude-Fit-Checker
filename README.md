# Claude Fit-Check

A React + Vite application for evaluating Claude API fit for your use case, with an Express backend that uses Claude AI to provide intelligent assessments.

## 🌐 Live Preview

**[View Live Demo](https://claude-fit-checker.vercel.app/)**

## About This Project

I built Claude Fit-Check to demonstrate how I approach technical advisory work. I recognize that effective customer guidance isn't always about making the sale—it's about honestly assessing fit.

This tool evaluates whether Claude API is the right choice for a company's specific constraints: use case suitability, scale feasibility, latency match, cost-effectiveness, and compliance capabilities. Sometimes the answer is "excellent fit." Often, it's "not recommended" or "hybrid approach needed."

**Why this matters**: Solutions engineers need to understand customer problems deeply and be honest about trade-offs. This project demonstrates that thinking.

**Tech**: React + Vite frontend, Express backend with Claude API integration, deployed on Vercel.

## Features

- **Interactive Form**: Collects use case, scale, latency, budget, and compliance requirements
- **AI-Powered Evaluation**: Uses Claude API to analyze fit based on multiple criteria
- **Detailed Assessment**: Provides recommendation, reasoning, considerations, and next steps
- **Modern UI**: Beautiful, responsive interface with smooth animations

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Setup

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create .env file from example
cp env.example .env
```

### 3. Configure API Key

Edit `backend/.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=5000
```

## Running the Application

You need to run both the frontend and backend servers simultaneously.

### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### Terminal 2 - Frontend Server

```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### POST `/api/evaluate`

Evaluates Claude API fit based on form data.

**Request Body:**
```json
{
  "useCase": "support",
  "scale": 100000,
  "latency": "realtime",
  "budget": "$2000",
  "compliance": "SOC2, GDPR"
}
```

**Response:**
```json
{
  "recommendation": "Excellent Fit" | "Good Fit" | "Possible Fit" | "Not Recommended",
  "reasoning": "2-3 sentences explaining the assessment",
  "considerations": ["factor 1", "factor 2", "factor 3", "factor 4"],
  "nextSteps": ["action 1", "action 2", "action 3"]
}
```

### GET `/api/health`

Health check endpoint.

## Project Structure

```
.
├── backend/
│   ├── server.js          # Express server
│   ├── package.json        # Backend dependencies
│   ├── env.example         # Environment variables template
│   └── .env                # Your environment variables (create this)
├── src/
│   ├── components/
│   │   ├── EvaluationForm.tsx    # Form component
│   │   ├── AssessmentResult.tsx  # Results display
│   │   └── ui/                   # UI components
│   └── App.tsx                   # Main app component
└── package.json                   # Frontend dependencies
```

## Troubleshooting

### Backend won't start
- Ensure `ANTHROPIC_API_KEY` is set in `backend/.env`
- Check that port 5000 is not already in use
- Verify all backend dependencies are installed: `cd backend && npm install`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify the API endpoint URL in `EvaluationForm.tsx`

### API errors
- Verify your Anthropic API key is valid
- Check API rate limits
- Review backend console logs for detailed error messages

## Development

### Backend Development Mode (with auto-reload)
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
npm run dev
```


