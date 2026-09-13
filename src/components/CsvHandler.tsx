import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, FileOutput } from 'lucide-react';
import { parseRecipientCSV, generateSampleCSV, exportToCSV } from '../utils/csv';
import { RecipientInput } from '../utils/validation';

interface CsvHandlerProps {
  onImport: (recipients: RecipientInput[]) => void;
  currentRecipients: RecipientInput[];
}

export const CsvHandler: React.FC<CsvHandlerProps> = ({ onImport, currentRecipients }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const { data, errors } = parseRecipientCSV(content);
        if (errors.length > 0) {
          setCsvError(errors.join(' | '));
        }
        if (data.length > 0) {
          onImport(data);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadSample = () => {
    const sample = generateSampleCSV();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'multisender_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrent = () => {
    const csvContent = exportToCSV(currentRecipients);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `recipients_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center text-[#F3BA2F] shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              CSV Batch Data Pipeline
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Bulk load addresses & amounts via CSV (<code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-amber-400 font-mono text-[11px]">address,amount</code>). Max 100 rows.
            </p>
          </div>
        </div>

        {/* Right Side: Cohesive Segmented Control Bar */}
        <div className="bg-[#05070B] p-1.5 border border-white/10 rounded-xl flex flex-wrap items-center gap-1.5 shrink-0 self-start md:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          {/* Import CSV */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-[#F3BA2F] hover:bg-[#f7be33] text-[#0B0F17] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          {/* Sample CSV */}
          <button
            onClick={handleDownloadSample}
            className="px-3.5 py-2 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Template</span>
          </button>

          {/* Export CSV */}
          {currentRecipients.length > 0 && (
            <button
              onClick={handleExportCurrent}
              className="px-3.5 py-2 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-l border-white/10 pl-3"
            >
              <FileOutput className="w-3.5 h-3.5 text-slate-400" />
              <span>Export ({currentRecipients.length})</span>
            </button>
          )}
        </div>
      </div>

      {csvError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5 font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{csvError}</span>
        </div>
      )}
    </div>
  );
};



