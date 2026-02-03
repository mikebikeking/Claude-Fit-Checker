import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero3D } from './components/Hero3D';
import { EvaluationForm, FormData, AssessmentResponse } from './components/EvaluationForm';
import { AssessmentResult } from './components/AssessmentResult';
export function App() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFormSubmit = (data: FormData, assessmentData: AssessmentResponse) => {
    setFormData(data);
    setAssessment(assessmentData);
    setError(null);
    setStep('result');
  };
  
  const handleError = (errorMessage: string) => {
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full glass-panel rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/50">
              <EvaluationForm onSubmit={handleFormSubmit} onError={handleError} />
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
          <p>ENGINEERED FOR PRECISION • V1.0.4</p>
        </footer>
      </main>
    </div>);

}