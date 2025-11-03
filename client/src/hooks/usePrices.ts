import { useQuery } from '@tanstack/react-query';

interface CryptoPrices {
  btc: number;
  eth: number;
  lastUpdated: string;
}

export function usePrices() {
  return useQuery<CryptoPrices>({
    queryKey: ['/api/prices'],
    refetchInterval: 30000,
  });
}
