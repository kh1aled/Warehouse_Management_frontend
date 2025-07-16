import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import './global.css'
import Providers from '@/components/ThemeProviders'
import { Noto_Sans_Arabic, Noto_Sans } from 'next/font/google'

const notoSansArabic = Noto_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-arabic',
})

const notoSans = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-latin',
})

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
        <html
            lang={locale}
            dir={direction}
            className={`${notoSansArabic.variable} ${notoSans.variable}`}>
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
