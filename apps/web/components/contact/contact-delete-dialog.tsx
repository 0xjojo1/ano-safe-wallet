'use client';

import { Contact } from '@workspace/types/addressbook/contact';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';

interface ContactDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onConfirm: () => void;
  isBatch?: boolean;
  batchCount?: number;
}

export function ContactDeleteDialog({
  open,
  onOpenChange,
  contact,
  onConfirm,
  isBatch = false,
  batchCount = 0,
}: ContactDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBatch ? `Delete ${batchCount} Contacts?` : 'Delete Contact?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBatch ? (
              <>Are you sure you want to delete {batchCount} selected contacts? This action cannot be undone.</>
            ) : contact ? (
              <>
                Are you sure you want to delete <strong>{contact.alias}</strong> (
                <code className='text-xs'>{contact.address}</code>)? This action cannot be undone.
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-destructive hover:bg-destructive/90'>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
