'use client';

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import Loader from "@/components/Loader";
import { deleteSupplierById, exportSuppliersPdf, getSuppliers } from "@/api/suppliers";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";
import SkeletonRows from "@/components/SkeletonRows";

const Page = ({ params }) => {
    const t = useTranslations("suppliers");
    const tAlert = useTranslations("suppliers.alerts");

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const path = usePathname();
    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    const fetchSuppliers = useCallback(() => {
        setLoading(true);
        getSuppliers()
            .then((data) => setSuppliers(data))
            .catch((error) => console.error("Fetch error:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: 'warning',
            title: t("confirm_delete") || "هل أنت متأكد من الحذف؟",
            confirmButtonText: t("delete") || "حذف",
            cancelButtonText: t("cancel") || "إلغاء"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteSupplierById(id);
            fetchSuppliers();
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

    const filteredSuppliers = suppliers.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportPdf = async () => {
        try {
            Alert.fire({
                title: tAlert("generatingPdfTitle"),
                allowOutsideClick: false,
                didOpen: () => {
                    Alert.showLoading();
                }
            });

            await exportSuppliersPdf();

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
                title={t("suppliers_list")}
                listItems={[t("suppliers_list")]}
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
                        <span className="text-lg font-medium">{t("add_supplier")}</span>
                    </Link>
                </div>

                {/* Search and tools */}
                <div className="w-full mt-4 flex items-center justify-between">
                    <input
                        type="search"
                        placeholder={t("search")}
                        onChange={handleSearch}
                        className="search-input border-border"
                    />

                    {/* Tools */}
                    <div className="flex-center gap-3">
                        <button
                            onClick={handleExportPdf}
                            className="flex-center border border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group"
                        >
                            <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                        </button>
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
                            {loading ? 
                            (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <SkeletonRows />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-users-slash text-4xl mb-2"></i>
                                        <p>{t("no_suppliers_found")}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.id}</td>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.phone?.phone_number || '-'}</td>
                                        <td>{supplier.address}</td>
                                        <td>{supplier.country}</td>
                                        <td>{supplier.city}</td>
                                        <td>{supplier.zip_code}</td>
                                        <td>{new Date(supplier.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="dropdown_container ">
                                                <Dropdown
                                                    align={locale === "ar" ? "left" : "right"}
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
                                                    <DropdownLink href={`${path}/edit/${supplier.id}`}>
                                                        {t("edit_supplier")}
                                                    </DropdownLink>
                                                    <DropdownButton onClick={() => handleDelete(supplier.id)}>
                                                        {t("delete_supplier")}
                                                    </DropdownButton>
                                                </Dropdown>
                                            </div>

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
