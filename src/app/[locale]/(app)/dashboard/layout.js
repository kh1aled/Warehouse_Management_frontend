
export async function generateMetadata({ params }) {
  const { locale } = params;

  const titles = {
    en: 'Dashboard',
    ar: 'لوحة التحكم',
  };

  return {
    title: titles[locale] || titles.en,
  };
}

const Dashboard = ({ children }) => {
    
    return <main>{children}</main>
}

export default Dashboard
