'use client';
import Image from "next/image";
import logo from "@/../public/warehouse.png";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";


const Sidebar = ({ dir, lang, toggleSidebar, isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState('');
  const sidebarRef = useRef();
  const t = useTranslations('sidebar');
  const handleChangeOpen = (key) => {
    setIsOpen(prev => prev === key ? '' : key);
  };
  const menuItems = [
    {
      key: 'dashboard',
      label: t('dashboard'),
      icon: (
        <i className="fa-solid fa-house size-6 text-[var(--main-color)] dark:text-white !flex items-center justify-center"></i>
      ),
      link: '/dashboard'
    },
    {
      key: 'products',
      label: t('products'),
      icon: (
        <i className="fa-solid fa-box-open size-6 text-[var(--main-color)] dark:text-white !flex items-center justify-center"></i>
      ),
      children: [
        { label: t('productList'), path: '/products' },
        { label: t('addProduct'), path: '/products/add' },
        { label: t('category'), path: '/products/category' },
        { label: t('brand'), path: '/products/brand' },
      ]
    },
    {
      key: 'people',
      label: t('people'),
      icon: (
        <i className="fa-solid fa-users-gear size-6 text-[var(--main-color)] dark:text-white !flex items-center justify-center"></i>
      ),
      children: [
        { label: t('addCustomer'), path: '/people/customers/add' },
        { label: t('customerList'), path: '/people/customers' },
        { label: t('addSupplier'), path: '/people/suppliers/add' },
        { label: t('supplierList'), path: '/people/suppliers' },
        { label: t('addEmployee'), path: '/people/employees/add' },
        { label: t('employeesList'), path: '/people/employees' },
      ]
    },
    {
      key: 'users',
      label: t('users'),
      icon: (
        <i className="fa-solid fa-user size-6 text-[var(--main-color)] dark:text-white !flex items-center justify-center"></i>
      ),
      children: [
        { label: t('addUser'), path: '/users/add' },
        { label: t('userList'), path: '/users' },
        { label: t('roles'), path: '/users/roles' },
      ]
    }
  ];


  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = sidebarRef.current;
      const toggler = document.getElementById("navbar-toggler");
      if (
        sidebar &&
        isSidebarOpen &&
        !sidebar.contains(event.target) &&
        (!toggler || !toggler.contains(event.target))
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <section
      ref={sidebarRef}
      className={`fixed top-0 h-screen z-50 w-[300px] bg-white-color dark:bg-secondary-dark border-e border-b border-solid border-border dark:border-[#1C1C1C] py-10 px-7 lg:px-5 lg:py-8 shadow-2xl transition-transform duration-300 ease-in-out
      ${dir === 'ltr' ? 'left-0' : 'right-0'}
      ${isSidebarOpen
          ? 'translate-x-0'
          : dir === 'ltr'
            ? '-translate-x-full'
            : 'translate-x-full'
        }`}
    >
      <div className="w-full h-full flex flex-col justify-start items-center">
        <Image src={logo} alt="logo" className="mb-8 w-28 aspect-square" />

        <ul className="w-full flex flex-col justify-start items-start">
          {menuItems.map(item => (
            <li key={item.key} className="sidebar_item w-full">
              {item.children ? (
                <>
                  <div
                    className="sidebar_link justify-between cursor-pointer"
                    onClick={() => handleChangeOpen(item.key)}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d={isOpen === item.key
                        ? "M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                        : "M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"} clipRule="evenodd" />
                    </svg>
                  </div>

                  <ul className={`ps-[40px] text-sm text-body list-disc overflow-hidden transition-all duration-500 ease-in-out ${isOpen === item.key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.children.map((child, i) => (
                      <li className="my-5" key={i}>
                        <Link href={`/${lang}${child.path}`} className="text-body dark:text-white/40 hover:hover:text-[var(--main-color)] dark:hover:text-white-color transition-colors duration-75 ease-out block py-1">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={`/${lang}${item.link}`} className="sidebar_link flex items-center gap-2 py-2">
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Sidebar;
