'use client';
import Image from "next/image";
import logo from "../assets/storage.png";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[var(--main-color)]">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    link: '/dashboard'
  },
  {
    key: 'products',
    label: 'Products',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6 text-[var(--main-color)]">
        <path fillRule="evenodd" d="M11 4V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1ZM9 2.5H7a.5.5 0 0 0-.5.5v1h3V3a.5.5 0 0 0-.5-.5ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
        <path d="M3 11.83V12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.17c-.313.11-.65.17-1 .17H4c-.35 0-.687-.06-1-.17Z" />
      </svg>
    ),
    children: [
      { label: 'Product List', path: '/products' },
      { label: 'Add Product', path: '/products/add' },
      { label: 'Category', path: '/products/category' },
      { label: 'Brand', path: '/products/brand' },
    ]
  },
  {
    key: 'people',
    label: 'People',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6 text-[var(--main-color)]">
        <path fillRule="evenodd" d="M11 4V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1ZM9 2.5H7a.5.5 0 0 0-.5.5v1h3V3a.5.5 0 0 0-.5-.5ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
        <path d="M3 11.83V12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.17c-.313.11-.65.17-1 .17H4c-.35 0-.687-.06-1-.17Z" />
      </svg>
    ),
    children: [
      { label: 'Add Customer', path: '/people/customers/add' },
      { label: 'Customer List', path: '/people/customers' },
      { label: 'Add Supplier', path: '/people/suppliers/add' },
      { label: 'Supplier List', path: '/people/suppliers' },
      { label: 'Add Employee', path: '/people/employees/add' },
      { label: 'Employees List', path: '/people/employees' },
    ]
  },
  {
    key: 'users',
    label: 'Usesrs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6 text-[var(--main-color)]">
        <path fillRule="evenodd" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 1.5a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 8 2.5Z" clipRule="evenodd" />
        <path d="M8.75 6a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM8.25 9a2.25 2.25 0 1 1-4.5-.001A2.25 2.25 0 0 1 8.25 9Z" />
      </svg>
    ),
    children: [
      { label: 'Add User', path: '/users/add' },
      { label: 'User List', path: '/users' },
      { label: 'Roles', path: '/users/roles' },
    ]
  }
];

const Sidebar = ({ dir, lang, toggleSidebar, isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState('');
  const sidebarRef = useRef();

  const handleChangeOpen = (key) => {
    setIsOpen(prev => prev === key ? '' : key);
  };

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
      className={`fixed top-0 h-screen z-50 w-[300px] bg-white border-e border-b border-solid border-border py-10 px-7 lg:px-5 lg:py-8 shadow-2xl transition-transform duration-300 ease-in-out
      ${dir === 'ltr' ? 'left-0' : 'right-0'}
      ${isSidebarOpen
          ? 'translate-x-0'
          : dir === 'ltr'
            ? '-translate-x-full'
            : 'translate-x-full'
        }`}
    >
      <div className="w-full h-full flex flex-col justify-start items-center">
        <Image src={logo} alt="logo" className="mb-8" />

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

                  <ul className={`pl-[40px] text-sm text-body list-disc overflow-hidden transition-all duration-500 ease-in-out ${isOpen === item.key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.children.map((child, i) => (
                      <li className="my-5" key={i}>
                        <Link href={`/${lang}${child.path}`} className="hover:text-[var(--main-color)] block py-1">
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
