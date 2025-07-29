export async function generateMetadata({ params }) {
    const { locale } = params

    const titles = {
        en: 'Roles Mangement',
        ar: 'ادارة الادوار',
    }

    return {
        title: titles[locale] || titles.en,
    }
}

const Users = ({ children }) => {
    return <main>{children}</main>
}

export default Users
