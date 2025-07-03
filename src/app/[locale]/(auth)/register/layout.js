export const generateMetadata = ({ params }) => {
    const locale = params?.locale || 'en'; // هنا بنحمي من undefined
    const titles = {
        en: 'Register',
        ar: 'إنشاء حساب',
    };

    return {
        title: titles[locale] || titles.en,
    };
};

export default function Layout({ children }) {
    return (
        <main className="w-full">{children}</main>
    );
}