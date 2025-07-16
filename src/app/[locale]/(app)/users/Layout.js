export async function generateMetadata({ params }) {
    const { locale } = params;

    const titles = {
        en: 'Users',
        ar: 'المستخدمين',
    }

    return { title: titles[locale] ? { title: titles[locale] } : { title: titles.en } };

}

const Users = ({ children }) => {
    return <main>{children}</main>;
}
