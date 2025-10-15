'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import * as z from 'zod';

import { Contact, ContactCategory } from '@workspace/types/addressbook/contact';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';

interface Chain {
  id: string;
  label?: string;
}

const contactFormSchema = z.object({
  address: z
    .string()
    .min(1, 'Address is required')
    .refine((val) => isAddress(val), 'Invalid Ethereum address')
    .transform((val) => val as string),
  alias: z.string().min(1, 'Alias is required').max(50, 'Alias is too long'),
  category: z.nativeEnum(ContactCategory),
  chainId: z.number().optional(),
  note: z.string().max(200, 'Note is too long').optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
  onSubmit: (contact: Contact) => void;
  mode: 'add' | 'edit';
  chains: Chain[];
}

export function ContactFormDialog({ open, onOpenChange, contact, onSubmit, mode, chains }: ContactFormDialogProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact || {
      address: '',
      alias: '',
      category: ContactCategory.ACCOUNT,
      chainId: undefined,
      note: '',
    },
  });

  React.useEffect(() => {
    if (open && contact) {
      form.reset(contact);
    } else if (open && !contact) {
      form.reset({
        address: '',
        alias: '',
        category: ContactCategory.ACCOUNT,
        chainId: undefined,
        note: '',
      });
    }
  }, [open, contact, form]);

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit({
      ...values,
      createdAt: contact?.createdAt || Date.now(),
    } as Contact);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Contact' : 'Edit Contact'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Add a new contact to your address book.' : 'Update contact information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            {/* Address */}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='0x...' {...field} disabled={mode === 'edit'} className='font-mono' />
                  </FormControl>
                  <FormDescription>Ethereum address (0x...)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alias */}
            <FormField
              control={form.control}
              name='alias'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias</FormLabel>
                  <FormControl>
                    <Input placeholder='My Friend' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ContactCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chain ID */}
            <FormField
              control={form.control}
              name='chainId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select chain' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.label || `Chain ${chain.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note */}
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Additional notes...' {...field} value={field.value || ''} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit'>{mode === 'add' ? 'Add Contact' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
