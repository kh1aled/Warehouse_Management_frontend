'use client';
import { useTranslations } from 'next-intl';
import LoginLinks from './LoginLinks';
import Image from 'next/image';

const Home = () => {
    const t = useTranslations('home');

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-10 text-center space-y-8 transition-all duration-300">

                <div className="flex  w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-gray-800 rounded-full shadow-lg items-center justify-center">
                    <Image src={'/warehouse.png'} alt='warhouse logo' width={100} height={100} />
                </div>

                {/* Welcome */}
                <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white">
                    {t('welcome_message')}
                </p>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                    {t('description')}
                </p>


                <div className="flex justify-center pt-4">
                    <LoginLinks />
                </div>
            </div>
        </main>
    );
};

export default Home;
