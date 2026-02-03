import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Evaluation endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'ANTHROPIC_API_KEY is not configured. Please add it to your .env file.',
      });
    }

    const { useCase, scale, latency, budget, compliance } = req.body;

    // Validate required fields
    if (!useCase || scale === undefined || !latency) {
      return res.status(400).json({
        error: 'Missing required fields: useCase, scale, and latency are required',
      });
    }

    // Build evaluation prompt
    const evaluationPrompt = `You are an expert technical consultant evaluating whether Claude API is a good fit for a client's use case. Analyze the following requirements and provide a comprehensive assessment.

**Client Requirements:**
- Primary Use Case: ${useCase}
- Projected Scale: ${scale.toLocaleString()} requests/month
- Latency Requirement: ${latency === 'realtime' ? 'Real-time (<500ms)' : latency === 'batch' ? 'Batch processing' : 'Async processing'}
- Monthly Budget Estimate: ${budget || 'Not specified'}
- Compliance Needs: ${compliance || 'None specified'}

**Evaluation Criteria:**
1. Use case suitability - How well does Claude API match this use case?
2. Scale feasibility - Can Claude handle this volume effectively?
3. Latency match - Does Claude's latency profile meet the requirement?
4. Cost-effectiveness - Is the budget sufficient for the projected scale?
5. Compliance capabilities - Can Claude meet the compliance requirements?

**Response Format:**
Provide a JSON response with the following structure:
{
  "recommendation": "Excellent Fit" | "Good Fit" | "Possible Fit" | "Not Recommended",
  "reasoning": "2-3 sentences explaining the assessment",
  "considerations": ["factor 1", "factor 2", "factor 3", "factor 4"],
  "nextSteps": ["action 1", "action 2", "action 3"]
}

Be specific, practical, and actionable in your assessment.`;

    // Call Claude API
    const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
    });

    // Extract response content
    if (!message.content || !message.content[0] || !message.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }
    const responseText = message.content[0].text;

    // Try to parse JSON from the response
    let assessment;
    try {
      // Extract JSON from the response (Claude might wrap it in markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error('Failed to parse Claude response as JSON:', parseError);
      assessment = {
        recommendation: 'Possible Fit',
        reasoning: responseText.substring(0, 200) + '...',
        considerations: [
          'Use case compatibility needs further evaluation',
          'Scale requirements should be validated with testing',
          'Cost analysis recommended',
          'Compliance requirements need verification',
        ],
        nextSteps: [
          'Review Claude API documentation for your specific use case',
          'Run a pilot test with a small subset of your workload',
          'Contact Anthropic sales for enterprise requirements',
        ],
      };
    }

    // Validate and ensure proper structure
    if (!assessment.recommendation) {
      assessment.recommendation = 'Possible Fit';
    }
    if (!assessment.reasoning) {
      assessment.reasoning = 'Evaluation completed. Please review the considerations and next steps.';
    }
    if (!Array.isArray(assessment.considerations)) {
      assessment.considerations = [];
    }
    if (!Array.isArray(assessment.nextSteps)) {
      assessment.nextSteps = [];
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error evaluating request:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      code: error.code,
    });
    
    // Check if API key is missing
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'ANTHROPIC_API_KEY is not set. Please add it to your .env file.',
      });
    }
    
    // Handle specific Anthropic API errors
    if (error.status === 401 || error.statusCode === 401) {
      return res.status(500).json({
        error: 'Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.',
      });
    }
    
    if (error.status === 429 || error.statusCode === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.',
      });
    }

    // Handle insufficient credits error (400 with credit balance message)
    if (error.status === 400 || error.statusCode === 400) {
      const errorMessage = error.message || '';
      const errorObj = error.error || {};
      const nestedError = errorObj.error || {};
      
      if (
        errorMessage.includes('credit balance') ||
        nestedError.message?.includes('credit balance')
      ) {
        return res.status(400).json({
          error: 'Insufficient API credits. Please add credits to your Anthropic account at https://console.anthropic.com/settings/plans',
        });
      }
    }

    // Provide more detailed error in development
    const errorMessage = error.message || 'Unknown error occurred';
    const errorDetails = {
      message: errorMessage,
      status: error.status,
      statusCode: error.statusCode,
      code: error.code,
    };
    
    // Always include details in development, or if it's a known API error
    const isDevelopment = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      error: 'Failed to evaluate request. Please try again.',
      ...(isDevelopment && { details: errorDetails }),
      ...(error.status && { apiStatus: error.status }),
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Claude Fit-Check API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      evaluate: '/api/evaluate (POST)',
    },
    status: 'running',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set. Please add it to your .env file.');
  }
});
