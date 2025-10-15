import React, { useState, useRef } from "react";
import { Upload, FileCode, AlertCircle, TrendingUp, AlertTriangle, Info } from "lucide-react";
import axios from "axios";
import { DiffEditor } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";
import { ReviewData } from "../App";

interface FileUploadProps {
  setReviewData: (data: ReviewData | null) => void;
  setLoading: (loading: boolean) => void;
  reviewData: ReviewData | null;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ setReviewData, setLoading, reviewData, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setReviewData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/review/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let data;
      try {
        data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      } catch {
        throw new Error("Invalid response from AI review");
      }

      if (data.success) {
        setReviewData(data.data);
      } else {
        setError("No review received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch review from server.");
    } finally {
      setLoading(false);
    }
  };

  const diffOptions = { readOnly: true, renderSideBySide: true };

  const highlightComments = (editor: monacoEditor.editor.IStandaloneDiffEditor, diff: ReviewData["diffs"][0]) => {
    const decorations = diff.comments.map((c) => ({
      range: new monacoEditor.Range(c.line, 1, c.line, 1),
      options: {
        isWholeLine: true,
        className:
          c.severity === "high"
            ? "commentLineHigh"
            : c.severity === "medium"
            ? "commentLineMedium"
            : "commentLineLow",
        hoverMessage: { value: c.message },
      },
    }));
    editor.getModifiedEditor().deltaDecorations([], decorations);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-neutral-900 tracking-tight">
          Upload code for review
        </h2>
        <p className="text-sm text-neutral-500">
          Drop your file or click to browse
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          dragActive
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-200 hover:border-neutral-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs"
        />

        <div
          className="py-16 px-6 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileCode className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-neutral-600">
                  Drop file here or click to upload
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Supports JS, TS, Python, Java, C++, Go, Rust
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {file && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 px-4 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-neutral-500">
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Analyzing code</span>
          </div>
        </div>
      )}

      {reviewData && !loading && (
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <h3 className="text-lg font-medium text-neutral-900">{reviewData.projectName}</h3>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(reviewData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                <h4 className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Total Issues</h4>
              </div>
              <p className="text-2xl font-light text-neutral-900">{reviewData.summary.totalIssues}</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                <h4 className="text-xs font-medium text-neutral-600 uppercase tracking-wide">By Severity</h4>
              </div>
              <div className="space-y-1">
                {Object.entries(reviewData.summary.bySeverity as Record<string, number>).map(
                  ([sev, count]) => (
                    <p key={sev} className="text-xs text-neutral-700">
                      <span className="capitalize">{sev}</span>: {count}
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                <h4 className="text-xs font-medium text-neutral-600 uppercase tracking-wide">By Category</h4>
              </div>
              <div className="space-y-1">
                {Object.entries(reviewData.summary.byCategory as Record<string, number>).map(
                  ([cat, count]) => (
                    <p key={cat} className="text-xs text-neutral-700">
                      {cat}: {count}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {reviewData.diffs.map((diff) => (
            <div key={diff.file} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                <h4 className="text-sm font-medium text-neutral-900">{diff.file}</h4>
                <p className="text-xs text-neutral-500 mt-0.5 capitalize">{diff.status}</p>
              </div>

              <DiffEditor
                height="400px"
                language="javascript"
                original={diff.oldCode || "// empty"}
                modified={diff.newCode || "// empty"}
                options={diffOptions}
                onMount={(editor) => highlightComments(editor, diff)}
              />

              {diff.comments.length > 0 && (
                <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                  <h5 className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-3">Comments</h5>
                  <div className="space-y-2">
                    {diff.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`p-3 rounded border text-xs ${
                          c.severity === "high"
                            ? "bg-red-50 border-red-200"
                            : c.severity === "medium"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-neutral-500 font-mono">Line {c.line}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
                              c.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : c.severity === "medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {c.severity}
                          </span>
                        </div>
                        <p className="text-neutral-700 mt-1">{c.message}</p>
                        <p className="text-neutral-500 mt-1 text-xs">Category: {c.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <style>
            {`
              .commentLineHigh { background-color: rgba(239, 68, 68, 0.1); }
              .commentLineMedium { background-color: rgba(249, 115, 22, 0.1); }
              .commentLineLow { background-color: rgba(156, 163, 175, 0.1); }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
