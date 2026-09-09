import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'as-needed' // Only adds /en for English, keeps root clean for Indonesian
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
