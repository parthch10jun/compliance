'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface LibraryCardProps {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  ctaText?: string;
  ctaColor?: string;
}

export default function LibraryCard({
  id,
  name,
  description,
  icon,
  iconBgColor = 'var(--primary)',
  ctaText,
  ctaColor = 'var(--success)',
}: LibraryCardProps) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--primary-lighter)] transition-all duration-200 flex flex-col">
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon || (
          <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">{name}</h3>

      {/* Description */}
      <p className="text-sm text-[var(--foreground-muted)] mb-4 flex-1 line-clamp-3">
        {description}
      </p>

      {/* CTA Link */}
      {ctaText && (
        <Link 
          href={`/library/${id}`}
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
          style={{ color: ctaColor }}
        >
          {ctaText}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

