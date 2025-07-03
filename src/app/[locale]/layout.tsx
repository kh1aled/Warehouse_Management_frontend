import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import './global.css';
import Providers from '@/components/ThemeProviders';

export const metadata = {
    title: 'Warehouse Management System',
    description: 'Manage your warehouse efficiently with our system.',
    icons: {
        icon: '/warehouse.png',
    },
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    const direction = locale === 'ar' ? 'rtl' : 'ltr'

    return (
        <html lang={locale} dir={direction} className="">
            <body>
                <Providers>
                    <NextIntlClientProvider locale={locale}>
                        {children}
                    </NextIntlClientProvider>
                </Providers>
            </body>
        </html>
    )
}
