import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { SegmentedControl } from './ui/SegmentedControl';
export interface FormData {
  useCase: string;
  scale: number;
  latency: string;
  budget: string;
  compliance: string;
}

export interface AssessmentResponse {
  recommendation: 'Excellent Fit' | 'Good Fit' | 'Possible Fit' | 'Not Recommended';
  reasoning: string;
  considerations: string[];
  nextSteps: string[];
}

interface EvaluationFormProps {
  onSubmit: (data: FormData, assessment: AssessmentResponse) => void;
  onError?: (error: string) => void;
}
const USE_CASES = [
{
  value: 'support',
  label: 'Customer Support Agent'
},
{
  value: 'content',
  label: 'Content Generation'
},
{
  value: 'code',
  label: 'Code Analysis & Refactoring'
},
{
  value: 'extraction',
  label: 'Data Extraction'
},
{
  value: 'research',
  label: 'Research Assistant'
},
{
  value: 'other',
  label: 'Other'
}];

const LATENCY_OPTIONS = [
{
  value: 'realtime',
  label: 'Real-time (<500ms)'
},
{
  value: 'batch',
  label: 'Batch'
},
{
  value: 'async',
  label: 'Async'
}];

export function EvaluationForm({ onSubmit, onError }: EvaluationFormProps) {
  const [data, setData] = useState<FormData>({
    useCase: '',
    scale: 100000,
    latency: 'realtime',
    budget: '',
    compliance: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to evaluate request' }));
        let errorMessage = errorData.error || `Server error: ${response.status}`;
        
        // Include additional details if available
        if (errorData.details) {
          if (typeof errorData.details === 'string') {
            errorMessage += `\n\nDetails: ${errorData.details}`;
          } else if (errorData.details.message) {
            errorMessage += `\n\nDetails: ${errorData.details.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      let assessment: AssessmentResponse;
      try {
        const responseText = await response.text();
        assessment = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Failed to parse server response');
      }
      
      // Validate assessment structure
      if (!assessment || !assessment.recommendation) {
        console.error('Invalid assessment structure:', assessment);
        throw new Error('Invalid response format from server');
      }
      
      onSubmit(data, assessment);
    } catch (error) {
      console.error('Evaluation error:', error);
      let errorMessage = 'Failed to evaluate request. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatScale = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M req/mo`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k req/mo`;
    return `${val} req/mo`;
  };
  return (
    <motion.form
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -20
      }}
      transition={{
        duration: 0.5
      }}
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-lg mx-auto">

      <div className="space-y-6">
        <Select
          label="Primary Use Case"
          value={data.useCase}
          options={USE_CASES}
          onChange={(val) =>
          setData({
            ...data,
            useCase: val
          })
          }
          placeholder="Select use case..." />


        <Slider
          label="Projected Scale"
          value={data.scale}
          min={100000}
          max={10000000}
          step={1000}
          onChange={(val) =>
          setData({
            ...data,
            scale: val
          })
          }
          formatValue={formatScale} />


        <SegmentedControl
          label="Latency Requirement"
          value={data.latency}
          options={LATENCY_OPTIONS}
          onChange={(val) =>
          setData({
            ...data,
            latency: val
          })
          } />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Monthly Budget Est."
            placeholder="$500 - $5,000"
            value={data.budget}
            onChange={(e) =>
            setData({
              ...data,
              budget: e.target.value
            })
            } />

          <Input
            label="Compliance"
            placeholder="SOC2, HIPAA, GDPR..."
            value={data.compliance}
            onChange={(e) =>
            setData({
              ...data,
              compliance: e.target.value
            })
            } />

        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          isLoading={isSubmitting}
          disabled={!data.useCase || isSubmitting}>

          Run Assessment
        </Button>
        <p className="text-center text-xs text-text-muted mt-4">
          By clicking run, you agree to our terms of evaluation.
        </p>
      </div>
    </motion.form>);

}