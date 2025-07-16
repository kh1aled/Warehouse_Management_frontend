'use client';

import React from 'react'
import Header from '@/app/[locale]/(app)/Header'
import { useTranslations } from 'next-intl';
const page = () => {
    const t = useTranslations('dashboard')
    return (
        <div className="min-h-screen bg-white-color dark:bg-black-color">
            <Header title={t('title')} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white-color dark:bg-black-color border-b  dark:border-white/25">
                            {t('welcome')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
