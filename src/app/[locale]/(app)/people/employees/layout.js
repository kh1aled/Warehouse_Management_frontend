export async function generateMetadata({params}){
    const {locale} = params;

    const titles = {
        "en": "Employees",
        "ar" : "الموظفين",
    }

    return {
        title : titles[locale] || titles['en']
    }
}

const Suppliers = ({children})=>{
    return <main>{children}</main>
}

export default Suppliers;