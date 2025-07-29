'use client';

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// UI components
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import AnimateImage from "@/components/AnimateImage";
import SkeletonRows from "@/components/SkeletonRows";
import Pagination from "@/components/Pagination";

// API
import { deleteProductById, exportProductsPdf, getProductsWithPagination } from "@/api/products";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const t = useTranslations("products");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const path = usePathname();
    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchProducts = useCallback(({ page = 1, query = "" }) => {
        setLoading(true);
        setFetchError(null);

        getProductsWithPagination(page, query)
            .then((data) => {
                setProducts(data.data);
                setPagination({
                    links: data.links || [],
                    from: data.from || 0,
                    to: data.to || 0,
                    total: data.total || data.data?.length || 0,
                });
            })
            .catch((error) => {
                setFetchError(t("fetch_error"));
                console.error("Fetch error:", error);
            })
            .finally(() => setLoading(false));
    }, [t]);


    useEffect(() => {
        fetchProducts({ page: 1, query: debouncedQuery });
    }, [debouncedQuery]);


    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: 'warning',
            title: t("confirm_delete"),
            confirmButtonText: t("delete"),
            cancelButtonText: t("cancel")
        });

        if (!result.isConfirmed) return;

        try {
            await deleteProductById(id);
            fetchProducts({ page: 1, query: searchQuery });
            Toast.fire({ icon: 'success', title: t("delete_success") });
        } catch (error) {
            console.error("Delete error:", error);
            Alert.fire({ icon: 'error', title: t("delete_error") });
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.trim();
        setSearchQuery(value);
        // fetchProducts({ page: 1, query: value });
    };

    const handlePageChange = (page) => {
        fetchProducts({ page, query: searchQuery });
    };

    const handleExportPdf = async () => {
        try {
            Alert.fire({
                title: "جاري انشاء الملف...",
                allowOutsideClick: false,
                didOpen: () => {
                    Alert.showLoading();
                }
            });

            await exportProductsPdf();

            Alert.fire({
                icon: "success",
                title: "تم انشاء الملف",
                text: "شكرا لك تم انشاء الملف"
            });

        } catch (error) {
            Alert.fire({
                icon: "error",
                title: "حصلت مشكلة اثناء انشاء الملف",
                text: error.response?.data?.message || error.message || "حدث خطأ غير معروف"
            });
        }
    };

    return (
        <section className="w-full px-2 py-5">
            <Breadcrumb title={t("products_list")} listItems={[t("products_list")]} />

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
                        <span className="text-lg font-medium">{t("add_product")}</span>
                    </Link>
                </div>

                <div className="tools_container">
                    <input
                        type="search"
                        onChange={handleSearch}
                        placeholder={t("search")}
                        className="search-input border-border"
                    />

                    <div className="flex-center gap-3 self-end">
                        <button onClick={handleExportPdf} className="flex-center border border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group">
                            <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                        </button>
                    </div>
                </div>

                {fetchError && (
                    <div className="text-red-500 text-center mt-4">
                        {fetchError}
                    </div>
                )}

                <div className="table_container">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('image')}</th>
                                <th>{t("name")}</th>
                                <th>{t("description")}</th>
                                <th>{t("category")}</th>
                                <th>{t('count')}</th>
                                <th>{t("minQuantity")}</th>
                                <th>{t("unit")}</th>
                                <th>{t('buyingPrice')}</th>
                                <th>{t('sellingPrice')}</th>
                                <th>{t('weight')}</th>
                                <th>{t("status")}</th>
                                <th>{t('createdAt')}</th>
                                <th>{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4">
                                        <SkeletonRows/>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                                        <p>{t("no_products_found")}</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={`${product.id}-${index}`} className={`transition-colors duration-200 ${product.count <= product.minimum_quantity ? "bg-red-500 dark:bg-red-700 animate-pulse" : "bg-transparent"}`}> 
                                        <td>{product.id}</td>
                                        <td className="w-12 h-12">
                                            <AnimateImage
                                                src={product.image}
                                                alt={product.name}
                                                width={12}
                                                height={12}
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {product.description}
                                        </td>
                                        <td>{product.category?.name || "-"}</td>
                                        <td>{product.count}</td>
                                        <td>{product.minimum_quantity}</td>
                                        <td>{product.unit}</td>
                                        <td>{product.buying_price}</td>
                                        <td>{product.selling_price}</td>
                                        <td>{product.weight || '-'}</td>
                                        <td>
                                            {product.status === "active" ? (
                                                <span className="text-green-500 font-semibold">
                                                    {t("status_active")}
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">
                                                    {t("status_inactive")}
                                                </span>
                                            )}
                                        </td>
                                        <td>{new Date(product.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="dropdown_container">
                                                <Dropdown
                                                    align={locale === "ar" ? "left" : "right"}
                                                    width="48"
                                                    trigger={
                                                        <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} className="dropdown_btn">
                                                            {t("actions")}
                                                            <svg className="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    }
                                                >
                                                    <DropdownLink href={`${path}/edit/${product.id}`}>
                                                        {t('edit_product')}
                                                    </DropdownLink>
                                                    <DropdownButton onClick={() => handleDelete(product.id)}>
                                                        {t('delete_product')}
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

                <div className="w-full mt-4">
                    <Pagination
                        pagination={pagination}
                        lang={locale}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </section>
    );
};

export default Page;
