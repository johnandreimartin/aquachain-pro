import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID } from '../constants/contract';

const NETWORK_NAMES = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  17000: 'Holesky Testnet',
  1337: 'Localhost',
};

/**
 * useWallet
 * Encapsulates all MetaMask / ethers.js connection logic.
 * Returns: { account, contract, myProfile, network, loading, connectWallet, switchNetwork }
 */
export function useWallet() {
  const [account, setAccount]     = useState('');
  const [contract, setContract]   = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [network, setNetwork]     = useState(null);
  const [loading, setLoading]     = useState(false);

  const getNetworkInfo = (chainId) => {
    const id = Number(chainId);
    return {
      chainId: id,
      name: NETWORK_NAMES[id] || `Chain ID: ${id}`,
      isSepolia: id === SEPOLIA_CHAIN_ID,
    };
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return;
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const net      = await provider.getNetwork();
      let netInfo    = getNetworkInfo(net.chainId);
      setNetwork(netInfo);

      // Auto-intercept network check restructured to prevent early return deadlocks
      if (!netInfo.isSepolia) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
          // Refresh network parameters if switch resolves smoothly before chainChanged reload
          const updatedNet = await provider.getNetwork();
          netInfo = getNetworkInfo(updatedNet.chainId);
          setNetwork(netInfo);
        } catch (switchErr) {
          console.warn("Network switch canceled or failed", switchErr);
          return; // Only return early if the switch explicitly failed/was rejected
        }
      }

      // Final sanity fallback check before proceeding to signers
      if (!netInfo.isSepolia) return;

      const signer      = await provider.getSigner();
      const aquaContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(aquaContract);

      const profile = await aquaContract.participants(accounts[0]);
      if (profile.isRegistered) {
        setMyProfile({
          name:     profile.name,
          location: profile.businessLocation,
          role:     Number(profile.role),
        });
      }
    } catch (err) {
      console.error("MetaMask handshake error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (err) {
      console.error("Manual network switch rejected", err);
    }
  };

  useEffect(() => {
    connectWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged',    () => window.location.reload());
    }
  }, [connectWallet]);

  return { account, contract, myProfile, network, loading, connectWallet, switchNetwork };
}