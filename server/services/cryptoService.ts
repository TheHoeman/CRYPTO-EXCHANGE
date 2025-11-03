interface CryptoPrice {
  btc: number;
  eth: number;
  lastUpdated: Date;
}

let cachedPrices: CryptoPrice = {
  btc: 67842.50,
  eth: 3524.18,
  lastUpdated: new Date()
};

export async function fetchCryptoPrices(): Promise<CryptoPrice> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    
    if (!response.ok) {
      console.error('CoinGecko API error, using cached prices');
      return cachedPrices;
    }
    
    const data = await response.json();
    
    cachedPrices = {
      btc: data.bitcoin?.usd || cachedPrices.btc,
      eth: data.ethereum?.usd || cachedPrices.eth,
      lastUpdated: new Date()
    };
    
    return cachedPrices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return cachedPrices;
  }
}

export function getCachedPrices(): CryptoPrice {
  return cachedPrices;
}

export function startPricePolling(intervalMs: number = 30000) {
  fetchCryptoPrices();
  
  setInterval(async () => {
    await fetchCryptoPrices();
  }, intervalMs);
  
  console.log(`✅ Price polling started (${intervalMs}ms interval)`);
}
