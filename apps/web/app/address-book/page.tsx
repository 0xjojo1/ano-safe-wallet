'use client';

import * as React from 'react';

import { useSetChain } from '@web3-onboard/react';

import { Contact } from '@workspace/types/addressbook/contact';

import { ContactDeleteDialog } from '@/components/contact/contact-delete-dialog';
import { ContactFormDialog } from '@/components/contact/contact-form-dialog';
import { ContactImportDialog } from '@/components/contact/contact-import-dialog';
import { ContactTable } from '@/components/contact/contact-table';
import { ContactToolbar } from '@/components/contact/contact-toolbar';
import { useAddressBook } from '@/hooks/use-address-book';
import { downloadCSV, downloadJSON } from '@/lib/address-book-storage';

export default function AddressBookPage() {
  const {
    contacts,
    allContacts,
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
    isSelected,
    hasSelection,
  } = useAddressBook();

  // Get chains from web3-onboard
  const [{ chains }] = useSetChain();

  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | undefined>();
  const [deletingContact, setDeletingContact] = React.useState<Contact | null>(null);
  const [isBatchDelete, setIsBatchDelete] = React.useState(false);

  // Add contact
  const handleAdd = () => {
    setEditingContact(undefined);
    setFormOpen(true);
  };

  // Edit contact
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  // Delete single contact
  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
    setIsBatchDelete(false);
    setDeleteOpen(true);
  };

  // Batch delete
  const handleBatchDelete = () => {
    setDeletingContact(null);
    setIsBatchDelete(true);
    setDeleteOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (isBatchDelete) {
      batchDelete(selectedContacts);
    } else if (deletingContact) {
      deleteContact(deletingContact.address);
    }
    setDeleteOpen(false);
  };

  // Form submit
  const handleFormSubmit = (contact: Contact) => {
    if (editingContact) {
      updateContact(editingContact.address, contact);
    } else {
      try {
        addContact(contact);
      } catch (error) {
        alert((error as Error).message);
      }
    }
  };

  // Export
  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(allContacts, `address-book-${timestamp}.csv`);
  };

  // Import
  const handleImport = (newContacts: Contact[], mode: 'merge' | 'replace') => {
    importContacts(newContacts, mode);
  };

  return (
    <div className='space-y-6'>
      {/* Unified Toolbar: Filters + Actions */}
      <ContactToolbar
        filters={filters}
        onFiltersChange={setFilters}
        chains={chains}
        selectedCount={selectedContacts.length}
        onAdd={handleAdd}
        onImport={() => setImportOpen(true)}
        onExport={handleExport}
        onBatchDelete={handleBatchDelete}
      />

      {/* Table */}
      <ContactTable
        contacts={contacts}
        selectedContacts={selectedContacts}
        onSelect={toggleContact}
        onSelectAll={selectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSelected={isSelected}
      />

      {/* Dialogs */}
      <ContactFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contact={editingContact}
        onSubmit={handleFormSubmit}
        mode={editingContact ? 'edit' : 'add'}
        chains={chains}
      />

      <ContactDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        contact={deletingContact}
        onConfirm={handleConfirmDelete}
        isBatch={isBatchDelete}
        batchCount={selectedContacts.length}
      />

      <ContactImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={handleImport} />
    </div>
  );
}
