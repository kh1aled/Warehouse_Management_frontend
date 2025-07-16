export async function generateMetadata({params}){
    const {locale} = params;

    const titles = {
        "en": "Suppliers",
        "ar" : "الموردين"
    }

    return {
        title : titles[locale] || titles['en']
    }
}

const Suppliers = ({children})=>{
    return <main>{children}</main>
}

export default Suppliers;