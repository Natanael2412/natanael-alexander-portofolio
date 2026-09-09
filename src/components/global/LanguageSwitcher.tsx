"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'id' ? 'en' : 'id';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="font-montserrat text-[10px] md:text-xs tracking-widest uppercase hover:opacity-50 transition-opacity"
    >
      {locale === 'id' ? 'EN' : 'ID'}
    </button>
  );
}
