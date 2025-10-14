/**
 * Contact category - simplified type classification
 */
export enum ContactCategory {
  ACCOUNT = 'account', // Regular account (EOA or contract)
  SAFE = 'safe', // Safe multisig account
}

/**
 * Safe-specific information
 */
export interface SafeInfo {
  threshold: number;
  owners: string[];
  version: string;
}

/**
 * Address book contact
 */
export interface Contact {
  /** Contact address */
  address: string;
  /** Alias or nickname */
  alias: string;
  /** Contact category */
  category: ContactCategory;
  /** Chain ID (optional) */
  chainId?: number;
  /** Safe information (only for Safe contacts) */
  safeInfo?: SafeInfo;
  /** Creation timestamp (optional) */
  createdAt?: number;
  /** Notes (optional) */
  note?: string;
}

/**
 * Address book - list of contacts
 */
export type AddressBook = Contact[];

/**
 * Address book grouped by chain ID
 */
export interface ChainAddressBook {
  [chainId: string]: Contact[];
}
