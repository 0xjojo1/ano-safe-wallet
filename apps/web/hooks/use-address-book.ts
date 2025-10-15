'use client';

import { useCallback, useEffect, useState } from 'react';

import { AddressBook, Contact, ContactCategory } from '@workspace/types/addressbook/contact';

import { getAddressBook, saveAddressBook } from '@/lib/address-book-storage';

export interface ContactFilters {
  search?: string;
  category?: ContactCategory;
  chainId?: number;
}

export function useAddressBook() {
  const [contacts, setContacts] = useState<AddressBook>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContactFilters>({});

  // Load contacts on mount
  useEffect(() => {
    const loaded = getAddressBook();
    setContacts(loaded);
  }, []);

  // Save to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0 || localStorage.getItem('ano-safe-addressbook')) {
      saveAddressBook(contacts);
    }
  }, [contacts]);

  // Add contact
  const addContact = useCallback((contact: Contact) => {
    setContacts((prev) => {
      // Check if address already exists
      const exists = prev.some((c) => c.address.toLowerCase() === contact.address.toLowerCase());
      if (exists) {
        throw new Error('Contact with this address already exists');
      }
      return [...prev, { ...contact, createdAt: Date.now() }];
    });
  }, []);

  // Update contact
  const updateContact = useCallback((address: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.address.toLowerCase() === address.toLowerCase() ? { ...contact, ...updates } : contact
      )
    );
  }, []);

  // Delete contact
  const deleteContact = useCallback((address: string) => {
    setContacts((prev) => prev.filter((contact) => contact.address.toLowerCase() !== address.toLowerCase()));
    setSelectedContacts((prev) => prev.filter((addr) => addr.toLowerCase() !== address.toLowerCase()));
  }, []);

  // Batch delete
  const batchDelete = useCallback((addresses: string[]) => {
    const lowercaseAddresses = addresses.map((addr) => addr.toLowerCase());
    setContacts((prev) => prev.filter((contact) => !lowercaseAddresses.includes(contact.address.toLowerCase())));
    setSelectedContacts([]);
  }, []);

  // Import contacts
  const importContacts = useCallback((newContacts: Contact[], mode: 'merge' | 'replace' = 'merge') => {
    setContacts((prev) => {
      if (mode === 'replace') {
        return newContacts;
      }

      // Merge mode: update existing, add new
      const merged = [...prev];

      for (const newContact of newContacts) {
        const index = merged.findIndex((c) => c.address.toLowerCase() === newContact.address.toLowerCase());

        if (index >= 0) {
          // Update existing
          merged[index] = { ...merged[index], ...newContact };
        } else {
          // Add new
          merged.push({ ...newContact, createdAt: Date.now() });
        }
      }

      return merged;
    });
  }, []);

  // Filter contacts
  const filteredContacts = useCallback(() => {
    let filtered = contacts;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (contact) => contact.address.toLowerCase().includes(search) || contact.alias.toLowerCase().includes(search)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((contact) => contact.category === filters.category);
    }

    if (filters.chainId !== undefined) {
      filtered = filtered.filter((contact) => contact.chainId === filters.chainId);
    }

    return filtered;
  }, [contacts, filters]);

  // Toggle contact selection
  const toggleContact = useCallback((address: string) => {
    setSelectedContacts((prev) =>
      prev.includes(address) ? prev.filter((addr) => addr !== address) : [...prev, address]
    );
  }, []);

  // Select all filtered contacts
  const selectAll = useCallback(() => {
    const filtered = filteredContacts();
    setSelectedContacts(filtered.map((c) => c.address));
  }, [filteredContacts]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedContacts([]);
  }, []);

  return {
    contacts: filteredContacts(),
    allContacts: contacts,
    selectedContacts,
    filters,
    setFilters,
    addContact,
    updateContact,
    deleteContact,
    batchDelete,
    importContacts,
    toggleContact,
    selectAll,
    clearSelection,
    isSelected: (address: string) => selectedContacts.includes(address),
    hasSelection: selectedContacts.length > 0,
  };
}
