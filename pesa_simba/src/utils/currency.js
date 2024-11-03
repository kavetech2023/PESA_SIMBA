import currency from 'currency.js';

export const USD = (value) => currency(value, { symbol: '$', precision: 2 });
export const formatUSD = (value) => USD(value).format();

export const USDtoKES = (usd) => {
    // Using a fixed rate for demo. In production, fetch real-time exchange rates
    const rate = 130.5;
    return KES(USD(usd).multiply(rate).value);
  };