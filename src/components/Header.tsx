import React from "react";
import { Code2 } from "lucide-react";

const Header: React.FC = () => (
  <header className="border-b border-neutral-200 bg-white">
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
        <h1 className="text-xl font-medium text-neutral-900 tracking-tight">
          Code Review
        </h1>
      </div>
    </div>
  </header>
);

export default Header;
