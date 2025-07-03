'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const Register = () => {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState([])
  const t = useTranslations('auth.register')

  const submitForm = event => {
    event.preventDefault()

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    })
  }

  return (
    <form onSubmit={submitForm} className="w-full">
      {/* Name */}
      <div>
        <Input
          id="name"
          type="text"
          value={name}
          className="block mt-1 w-full"
          onChange={event => setName(event.target.value)}
          placeholder={t('name')}
          required
          autoFocus
        />
        <InputError messages={errors.name} className="mt-2" />
      </div>

      {/* Email Address */}
      <div className="mt-4">
        <Input
          id="email"
          type="email"
          value={email}
          className="block mt-1 w-full"
          onChange={event => setEmail(event.target.value)}
          placeholder={t('email')}
          required
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
          placeholder={t('password')}
          required
          autoComplete="new-password"
        />
        <InputError messages={errors.password} className="mt-2" />
      </div>

      {/* Confirm Password */}
      <div className="mt-4">
        <Input
          id="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          className="block mt-1 w-full"
          onChange={event => setPasswordConfirmation(event.target.value)}
          placeholder={t('confirm_password')}
          required
        />
        <InputError messages={errors.password_confirmation} className="mt-2" />
      </div>

      {/* Buttons & Link */}
      <div className="flex flex-col items-start justify-end mt-8 gap-2">
        <Link
          href="/login"
          className="underline text-sm text-main-color hover:text-main-color-600 cursor-pointer">
          {t('already_have_an_account')}
        </Link>

        <Button className="w-full">{t('title')}</Button>
      </div>
    </form>
  )
}

export default Register
