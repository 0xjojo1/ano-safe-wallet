// Owner Node Data
export type OwnerNodeData = {
  address: string;
  alias?: string;
};

// Token Transfer Node Data
export type TokenTransferNodeData = {
  recipient?: string;
  token?: string;
  amount?: string;
};

// ABI Function Type
export type ABIFunction = {
  name: string;
  type: string;
  inputs: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
  }>;
  stateMutability?: string;
};

// Custom Build Node Data
export type CustomBuildNodeData = {
  contractAddress?: string;
  abiInput?: string;
  parsedAbi?: ABIFunction[];
  selectedFunction?: string;
  functionParams?: Record<string, string>;
  parseError?: string;
};
