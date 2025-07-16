'use client';

import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownLink, { DropdownButton } from '@/components/DropdownLink';
import { deleteEmployeeById, getEmployees } from "@/api/employees";
import Dropdown from '@/components/Dropdown';
import Loader from "@/components/Loader";

const Page = () => {
    const t = useTranslations("employees");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname();

    useEffect(() => {
        fetchEmployees();
    }, []);



    const fetchEmployees = () => {
        getEmployees()
            .then(setEmployees)
            .catch((error) => {
                if (error.response?.status !== 409) throw error;
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loading ? console.log("Loading employees...") : console.log("Employees loaded:", employees);
    }, [employees]);


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد من حذف الموظف؟");
        if (!confirmDelete) return;

        try {
            await deleteEmployeeById(id);
            fetchEmployees();
        } catch (error) {
            console.error("حدث خطأ أثناء حذف الموظف:", error);
        }
    };

    return (
        <section className="w-full px-2 py-5">
            <Breadcrumb
                title={t("employees_list") || "Employees List"}
                listItems={[t("employee_name") || "Employee", t("employees_list") || "Employees List"]}
            />

            <div className="mt-4 w-full px-7 py-9 bg-white mb-5 shadow-2xl rounded-lg">
                <div className="w-[230px] cursor-pointer">
                    <Link
                        href={`${path}/add`}
                        className="main_btn capitalize bg-[var(--green-color)] text-white transition-colors hover:bg-[var(--main-color)] duration-150"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        {t("add_employee") || "Add Employee"}
                    </Link>
                </div>

                <div className="w-full mt-4 flex items-center justify-between">
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-input border-border"
                    />

                    {/* Actions */}
                    <div className="flex-center gap-3">
                        <div className="flex-center gap-2 border border-[var(--bink-color)] px-3 py-2 cursor-pointer hover:bg-[var(--bink-color)] group hover:text-white transition-colors duration-150">
                            <svg
                                className="size-6 text-[var(--bink-color)] group-hover:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                />
                            </svg>
                            <span className="text-[14px] font-semibold group-hover:text-white">Filter</span>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-4 overflow-x-auto">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Hire Date</th>
                                <th>Salary</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4">No employees found.</td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td><img src={employee.photo} alt={employee.name} className="w-12 h-12 object-cover" /></td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.username}</td>
                                        <td>
                                            {employee.phone[0]?.phone_number !== "" && employee.phone[0] != null
                                                ? employee.phone[0]?.phone_number
                                                : "-"}
                                        </td>
                                        <td>{employee.address}</td>
                                        <td>{employee.role}</td>
                                        <td>{employee.status}</td>
                                        <td>{new Date(employee.hire_date).toLocaleDateString()}</td>
                                        <td>{employee.salary}</td>
                                        <td>
                                            <Dropdown
                                                align="right"
                                                width="48"
                                                trigger={
                                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                                                        <div className="capitalize">action</div>
                                                        <svg
                                                            className="ml-1 h-4 w-4 fill-current"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                }
                                            >
                                                <DropdownLink href={`${path}/edit/${employee.id}`}>
                                                    Edit Employee
                                                </DropdownLink>
                                                <DropdownButton onClick={() => handleDelete(employee.id)}>
                                                    Delete Employee
                                                </DropdownButton>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Page;
