import { ethers } from "ethers";

// TODO: Replace with your actual deployed contract address on Sepolia
export const CONTRACT_ADDRESS = "0xcce6B8A015B7182af3379298F0DD21c9aDCC41ad";

// TODO: Replace with your contract's full ABI
export const CONTRACT_ABI = 
  [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

/**
 * Returns a contract instance with a signer (for write operations like voting)
 */
export const getContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use this app.");
  }
  
  // Ethers v6 standard way to connect to MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Request account access if needed
  await provider.send("eth_requestAccounts", []);
  
  const signer = await provider.getSigner();
  
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Returns a read-only contract instance (for viewing counts without prompting sign-in immediately, optional use)
 */
export const getReadOnlyContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
