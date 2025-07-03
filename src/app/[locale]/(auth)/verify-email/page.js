'use client'

import Button from '@/components/Button'
import { useAuth } from '@/hooks/auth'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AuthSessionStatus from '../AuthSessionStatus' // لو حابب توحد الرسائل بنفس المكون

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })
    const t = useTranslations('auth.verify_email')

    const [status, setStatus] = useState(null)

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                {t('verification_notice')}
            </div>

            {/* Session Status */}
            {status === 'verification-link-sent' && (
                <AuthSessionStatus
                    status={t('verification_link_sent')}
                    className="mb-4"
                />
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    resendEmailVerification({ setStatus })
                }}
                className="w-full"
            >
                <div className="flex flex-col gap-2 items-center justify-between mt-4">
                    <Button type="submit">
                        {t('resend_verification_email')}
                    </Button>

                    <button
                        type="button"
                        className="underline text-sm text-red-400 hover:text-gray-900"
                        onClick={logout}
                    >
                        {t('logout')}
                    </button>
                </div>
            </form>
        </>
    )
}

export default Page
