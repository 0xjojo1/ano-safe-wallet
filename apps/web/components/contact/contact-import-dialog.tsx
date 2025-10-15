'use client';

import * as React from 'react';

import { FileJson, FileSpreadsheet, Upload } from 'lucide-react';

import { Contact } from '@workspace/types/addressbook/contact';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

import { importFromCSV, importFromJSON } from '@/lib/address-book-storage';

interface ContactImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (contacts: Contact[], mode: 'merge' | 'replace') => void;
}

export function ContactImportDialog({ open, onOpenChange, onImport }: ContactImportDialogProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [importMode, setImportMode] = React.useState<'merge' | 'replace'>('merge');
  const [preview, setPreview] = React.useState<Contact[]>([]);
  const [error, setError] = React.useState<string>('');
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError('');

    try {
      let contacts: Contact[];

      if (selectedFile.name.endsWith('.csv')) {
        contacts = await importFromCSV(selectedFile);
      } else if (selectedFile.name.endsWith('.json')) {
        contacts = await importFromJSON(selectedFile);
      } else {
        setError('Unsupported file format. Please use CSV or JSON.');
        return;
      }

      setPreview(contacts);
    } catch (err) {
      setError('Failed to parse file. Please check the format.');
      setPreview([]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    await processFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await processFile(droppedFile);
    }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview, importMode);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Import contacts from a CSV or JSON file. You can merge with existing contacts or replace all.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Import Mode */}
          <div className='space-y-2'>
            <Label>Import Mode</Label>
            <Select value={importMode} onValueChange={(v) => setImportMode(v as 'merge' | 'replace')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='merge'>Merge (update existing, add new)</SelectItem>
                <SelectItem value='replace'>Replace (delete all existing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload - Drag & Drop */}
          <div className='space-y-2'>
            <Label>File</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30'
              )}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='.csv,.json'
                onChange={handleFileChange}
                className='hidden'
              />
              <Upload className={cn('h-8 w-8', isDragging ? 'text-primary' : 'text-muted-foreground')} />
              <div className='text-center'>
                <p className='text-sm font-medium'>
                  {file ? (
                    <span className='flex items-center gap-2 justify-center'>
                      {file.name.endsWith('.csv') ? (
                        <FileSpreadsheet className='h-4 w-4' />
                      ) : (
                        <FileJson className='h-4 w-4' />
                      )}
                      {file.name}
                    </span>
                  ) : (
                    'Drop your file here or click to browse'
                  )}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>Supports CSV and JSON files</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>{error}</div>}

          {/* Preview */}
          {preview.length > 0 && (
            <div className='space-y-2'>
              <Label>Preview ({preview.length} contacts)</Label>
              <div className='max-h-[150px] overflow-y-auto border rounded-md p-3 space-y-2'>
                {preview.slice(0, 5).map((contact, idx) => (
                  <div key={idx} className='text-xs space-y-0.5'>
                    <div className='font-medium truncate'>{contact.alias}</div>
                    <div className='text-muted-foreground font-mono text-xs'>
                      {contact.address.slice(0, 10)}...{contact.address.slice(-8)}
                    </div>
                  </div>
                ))}
                {preview.length > 5 && (
                  <div className='text-xs text-muted-foreground'>... and {preview.length - 5} more</div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={preview.length === 0}>
            Import {preview.length > 0 && `(${preview.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
