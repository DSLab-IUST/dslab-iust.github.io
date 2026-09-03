import type { fa } from './locales/fa';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'app';
    resources: { app: typeof fa };
    returnNull: false;
  }
}
