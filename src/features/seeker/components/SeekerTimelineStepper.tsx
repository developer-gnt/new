import React from 'react';
import { Check, X } from 'lucide-react';
import type { AssistanceStatus } from '../types/seeker.types';

interface SeekerTimelineStepperProps {
  status: AssistanceStatus;
  compact?: boolean;
}

interface StepItem {
  number: number;
  label: string;
  sublabel: string;
}

const STEPS: StepItem[] = [
  { number: 1, label: 'Submitted', sublabel: 'Request received' },
  { number: 2, label: 'Review', sublabel: 'Document verification' },
  { number: 3, label: 'Field Visit', sublabel: 'Background assessment' },
  { number: 4, label: 'Decision', sublabel: 'Approval & aid release' },
];

export const SeekerTimelineStepper: React.FC<SeekerTimelineStepperProps> = ({
  status,
  compact = false,
}) => {
  let currentStep = 1;
  let isRejected = false;
  let isApproved = false;

  switch (status) {
    case 'PENDING':
      currentStep = 1;
      break;
    case 'UNDER_REVIEW':
      currentStep = 2;
      break;
    case 'APPROVED':
      currentStep = 4;
      isApproved = true;
      break;
    case 'REJECTED':
      currentStep = 4;
      isRejected = true;
      break;
    case 'CLOSED':
      currentStep = 4;
      isApproved = true;
      break;
    default:
      currentStep = 1;
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {STEPS.map((step, idx) => {
          const isPast = step.number < currentStep || (step.number === 4 && (isApproved || isRejected));
          const isCurrent = step.number === currentStep && !isApproved && !isRejected;
          const isLast = idx === STEPS.length - 1;

          let circleBg = 'bg-[#E2E8F0]';
          let textColor = 'text-[#64748B]';
          let iconContent: React.ReactNode = <span>{step.number}</span>;

          if (isPast) {
            if (step.number === 4 && isRejected) {
              circleBg = 'bg-rose-500 text-white';
              textColor = 'text-white';
              iconContent = <X size={14} strokeWidth={3} />;
            } else {
              circleBg = 'bg-emerald-500 text-white';
              textColor = 'text-white';
              iconContent = <Check size={14} strokeWidth={3} />;
            }
          } else if (isCurrent) {
            circleBg = 'bg-[#0D9488] text-white animate-pulse';
            textColor = 'text-white';
            iconContent = <span className="font-bold text-xs">{step.number}</span>;
          }

          let labelTitle = step.label;
          if (step.number === 4) {
            if (isRejected) labelTitle = 'Rejected';
            else if (isApproved) labelTitle = 'Approved';
          }

          return (
            <React.Fragment key={step.number}>
              {/* Step Node */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${circleBg} ${textColor}`}
                >
                  {iconContent}
                </div>

                {!compact && (
                  <div className="text-center mt-1.5 max-w-[80px] md:max-w-[110px]">
                    <div
                      className={`text-xs font-bold tracking-tight truncate ${
                        isRejected && step.number === 4
                          ? 'text-rose-600'
                          : isApproved && step.number === 4
                          ? 'text-emerald-600'
                          : isCurrent || isPast
                          ? 'text-[#06294D]'
                          : 'text-gray-400'
                      }`}
                    >
                      {labelTitle}
                    </div>
                    <div className="text-[10px] text-gray-500 hidden sm:block truncate mt-0.5">
                      {step.sublabel}
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting Bar */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-1 md:mx-2 transition-all ${
                    step.number < currentStep ? 'bg-emerald-500' : 'bg-[#E2E8F0]'
                  }`}
                  style={{ marginTop: compact ? '0' : '-18px' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

