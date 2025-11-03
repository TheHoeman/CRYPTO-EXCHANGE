import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

interface Wallet {
  id: number;
  userId: number;
  currency: string;
  balance: string;
}

export function useWallets(isSandbox: boolean = false) {
  return useQuery<{ wallets: Wallet[] }>({
    queryKey: ['/api/wallet/balance', isSandbox],
    queryFn: () => fetchWithAuth(`/api/wallet/balance?sandbox=${isSandbox}`),
  });
}
