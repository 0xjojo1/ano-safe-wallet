import { getAddress, isAddress } from 'viem';

import { AddressBook, Contact } from '@workspace/types/addressbook/contact';

const STORAGE_KEY = 'ano-safe-addressbook';

/**
 * Get address book from localStorage
 */
export function getAddressBook(): AddressBook {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as AddressBook;
  } catch (error) {
    console.error('Failed to load address book:', error);
    return [];
  }
}

/**
 * Save address book to localStorage
 */
export function saveAddressBook(contacts: AddressBook): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Failed to save address book:', error);
  }
}

/**
 * Export address book to CSV
 */
export function exportToCSV(contacts: AddressBook): string {
  const headers = ['Address', 'Alias', 'Category', 'Chain ID', 'Notes'];
  const rows = contacts.map((contact) => [
    contact.address,
    contact.alias,
    contact.category,
    contact.chainId?.toString() || '',
    contact.note || '',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(contacts: AddressBook, filename = 'address-book.csv'): void {
  const csv = exportToCSV(contacts);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export address book to JSON
 */
export function downloadJSON(contacts: AddressBook, filename = 'address-book.json'): void {
  const json = JSON.stringify(contacts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV to contacts
 */
export function parseCSV(csvText: string): Contact[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Skip header row
  const dataLines = lines.slice(1);

  const contacts: Contact[] = [];

  for (const line of dataLines) {
    // Simple CSV parsing (assumes no commas in quoted fields)
    const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());

    if (values.length < 3) continue;

    const [address, alias, category, chainId, note] = values;

    // Validate required fields
    if (!address || !alias) continue;

    // Validate address format using viem
    if (!isAddress(address)) continue;

    contacts.push({
      address: getAddress(address),
      alias: alias,
      category: category as any,
      chainId: chainId ? parseInt(chainId) : undefined,
      note: note || undefined,
      createdAt: Date.now(),
    });
  }

  return contacts;
}

/**
 * Import contacts from CSV file
 */
export async function importFromCSV(file: File): Promise<Contact[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const contacts = parseCSV(text);
        resolve(contacts);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Import contacts from JSON file
 */
export async function importFromJSON(file: File): Promise<Contact[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedContacts = JSON.parse(text) as Contact[];

        // Validate addresses
        const validContacts = parsedContacts.filter((contact) => {
          if (!contact.address || !contact.alias) return false;
          return isAddress(contact.address);
        });

        resolve(validContacts);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
