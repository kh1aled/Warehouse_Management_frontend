'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import AuthSessionStatus from '../AuthSessionStatus'

const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const t = useTranslations('auth.forgot_password');

    const submitForm = event => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                {t('description')}
            </div>

            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm} className="w-full">
                {/* Email Address */}
                <div className='w-full'>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                        placeholder={t('email')}
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button>{t('send_reset_link')}</Button>
                </div>
            </form>
        </>
    )
}

export default Page
