interface GuideStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function GuideStep({
  stepNumber,
  title,
  description,
  children,
}: GuideStepProps) {
  return (
    <div className="browser-window bg-white">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          STEP {stepNumber}
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-12 h-12 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="hand-drawn text-2xl font-bold text-black">{stepNumber}</span>
            </div>
            <div>
              <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black">
                {title}
              </h2>
              <p className="hand-drawn text-base font-semibold text-gray-700 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-black pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

