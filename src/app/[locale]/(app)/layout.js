'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/[locale]/(app)/Navigation'
import Loading from '@/app/[locale]/(app)/Loading'
import '@fortawesome/fontawesome-free/css/all.min.css'

const AppLayout = ({ children, params }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const { locale } = params || {}
    const direction = locale === 'ar' ? 'rtl' : 'ltr'

    if (!user) {
        return <Loading />
    }

    return (
        <section className="min-h-screen bg-gray-100">
            <Navigation user={user} lang={locale} dir={direction} />

            <main>{children}</main>
        </section>
    )
}

export default AppLayout
