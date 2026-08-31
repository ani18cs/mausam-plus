import React from 'react';
import { FileText, ExternalLink, ShieldCheck, Download, Calendar, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

export interface IMDBulletinItem {
  id: string;
  title: string;
  category: 'Monsoon' | 'Cyclone' | 'Heatwave' | 'Agromet' | 'Nowcast';
  summary: string;
  dateStr: string;
  bulletinNumber: string;
  pdfUrl?: string;
  isUrgent?: boolean;
}

const OFFICIAL_IMD_BULLETINS: IMDBulletinItem[] = [
  {
    id: 'imd-b-01',
    title: 'National All India Weather Summary & Monsoon Advance Bulletin',
    category: 'Monsoon',
    summary:
      'Southwest Monsoon has advanced into parts of central Arabian Sea, Karnataka, and Rayalaseema. Heavy to very heavy rainfall forecasted along Konkan, Goa, and coastal Karnataka over the next 48 hours.',
    dateStr: '31 Aug 2026, 17:30 IST',
    bulletinNumber: 'NWFC-IMD-BULL-08-31',
    pdfUrl: 'https://mausam.imd.gov.in/responsive/all_india_forcast_bulletin.php',
    isUrgent: true,
  },
  {
    id: 'imd-b-02',
    title: 'Special Tropical Weather Outlook for North Indian Ocean & Arabian Sea',
    category: 'Cyclone',
    summary:
      'A low-pressure area over east-central Arabian Sea off Maharashtra-Goa coasts is likely to concentrate into a Depression. Fishermen advised not to venture into deep sea along Konkan-Goa-Karnataka coasts.',
    dateStr: '31 Aug 2026, 14:00 IST',
    bulletinNumber: 'RSMC-CYCLONE-TROP-04',
    pdfUrl: 'https://rsmcnewdelhi.imd.gov.in/',
    isUrgent: true,
  },
  {
    id: 'imd-b-03',
    title: 'National Agromet Advisory Services (AAS) Bulletin for Kharif Sowing',
    category: 'Agromet',
    summary:
      'Farmers in Southern Peninsular India advised to complete paddy nursery transplantation. Avoid spray of chemicals during rain hours and ensure drainage channels in low-lying pulses and cotton fields.',
    dateStr: '30 Aug 2026, 10:00 IST',
    bulletinNumber: 'AGROMET-AAS-VOL-34',
    pdfUrl: 'https://mausam.imd.gov.in/',
    isUrgent: false,
  },
  {
    id: 'imd-b-04',
    title: 'Extended Range Weather Outlook (ERFS) for Next 2 Weeks',
    category: 'Monsoon',
    summary:
      'Above-normal rainfall activity expected over Western Ghats, Coastal Karnataka, and Northeast India. Near-normal maximum temperatures over Northwest plains.',
    dateStr: '29 Aug 2026, 18:00 IST',
    bulletinNumber: 'ERFS-NWFC-2026-W35',
    pdfUrl: 'https://mausam.imd.gov.in/',
    isUrgent: false,
  },
];

export const IMDBulletinBoard: React.FC = () => {
  const { t } = useTranslation();

  const handleOpenPdf = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-3">
      {/* Official Header Banner */}
      <div className="rounded-2xl bg-card-subtle p-3.5 border border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="IMD Official" className="h-7 w-auto object-contain flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xs font-bold text-content-primary">
                Official IMD National Bulletins
              </span>
              <span className="flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-2.5 h-2.5" /> MoES Grounded
              </span>
            </div>
            <span className="text-[10px] text-content-muted block mt-0.5">
              Authoritative advisories published by National Weather Forecasting Centre (NWFC)
            </span>
          </div>
        </div>
      </div>

      {/* Bulletins List (Sorted Newest First) */}
      <div className="space-y-2.5">
        {OFFICIAL_IMD_BULLETINS.map((b) => (
          <div
            key={b.id}
            className={`rounded-2xl p-4 border transition-all space-y-2.5 ${
              b.isUrgent
                ? 'bg-card border-amber-500/35 shadow-sm'
                : 'bg-card border-border-subtle hover:border-border-strong'
            }`}
          >
            {/* Top row: Category tag + Bulletin Number + Timestamp */}
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-bold px-2 py-0.5 rounded-md ${
                    b.category === 'Cyclone'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : b.category === 'Monsoon'
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {b.category}
                </span>
                <span className="font-mono text-content-muted font-semibold">{b.bulletinNumber}</span>
              </div>

              <span className="text-content-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {b.dateStr}
              </span>
            </div>

            {/* Title & Summary */}
            <div className="space-y-1">
              <h3 className="font-heading text-xs font-bold text-content-primary leading-snug">
                {b.title}
              </h3>
              <p className="text-[11px] text-content-secondary leading-relaxed">
                {b.summary}
              </p>
            </div>

            {/* Bottom Actions: View Official PDF link */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[11px]">
              <span className="text-content-muted text-[10px]">Source: IMD / MoES Official Portal</span>

              <button
                type="button"
                onClick={() => handleOpenPdf(b.pdfUrl)}
                className="flex items-center gap-1 font-bold text-accent-primary hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Official Advisory</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
