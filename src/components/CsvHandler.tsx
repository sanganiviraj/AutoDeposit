import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
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
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            CSV Import / Export
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Bulk load addresses and amounts via CSV format (<code className="text-slate-300">address,amount</code>). Max 100 rows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={handleDownloadSample}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Sample CSV
          </button>
          {currentRecipients.length > 0 && (
            <button
              onClick={handleExportCurrent}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              Export ({currentRecipients.length})
            </button>
          )}
        </div>
      </div>

      {csvError && (
        <div className="mt-3 p-3 bg-red-950/60 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{csvError}</span>
        </div>
      )}
    </div>
  );
};
