'use client';

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import Loader from "@/components/Loader";
import { deleteEmployeeById, getEmployees } from "@/api/employees";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";
// import { exportEmployeesPdf } from "@/api/employees"; // Uncomment if available
import AnimateImage from "@/components/AnimateImage";

const Page = () => {
    const t = useTranslations("employees");
    const tAlert = useTranslations("employees.alerts");

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const path = usePathname();

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    const fetchEmployees = useCallback(() => {
        setLoading(true);
        getEmployees()
            .then(setEmployees)
            .catch((error) => console.error("Fetch error:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: 'warning',
            title: t("confirm_delete") || "هل أنت متأكد من الحذف؟",
            confirmButtonText: t("delete") || "حذف",
            cancelButtonText: t("cancel") || "إلغاء"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteEmployeeById(id);
            fetchEmployees();
            Toast.fire({ icon: 'success', title: t("delete_success") || "تم الحذف بنجاح" });
        } catch (error) {
            console.error("Delete error:", error);
            Alert.fire({ icon: 'error', title: t("delete_error") || "حدث خطأ أثناء الحذف" });
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.trim());
    };

    const filteredEmployees = employees.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const handleExportPdf = async () => {
    //     try {
    //         Alert.fire({
    //             title: tAlert("generatingPdfTitle"),
    //             allowOutsideClick: false,
    //             didOpen: () => Alert.showLoading()
    //         });

    //         await exportEmployeesPdf();

    //         Alert.fire({
    //             icon: "success",
    //             title: tAlert("successTitle"),
    //             text: tAlert("successText"),
    //         });
    //     } catch (error) {
    //         Alert.fire({
    //             icon: "error",
    //             title: tAlert("errorTitle"),
    //             text: error.response?.data?.message || error.message || tAlert("unknownError"),
    //         });
    //     }
    // };

    return (
        <section className="w-full px-2 py-5">
            <Breadcrumb
                title={t("employees_list") || "Employees List"}
                listItems={[t("employees_list") || "Employees List"]}
            />

            <div className="main_section">
                <div className="w-[230px] cursor-pointer">
                    <Link
                        href={`${path}/add`}
                        className="main_btn capitalize bg-[var(--green-color)] text-white transition-colors hover:bg-[var(--main-color)] duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-lg font-medium">{t("add_employee") || "Add Employee"}</span>
                    </Link>
                </div>

                {/* Search and Actions */}
                <div className="w-full mt-4 flex items-center justify-between">
                    <input
                        type="search"
                        placeholder={t("search") || "Search"}
                        onChange={handleSearch}
                        className="search-input border-border"
                    />

                    {/* Optional Export PDF */}
                    {/* <button onClick={handleExportPdf} className="flex-center border border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group">
                        <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                    </button> */}
                </div>

                <div className="table_container mt-4">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("image") || "Image"}</th>
                                <th>{t("name") || "Name"}</th>
                                <th>{t("email")}</th>
                                <th>{t("username")}</th>
                                <th>{t("phone")}</th>
                                <th>{t("address")}</th>
                                <th>{t("role")}</th>
                                <th>{t("status")}</th>
                                <th>{t("hire_date")}</th>
                                <th>{t("salary")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={12} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-user-slash text-4xl mb-2"></i>
                                        <p>{t("no_employees_found") || "No employees found."}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>
                                            {
                                                employee?.photo == null ? (
                                                    "-"
                                                ) : (
                                                    <AnimateImage
                                                        src={employee.photo}
                                                        alt={employee.name}
                                                        width={12}
                                                        height={12}
                                                    />
                                                )
                                            }
                                        </td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.username}</td>
                                        <td>{employee.phone[0]?.phone_number || '-'}</td>
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
                                                    <button className="dropdown_btn">
                                                        {t("actions")}
                                                        <svg className="ml-1 w-4 h-4 fill-current" viewBox="0 0 20 20">
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
                                                    {t("edit_employee") || "Edit Employee"}
                                                </DropdownLink>
                                                <DropdownButton onClick={() => handleDelete(employee.id)}>
                                                    {t("delete_employee") || "Delete Employee"}
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
