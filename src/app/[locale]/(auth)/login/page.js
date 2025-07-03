'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '../AuthSessionStatus'
import { useTranslations } from 'next-intl'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const t = useTranslations('auth.login');

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm} className="w-full">
                {/* Email Address */}
                <div className='w-full'>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        placeholder={t('email')}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder={t('password')}
                    />

                    <InputError
                        messages={errors.password}
                        className="mt-2"
                    />
                </div>

                {/* Remember Me */}
                <div className="block mt-4 text-start">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={event =>
                                setShouldRemember(event.target.checked)
                            }
                        />

                        <span className="ms-2 text-sm text-gray-600">
                            {t('remember_me')}
                        </span>
                    </label>
                </div>

                <div className="flex flex-col items-start justify-end mt-8 gap-2">
                    <Link
                        href="/forgot-password"
                        className="underline text-sm text-main-color hover:text-main-color-600 cursor-pointer">
                        {t('forgot_password')}
                    </Link>

                    <Button className="w-full">{t('title')}</Button>
                    <div className='text-center w-full mt-4'>
                        <span class="text-[16px] inline-block text-body text-center">{t('dont_have_an_account')} <Link class="text-[16px] underline text-main-color hover:text-main-color-600 cursor-pointer" href="/register">{t('register')}</Link></span>
                    </div>
                </div>
            </form>

        </>
    )
}

export default Login
