import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  // This path is now relative to the root, which is safer for Vercel
  messages: (await import(`../messages/${locale}.json`)).default
}));