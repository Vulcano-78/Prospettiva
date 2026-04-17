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
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                step.number < currentStep
                  ? 'bg-[#70dc70] text-[#28a428]'
                  : step.number === currentStep
                  ? 'bg-[#002147] text-white'
                  : 'bg-[#e7e8e9] text-[#44474e]'
              }`}
            >
              {step.number < currentStep ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-[10px] font-medium transition-colors ${
                step.number < currentStep
                  ? 'font-bold text-[#28a428]'
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
              className={`h-[1.5px] w-12 md:w-20 mx-3 relative top-[-8px] transition-colors ${
                step.number < currentStep
                  ? 'bg-[#70dc70]'
                  : 'bg-[#e1e3e4]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
