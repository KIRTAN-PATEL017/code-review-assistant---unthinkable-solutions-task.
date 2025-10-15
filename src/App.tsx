import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Header from "./components/Header";

export interface ReviewData {
  id: string;
  projectName: string;
  timestamp: string;
  diffs: Array<{
    file: string;
    path: string;
    status: string;
    oldCode: string;
    newCode: string;
    comments: Array<{
      id: string;
      line: number;
      message: string;
      category: string;
      severity: "low" | "medium" | "high";
    }>;
  }>;
  summary: {
    totalIssues: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
  };
}

function App() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <FileUpload
          setReviewData={setReviewData}
          setLoading={setLoading}
          reviewData={reviewData}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
