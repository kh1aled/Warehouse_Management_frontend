export async function generateMetadata({ params }) {
    const { locale } = params

    const titles = {
        en: 'People',
        ar: 'الاشخاص',
    }

    return {
        title: titles[locale] || titles.en,
    }
}

const People = ({ children }) => {
    return <main>{children}</main>
}

export default People
