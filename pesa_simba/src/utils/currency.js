import currency from 'currency.js';

export const USD = (value) => currency(value, { symbol: '$', precision: 2 });
export const formatUSD = (value) => USD(value).format();