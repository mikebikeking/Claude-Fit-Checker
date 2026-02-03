import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCcw,
  Terminal
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { FormData, AssessmentResponse } from './EvaluationForm';
interface AssessmentResultProps {
  data: FormData;
  assessment: AssessmentResponse;
  onReset: () => void;
}

export function AssessmentResult({ data, assessment, onReset }: AssessmentResultProps) {
  if (!data || !assessment) {
    return (
      <div className="text-white p-8 bg-red-500/20 border border-red-500 rounded">
        <h2 className="text-xl font-bold mb-2">Error: Missing Data</h2>
        <p>Data: {data ? 'Present' : 'Missing'}</p>
        <p>Assessment: {assessment ? 'Present' : 'Missing'}</p>
      </div>
    );
  }
  
  // Map recommendation to UI config
  const getConfig = () => {
    const rec = assessment.recommendation;
    if (rec === 'Excellent Fit' || rec === 'Good Fit') {
      return {
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: CheckCircle2,
        title: assessment.recommendation,
        description: assessment.reasoning,
      };
    } else if (rec === 'Possible Fit') {
      return {
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: AlertTriangle,
        title: assessment.recommendation,
        description: assessment.reasoning,
      };
    } else {
      return {
        color: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: XCircle,
        title: assessment.recommendation,
        description: assessment.reasoning,
      };
    }
  };
  const config = getConfig();
  
  // Simplified animation variants to ensure visibility
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  try {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl mx-auto space-y-8">
          
          {/* Header Status */}
          <motion.div variants={item} className="text-center space-y-4">
            <div
              className={`inline-flex items-center justify-center p-4 rounded-full ${config.bg} ${config.color} mb-4`}>
              <config.icon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-text">{config.title}</h2>
            <p className="text-text-muted text-lg max-w-md mx-auto">
              {config.description}
            </p>
          </motion.div>

          {/* Reasoning Card */}
          <motion.div variants={item}>
            <Card className="bg-[#0D0D0E] border-zinc-800">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-text-muted border-b border-zinc-800 pb-4">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    Analysis Log
                  </span>
                </div>
                <div className="font-mono text-sm space-y-2 text-zinc-400">
                  <p>
                    <span className="text-blue-400">➜</span> Use Case: {data.useCase}
                  </p>
                  <p>
                    <span className="text-blue-400">➜</span> Scale:{' '}
                    {data.scale.toLocaleString()} req/mo
                  </p>
                  <p>
                    <span className="text-blue-400">➜</span> Latency: {data.latency === 'realtime' ? 'Real-time (<500ms)' : data.latency === 'batch' ? 'Batch' : 'Async'}
                  </p>
                  {data.budget && (
                    <p>
                      <span className="text-blue-400">➜</span> Budget: {data.budget}
                    </p>
                  )}
                  {data.compliance && (
                    <p>
                      <span className="text-blue-400">➜</span> Compliance: {data.compliance}
                    </p>
                  )}
                  <p className="pt-2 text-zinc-300">
                    <span className="text-green-400">✓</span> Analysis complete.
                    <br />
                    <span className="text-white">{assessment.reasoning}</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Key Considerations */}
          {assessment.considerations && assessment.considerations.length > 0 && (
            <motion.div variants={item}>
              <Card className="bg-[#0D0D0E] border-zinc-800">
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-text mb-4">Key Considerations</h3>
                  <ul className="space-y-3">
                    {assessment.considerations.map((consideration, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-text-muted text-sm">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          {assessment.nextSteps && assessment.nextSteps.length > 0 && (
            <motion.div variants={item}>
              <Card className="bg-[#0D0D0E] border-zinc-800">
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-text mb-4">Recommended Next Steps</h3>
                  <ul className="space-y-3">
                    {assessment.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-accent mt-1">{index + 1}.</span>
                        <span className="text-text-muted text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action */}
          <motion.div variants={item} className="flex justify-center pt-8">
            <Button
              variant="outline"
              onClick={onReset}
              leftIcon={<RefreshCcw className="w-4 h-4" />}>
          Start New Assessment
          </Button>
        </motion.div>
      </motion.div>
    );
  } catch (error) {
    console.error('Error rendering AssessmentResult:', error);
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Error Rendering Results</h2>
        <p className="text-red-400">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre className="mt-4 text-xs bg-black/50 p-4 rounded overflow-auto">
          {JSON.stringify({ data, assessment }, null, 2)}
        </pre>
      </div>
    );
  }
}