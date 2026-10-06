/**
 * Address Book — persistent, reusable recipient lists.
 *
 * Stored in localStorage (per-device, no backend). Each list captures a
 * named set of { address, amount } pairs that can be reloaded into the
 * sender table in one click — built for repeat payroll / airdrop flows.
 */

export interface SavedRecipient {
  address: string;
  amount: string;
}

export interface AddressBookList {
  id: string;
  name: string;
  createdAt: number;
  recipients: SavedRecipient[];
}

const STORAGE_KEY = 'bsc_usdt_multisender_addressbook_v1';
const MAX_LISTS = 50;
const MAX_NAME_LENGTH = 60;

function readRaw(): AddressBookList[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load address book:', err);
    return [];
  }
}

function writeRaw(lists: AddressBookList[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.error('Failed to save address book:', err);
  }
}

function makeId(): string {
  return `ab-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

export function getAddressBookLists(): AddressBookList[] {
  return readRaw().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveAddressBookList(
  name: string,
  recipients: SavedRecipient[]
): { list: AddressBookList | null; error: string | null } {
  const cleanName = name.trim().slice(0, MAX_NAME_LENGTH);
  if (!cleanName) {
    return { list: null, error: 'Please enter a name for this list.' };
  }

  const cleanRecipients = recipients
    .filter((r) => r.address.trim() !== '' || r.amount.trim() !== '')
    .map((r) => ({ address: r.address.trim(), amount: r.amount.trim() }));

  if (cleanRecipients.length === 0) {
    return { list: null, error: 'Add at least one recipient before saving.' };
  }
  if (cleanRecipients.length > 100) {
    return { list: null, error: 'A list can hold at most 100 recipients.' };
  }

  const lists = readRaw();
  if (lists.length >= MAX_LISTS) {
    return { list: null, error: `Address book is full (max ${MAX_LISTS} lists). Delete one first.` };
  }

  const list: AddressBookList = {
    id: makeId(),
    name: cleanName,
    createdAt: Date.now(),
    recipients: cleanRecipients,
  };

  writeRaw([list, ...lists]);
  return { list, error: null };
}

export function deleteAddressBookList(id: string): AddressBookList[] {
  const lists = readRaw().filter((l) => l.id !== id);
  writeRaw(lists);
  return lists.sort((a, b) => b.createdAt - a.createdAt);
}

export function updateAddressBookList(
  id: string,
  recipients: SavedRecipient[]
): { ok: boolean; error: string | null } {
  const cleanRecipients = recipients
    .filter((r) => r.address.trim() !== '' || r.amount.trim() !== '')
    .map((r) => ({ address: r.address.trim(), amount: r.amount.trim() }));

  if (cleanRecipients.length === 0) {
    return { ok: false, error: 'Add at least one recipient before updating.' };
  }

  const lists = readRaw();
  const idx = lists.findIndex((l) => l.id === id);
  if (idx === -1) return { ok: false, error: 'List not found.' };

  lists[idx] = { ...lists[idx], recipients: cleanRecipients };
  writeRaw(lists);
  return { ok: true, error: null };
}
