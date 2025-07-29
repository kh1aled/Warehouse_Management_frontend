'use client';

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import SkeletonRows from "@/components/SkeletonRows";
import { getRoles, deleteRoleById, exportRolesPdf } from "@/api/roles";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const t = useTranslations("roles");
    const tAlert = useTranslations("roles.alerts");
    const { locale } = params;

    const path = usePathname();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    const fetchRoles = useCallback(() => {
        setLoading(true);
        getRoles()
            .then((data) => setRoles(data))
            .catch((error) => console.error("Fetch error:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: 'warning',
            title: t("confirm_delete"),
            confirmButtonText: t("delete"),
            cancelButtonText: t("cancel")
        });

        if (!result.isConfirmed) return;

        try {
            await deleteRoleById(id);
            fetchRoles();
            Toast.fire({ icon: 'success', title: t("delete_success") });
        } catch (error) {
            console.error("Delete error:", error);
            Alert.fire({ icon: 'error', title: t("delete_error") });
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.trim());
    };

    const filteredRoles = roles.filter((r) =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id?.toString().includes(searchQuery)
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

            await exportRolesPdf();

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
            <Breadcrumb title={t("roles_list")} listItems={[t("users_list") , t("roles_list")]} />

            <div className="main_section">
                <div className="w-[230px] cursor-pointer">
                    <Link
                        href={`${path}/add`}
                        className="main_btn capitalize bg-[var(--green-color)] text-white hover:bg-[var(--main-color)] transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-lg font-medium">{t("add_role")}</span>
                    </Link>
                </div>

                <div className="tools_container">
                    <input
                        type="search"
                        placeholder={t("search")}
                        onChange={handleSearch}
                        className="search-input border-border"
                    />
                    <div className="flex-center gap-3 self-end">
                        <button onClick={handleExportPdf} className="flex-center border border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group">
                            <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                        </button>
                    </div>
                </div>

                <div className="table_container mt-4">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("name")}</th>
                                <th>{t("created_at")}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        <SkeletonRows />
                                    </td>
                                </tr>
                            ) : filteredRoles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-4">
                                        <i className="fa-solid fa-user-lock text-4xl mb-2"></i>
                                        <p>{t("no_roles_found")}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRoles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-4 py-2">{role.id}</td>
                                        <td className="px-4 py-2">{role.name}</td>
                                        <td className="px-4 py-2">{role.created_at}</td>
                                        <td>
                                            <Dropdown
                                                align={locale === "ar" ? "left" : "right"}
                                                width="48"
                                                trigger={
                                                    <button className="dropdown_btn w-full">
                                                        {t("actions")}
                                                        <svg className="ml-1 w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                }
                                            >
                                                <DropdownLink href={`${path}/edit/${role.id}`}>
                                                    {t("edit_role")}
                                                </DropdownLink>
                                                <DropdownButton onClick={() => handleDelete(role.id)}>
                                                    {t("delete_role")}
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