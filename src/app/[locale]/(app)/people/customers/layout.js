export async function generateMetadata({ params }) {
    const { locale } = params

    const titles = {
        en: 'Customers',
        ar: 'العملاء',
    }

    return {
        title: titles[locale] || titles.en,
    }
}

const Customers = ({ children }) => {
    return <main>{children}</main>
}

export default Customers
