// C:\taniapp\agrohub\web-app\lib\utils\currency.ts
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};