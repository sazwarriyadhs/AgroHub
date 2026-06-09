// app/components/Logo.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

const sizeConfig = {
  sm: { width: 32, height: 32, textSize: 'text-lg' },
  md: { width: 40, height: 40, textSize: 'text-xl' },
  lg: { width: 48, height: 48, textSize: 'text-2xl' },
};

export default function Logo({ variant = 'default', size = 'md', showText = true, href = '/' }: LogoProps) {
  const sizes = sizeConfig[size];
  
  const textColor = variant === 'light' ? 'text-white' : 
                    variant === 'dark' ? 'text-green-800' : 
                    'text-green-800';
  
  const LogoContent = () => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Image
          src="/assets/logo/logo-agrohub.png"
          alt="AgroHub Logo"
          width={sizes.width}
          height={sizes.height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`font-black ${sizes.textSize} ${textColor} bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent`}>
          AgroHub
        </span>
      )}
    </div>
  );
  
  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    );
  }
  
  return <LogoContent />;
}