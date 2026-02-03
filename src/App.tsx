import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Hero3D } from './components/Hero3D';
import { EvaluationForm, FormData, AssessmentResponse } from './components/EvaluationForm';
import { AssessmentResult } from './components/AssessmentResult';
export function App() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFormSubmit = (data: FormData, assessmentData: AssessmentResponse) => {
    setIsLoading(false);
    setFormData(data);
    setAssessment(assessmentData);
    setError(null);
    setStep('result');
  };
  
  const handleError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
  };
  
  const handleReset = () => {
    setStep('form');
    setFormData(null);
    setAssessment(null);
    setError(null);
  };
  return (
    <div className="min-h-screen w-full bg-bg text-text selection:bg-accent/30 selection:text-white overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
              Anthropic Implementation Evaluator
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Claude{' '}
            <span className="text-blue-400">
              Fit-Check
            </span>
          </h1>
          <p className="text-text-muted max-w-xl text-lg">
            Assess the technical and economic viability of integrating Claude
            into your architecture.
          </p>
        </header>

        {/* 3D Hero Element - Only show on form step to reduce noise on result */}
        <AnimatePresence>
          {step === 'form' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.8
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 pointer-events-none opacity-60 mix-blend-screen">

              <Hero3D />
            </motion.div>
          }
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400/20 rounded-full" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Analyzing Fit</h2>
                  <p className="text-text-muted text-sm max-w-md">
                    Evaluating your use case against Claude API capabilities...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full glass-panel rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/50">
              <EvaluationForm 
                onSubmit={handleFormSubmit} 
                onError={handleError}
                onLoadingChange={setIsLoading}
              />
              {error && (
                <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full">
              {assessment && formData ? (
                <AssessmentResult data={formData} assessment={assessment} onReset={handleReset} />
              ) : (
                <div className="text-white p-8">
                  <p>Loading assessment...</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-xs text-text-muted/40 font-mono">
          <p>ENGINEERED FOR PRECISION • © Mike King 2026</p>
        </footer>
      </main>
    </div>);

}