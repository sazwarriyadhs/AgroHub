'use client';

import { useEffect, useState } from 'react';

interface ClientFormattedNumberProps {
  value: number;
  formatType?: 'currency' | 'number';
}

export default function ClientFormattedNumber({ 
  value, 
  formatType = 'currency' 
}: ClientFormattedNumberProps) {
  const [formattedValue, setFormattedValue] = useState<string>('');

  useEffect(() => {
    if (formatType === 'currency') {
      setFormattedValue(
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      );
    } else {
      setFormattedValue(
        new Intl.NumberFormat('id-ID').format(value)
      );
    }
  }, [value, formatType]);

  return <>{formattedValue}</>;
}
