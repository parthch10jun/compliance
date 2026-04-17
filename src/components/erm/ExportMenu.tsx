'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table, Printer, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface ExportMenuProps {
  screenName: string;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
}

export default function ExportMenu({ 
  screenName, 
  onExportPDF,
  onExportExcel,
  onPrint 
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      // Default: Trigger browser print dialog for PDF
      window.print();
    }
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default: Simulate Excel download
      const date = new Date().toISOString().split('T')[0];
      alert(`Downloading: ${screenName}_${date}.xlsx`);
    }
    setIsOpen(false);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-[var(--border)] rounded-lg text-p2 font-medium text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-2"
      >
        <Download size={18} />
        Export
        <ChevronDown size={14} className={clsx(
          'transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[var(--border)] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            <button
              onClick={handleExportPDF}
              className="w-full px-3 py-2 rounded-md hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-3 text-left group"
            >
              <FileText size={16} className="text-[var(--foreground-muted)] group-hover:text-red-600" />
              <div>
                <div className="text-p2 font-medium text-[var(--foreground)]">Export as PDF</div>
                <div className="text-xs text-[var(--foreground-muted)]">Download report</div>
              </div>
            </button>

            <button
              onClick={handleExportExcel}
              className="w-full px-3 py-2 rounded-md hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-3 text-left group"
            >
              <Table size={16} className="text-[var(--foreground-muted)] group-hover:text-green-600" />
              <div>
                <div className="text-p2 font-medium text-[var(--foreground)]">Export as Excel</div>
                <div className="text-xs text-[var(--foreground-muted)]">Download data</div>
              </div>
            </button>

            <button
              onClick={handlePrint}
              className="w-full px-3 py-2 rounded-md hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-3 text-left group"
            >
              <Printer size={16} className="text-[var(--foreground-muted)] group-hover:text-indigo-600" />
              <div>
                <div className="text-p2 font-medium text-[var(--foreground)]">Print</div>
                <div className="text-xs text-[var(--foreground-muted)]">Print current view</div>
              </div>
            </button>
          </div>

          <div className="px-3 py-2 bg-[var(--background-secondary)] border-t border-[var(--border)]">
            <div className="text-xs text-[var(--foreground-muted)]">
              Exporting: <span className="font-semibold text-[var(--foreground)]">{screenName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
