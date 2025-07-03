'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import ThemeSwitcher from '@/components/ThemeSwitcher'
const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:flex items-center justify-end space-x-4 gap-2">
        <ThemeSwitcher/>
            {user ? (
                <Link
                    href="/dashboard"
                    className="ml-4 text-sm text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="text-sm text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="ml-4 text-sm text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out cursor-pointer" 
                    >
                        Register
                    </Link>
                </>
            )}
        </div>
    )
}

export default LoginLinks
