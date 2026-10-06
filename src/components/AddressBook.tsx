import React, { useEffect, useState } from 'react';
import {
  BookMarked,
  Save,
  Upload,
  Trash2,
  FileOutput,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import {
  AddressBookList,
  getAddressBookLists,
  saveAddressBookList,
  deleteAddressBookList,
  updateAddressBookList,
} from '../utils/addressBook';
import { exportToCSV } from '../utils/csv';
import { RecipientInput } from '../utils/validation';

interface AddressBookProps {
  currentRecipients: RecipientInput[];
  onLoad: (recipients: RecipientInput[]) => void;
  tokenSymbol: string;
}

const toRecipientInputs = (recipients: { address: string; amount: string }[]): RecipientInput[] =>
  recipients.map((r) => ({
    id: `ab-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    address: r.address,
    amount: r.amount,
  }));

export const AddressBook: React.FC<AddressBookProps> = ({
  currentRecipients,
  onLoad,
  tokenSymbol,
}) => {
  const [lists, setLists] = useState<AddressBookList[]>([]);
  const [listName, setListName] = useState('');
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLists(getAddressBookLists());
  }, []);

  const flash = (type: 'error' | 'success', text: string) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const nonEmptyCount = currentRecipients.filter(
    (r) => r.address.trim() !== '' || r.amount.trim() !== ''
  ).length;

  const handleSave = () => {
    const { list, error } = saveAddressBookList(
      listName,
      currentRecipients.map((r) => ({ address: r.address, amount: r.amount }))
    );
    if (error || !list) {
      flash('error', error ?? 'Could not save list.');
      return;
    }
    setLists(getAddressBookLists());
    setListName('');
    flash('success', `Saved "${list.name}" (${list.recipients.length} recipients).`);
  };

  const handleLoad = (list: AddressBookList) => {
    onLoad(toRecipientInputs(list.recipients));
    flash('success', `Loaded "${list.name}" into the recipient table.`);
  };

  const handleUpdate = (list: AddressBookList) => {
    const { ok, error } = updateAddressBookList(
      list.id,
      currentRecipients.map((r) => ({ address: r.address, amount: r.amount }))
    );
    if (!ok) {
      flash('error', error ?? 'Could not update list.');
      return;
    }
    setLists(getAddressBookLists());
    flash('success', `Updated "${list.name}" with the current table.`);
  };

  const handleExport = (list: AddressBookList) => {
    const csvContent = exportToCSV(toRecipientInputs(list.recipients));
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `addressbook_${list.name.replace(/[^a-z0-9]+/gi, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      window.setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 4000);
      return;
    }
    setLists(deleteAddressBookList(id));
    setConfirmDeleteId(null);
    flash('success', 'List deleted.');
  };

  return (
    <div className="bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center text-[#F3BA2F] shrink-0">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">Address Book</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Save recipient lists and reload them in one click — built for repeat payrolls & airdrops.
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono font-semibold text-slate-300 self-start sm:self-auto">
          <span className="text-[#F3BA2F]">{lists.length}</span> saved
        </div>
      </div>

      {/* Save current table */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder='Name this list — e.g. "October payroll"'
          maxLength={60}
          className="flex-1 px-3.5 py-2.5 bg-[#080B12] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F3BA2F] transition-all"
        />
        <button
          onClick={handleSave}
          disabled={nonEmptyCount === 0}
          className="px-4 py-2.5 bg-[#F3BA2F] hover:bg-[#f7be33] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B0F17] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save current table ({nonEmptyCount})</span>
        </button>
      </div>

      {notice && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2.5 font-mono border ${
            notice.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {notice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Saved lists */}
      <div className="mt-4 space-y-2.5">
        {lists.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4 border border-dashed border-white/10 rounded-xl">
            No saved lists yet. Fill the recipient table above, name it, and hit save.
          </p>
        )}

        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-[#05070B] border border-white/10 hover:border-white/20 rounded-xl p-3.5 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 flex items-center justify-center text-[#F3BA2F] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{list.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {list.recipients.length} recipients · {tokenSymbol} ·{' '}
                    {new Date(list.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  onClick={() => handleLoad(list)}
                  title="Load into recipient table"
                  className="px-3 py-2 bg-[#F3BA2F]/10 hover:bg-[#F3BA2F]/20 text-[#F3BA2F] border border-[#F3BA2F]/30 font-semibold text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Load</span>
                </button>
                <button
                  onClick={() => handleUpdate(list)}
                  title="Overwrite with current table"
                  className="px-3 py-2 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Update</span>
                </button>
                <button
                  onClick={() => handleExport(list)}
                  title="Export as CSV"
                  className="px-3 py-2 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileOutput className="w-3.5 h-3.5 text-slate-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleDelete(list.id)}
                  title="Delete list"
                  className={`px-3 py-2 font-medium text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    confirmDeleteId === list.id
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-transparent hover:bg-red-500/10 text-slate-500 hover:text-red-400'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmDeleteId === list.id ? 'Confirm?' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
