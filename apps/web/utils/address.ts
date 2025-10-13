import { getAddress } from 'viem';

export function formatAddress(address: string) {
  return getAddress(address);
}

export function formatAddressShort(address: string, start: number, end: number) {
  return `${getAddress(address).slice(start, end)}...${getAddress(address).slice(-end)}`;
}
