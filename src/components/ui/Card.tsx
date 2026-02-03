import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      className={`
        bg-surface border border-border rounded-xl overflow-hidden
        ${className}
      `}
      whileHover={
      hover ?
      {
        y: -2,
        borderColor: 'var(--color-accent)'
      } :
      undefined
      }
      transition={{
        duration: 0.2
      }}>

      {children}
    </motion.div>);

}