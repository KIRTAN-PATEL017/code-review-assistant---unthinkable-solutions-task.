import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  reviewText: string;
}

const CodeReviewResult: React.FC<Props> = ({ reviewText }) => {
  return (
    <div className="mt-12 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
        <CheckCircle2 className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-neutral-900">Review Complete</h3>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <pre className="whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed font-mono">
          {reviewText}
        </pre>
      </div>
    </div>
  );
};

export default CodeReviewResult;
