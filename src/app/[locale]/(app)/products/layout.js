export async function generateMetadata({ params }) {
    const { locale } = params

    const titles = {
        en: 'Products',
        ar: 'المنتجات',
    }

    return {
        title: titles[locale] || titles.en,
    }
}

const Products = ({ children }) => {
    return <main>{children}</main>
}

export default Products
