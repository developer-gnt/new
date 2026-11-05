import React from 'react';
import { Check } from 'lucide-react';

export interface ComplaintProgressProps {
  currentStep: number; // 1, 2, 3
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { id: 1, label: 'Complaint Details' },
  { id: 2, label: 'Your Details' },
  { id: 3, label: 'Review & Submit' },
];

export const ComplaintProgress: React.FC<ComplaintProgressProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-3 px-2">
      <div className="flex items-center justify-between relative">
        {/* Continuous connector line background */}
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200 -z-0" />

        {STEPS.map(step => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              <button
                type="button"
                disabled={!isCompleted && !isActive}
                onClick={() => isCompleted && onStepClick?.(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs ${
                  isActive
                    ? 'bg-[#E9B82E] text-[#06294D] ring-4 ring-[#E9B82E]/25 scale-105'
                    : isCompleted
                    ? 'bg-[#06294D] text-white cursor-pointer hover:bg-[#083563]'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
              </button>

              <span
                className={`text-[11px] sm:text-xs mt-1.5 font-bold tracking-tight text-center max-w-[100px] leading-tight ${
                  isActive
                    ? 'text-[#06294D]'
                    : isCompleted
                    ? 'text-[#06294D]'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
