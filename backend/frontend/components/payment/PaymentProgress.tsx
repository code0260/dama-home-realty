'use client';

import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps?: string[];
  className?: string;
}

const defaultSteps = ['Booking Details', 'Payment Method', 'Payment Processing', 'Confirmation'];

export function PaymentProgress({
  currentStep,
  totalSteps = 4,
  steps = defaultSteps,
  className,
}: PaymentProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span className="font-semibold text-primary dark:text-white">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div
              key={stepNumber}
              className={cn(
                'flex flex-col items-center gap-2 flex-1',
                index < steps.length - 1 && 'relative'
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted &&
                    'bg-secondary border-secondary text-white shadow-md',
                  isCurrent &&
                    'bg-secondary/20 border-secondary text-secondary shadow-md',
                  isPending &&
                    'bg-gray-100 dark:bg-primary-800 border-gray-300 dark:border-primary-600 text-gray-400 dark:text-gray-500'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  'text-xs font-medium text-center max-w-[80px]',
                  isCompleted && 'text-secondary',
                  isCurrent && 'text-primary dark:text-white font-semibold',
                  isPending && 'text-gray-400 dark:text-gray-500'
                )}
              >
                {step}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-[50%] w-full h-0.5 -z-10',
                    isCompleted ? 'bg-secondary' : 'bg-gray-200 dark:bg-primary-700'
                  )}
                  style={{ width: 'calc(100% - 2.5rem)', left: 'calc(50% + 1.25rem)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

