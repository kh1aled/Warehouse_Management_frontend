'use client';

import React from 'react'
import Header from '@/app/[locale]/(app)/Header'
import { useTranslations } from 'next-intl';
const page = () => {
    const t = useTranslations('dashboard')
    return (
        <>
            <Header title={t('title')} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You are logged in!
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
