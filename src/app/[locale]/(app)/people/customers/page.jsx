'use client';

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import { deleteCustomerById, getCustomers } from "@/api/customers";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";
import SkeletonRows from "@/components/SkeletonRows";

const Page = ({ params }) => {
    const t = useTranslations("customers");
    const tAlert = useTranslations("customers.alerts");

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const path = usePathname();
    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    const fetchCustomers = useCallback(() => {
        setLoading(true);
        getCustomers()
            .then((data) => {
                setCustomers(data);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: 'warning',
            title: t("confirm_delete") || "هل أنت متأكد من الحذف؟",
            confirmButtonText: t("delete") || "حذف",
            cancelButtonText: t("cancel") || "إلغاء"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteCustomerById(id);
            fetchCustomers();
            Toast.fire({ icon: 'success', title: t("delete_success") || "تم الحذف بنجاح" });
        } catch (error) {
            console.error("Delete error:", error);
            Alert.fire({ icon: 'error', title: t("delete_error") || "حدث خطأ أثناء الحذف" });
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.trim();
        setSearchQuery(value);
    };

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportPdf = async () => {
        try {
            // عرض تحميل
            Alert.fire({
                title: tAlert("generatingPdfTitle"),
                allowOutsideClick: false,
                didOpen: () => {
                    Alert.showLoading();
                }
            });

            await exportCustomerPdf();

            Alert.fire({
                icon: "success",
                title: tAlert("successTitle"),
                text: tAlert("successText"),
            });

        } catch (error) {
            Alert.fire({
                icon: "error",
                title: tAlert("errorTitle"),
                text: error.response?.data?.message || error.message || tAlert("unknownError"),
            });
        }
    };

    return (
        <section className="w-full px-2 py-5">
            <Breadcrumb
                title={t("customers_list") || "Customers List"}
                listItems={[t("customers_list") || "Customers List"]}
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
                        <span className="text-lg font-medium">{t("add_customer") || "Add Customer"}</span>
                    </Link>
                </div>

                {/* Search and tools */}
                <div className="w-full mt-4 flex items-center justify-between">


                    <input
                        type="search"
                        placeholder={t("search") || "Search"}
                        onChange={handleSearch}
                        className="search-input border-border"
                    />

                    {/* Filter and export buttons */}
                    <div className="flex-center gap-3">
                        {/* Filter button */}
                        {/* <div className="flex-center gap-2 border border-[var(--bink-color)] px-3 py-2 cursor-pointer hover:bg-[var(--bink-color)] group hover:text-white transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor" className="size-6 text-[var(--bink-color)] group-hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            <span className="text-[var(--bink-color)] text-sm font-semibold group-hover:text-white">
                                Filter
                            </span>
                        </div> */}

                        {/* Export PDF */}
                        <button onClick={handleExportPdf} className="flex-center border border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group">
                            <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                        </button>

                        {/* Print */}
                        {/* <div className="flex-center border border-[var(--green-color)] w-10 h-10 cursor-pointer hover:bg-[var(--green-color)] group">
                            <i className="fa-solid fa-print text-[var(--green-color)] group-hover:text-white text-2xl"></i>
                        </div> */}
                    </div>
                </div>

                <div className="table_container">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("name")}</th>
                                <th>{t("email")}</th>
                                <th>{t("phone")}</th>
                                <th>{t("address")}</th>
                                <th>{t("country")}</th>
                                <th>{t("city")}</th>
                                <th>{t("zip_code")}</th>
                                <th>{t("created_at")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <SkeletonRows />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-users-slash text-4xl mb-2"></i>
                                        <p>{t("no_customers_found") || "No customers found."}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone?.phone_number || '-'}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.country}</td>
                                        <td>{customer.city}</td>
                                        <td>{customer.zip_code}</td>
                                        <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <Dropdown
                                                align={locale === "ar" ? "left" : "right"}
                                                width="48"
                                                trigger={
                                                    <button
                                                        className="dropdown_btn"
                                                    >
                                                        {t("actions") || "Actions"}
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
                                                <DropdownLink href={`${path}/edit/${customer.id}`}>
                                                    {t("edit_customer") || "Edit Customer"}
                                                </DropdownLink>
                                                <DropdownButton onClick={() => handleDelete(customer.id)}>
                                                    {t("delete_customer") || "Delete Customer"}
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
