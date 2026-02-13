import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action, icon }: PageHeaderProps) {
  return (
    <div className="animate-fade-in-up mb-8 relative z-20">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-p3 text-[var(--foreground-muted)] mb-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[var(--primary)] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[var(--foreground)]">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <ChevronRight size={14} />}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h1 className="text-h1 text-[var(--foreground)] tracking-tight">{title}</h1>
          </div>
          {description && (
            <p className="text-p2 text-[var(--foreground-muted)] mt-2">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 relative z-[100]">{action}</div>}
      </div>
    </div>
  );
}

