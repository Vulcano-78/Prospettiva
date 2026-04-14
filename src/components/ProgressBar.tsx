'use client';

interface Step {
  number: number;
  label: string;
}

interface ProgressBarProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { number: 1, label: 'Carrello' },
  { number: 2, label: 'Dati' },
  { number: 3, label: 'Pagamento' }
];

export default function ProgressBar({ currentStep, steps = defaultSteps }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step.number < currentStep
                  ? 'bg-[#2db92d] text-[#2db92d]'
                  : step.number === currentStep
                  ? 'bg-[#002147] text-white'
                  : 'bg-[#e7e8e9] text-[#44474e]'
              }`}
            >
              {step.number < currentStep ? (
                <span className="material-symbols-outlined text-lg">check</span>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                step.number < currentStep
                  ? 'font-bold text-[#2db92d]'
                  : step.number === currentStep
                  ? 'font-bold text-[#002147]'
                  : 'text-[#44474e]'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`h-[2px] w-16 md:w-24 mx-4 relative top-[-10px] transition-colors ${
                step.number < currentStep
                  ? 'bg-[#2db92d]'
                  : 'bg-[#e1e3e4]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
