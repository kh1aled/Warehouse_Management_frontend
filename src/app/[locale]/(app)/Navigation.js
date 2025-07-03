import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import DropdownLink, { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import logo from '@/assets/header-profile.svg'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'

const Navigation = ({ user , lang , dir }) => {
    const { logout } = useAuth()

    const [open, setOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <nav className="navbar border-border flex justify-between items-center px-4 py-2">
            <Sidebar
                dir={dir}
                lang={lang}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Toggler Button */}
            <div id="navbar-toggler" className="navbar_toggler">
                <button className="toggler_btn" onClick={toggleSidebar}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-menu text-blue-500">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Navbar Items */}
            <ul className="navbar_list flex items-center gap-6">
                {/* Add Button */}
                <li className="navbar_item cursor-pointer">
                    <a href="#" className="navbar_link border-border add_link">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-neutral-700 hover:text-neutral-900">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </a>
                </li>

                {/* Language Switcher */}
                <li className="navbar_item cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2 relative ">
                            {/* <span className="text-[14px] font-bold text-body group">ENG</span> */}
                            <Dropdown
                                align="right"
                                width="48"
                                trigger={
                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                        <div className="flex justify-center items-center gap-2">
                                            <div>
                                                <i className="fa-solid fa-globe"></i>
                                            </div>
                                            <div className=' uppercase'>{lang}</div>
                                        </div>

                                        <div className="ml-1">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                }>
                                {/* Authentication */}
                                <DropdownLink href={`/en/dashboard`}>
                                    En
                                </DropdownLink>
                                <DropdownLink href={`/ar/dashboard`}>
                                    AR
                                </DropdownLink>
                            </Dropdown>
                        </div>
                    </div>
                </li>

                {/* Settings Dropdown */}
                <li className="navbar_item cursor-pointer">
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div className="flex-center gap-5">
                                        <span>
                                            <Image
                                                src={logo}
                                                alt="Profile Logo"
                                                className="w-12 h-12 rounded-full"
                                            />
                                        </span>

                                        <div className="hidden md:flex flex-col justify-center gap-0">
                                            <h5 className="text-heading font-bold text-[15px] capitalize">
                                                {user?.name || user?.email}
                                            </h5>
                                            <span className="text-body font-normal text-[13px]">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>
                </li>

                <li className="navbar_item cursor-pointer">
                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation


