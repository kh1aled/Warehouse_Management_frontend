'use client';

// Import hooks and libraries
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import UI components
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import AnimateImage from "@/components/AnimateImage";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination"
// Import API functions
import { deleteProductById, exportProductsPdf, getProductsWithPagination } from "@/api/products";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";

const Page = ({ params }) => {
    // Initialize translations
    const t = useTranslations("products");

    // Define state variables
    const [products, setProducts] = useState([]);        // Filtered products to display
    const [loading, setLoading] = useState(true);        // Loading state
    const [fetchError, setFetchError] = useState(null);  // Error message if fetching fails
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState("");



    // Get current route path and locale
    const path = usePathname();
    const { locale } = params;

    // Create alert/confirm/toast helpers
    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    // Fetch products from API and update state
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

    //when change page
    const handlePageChange = (page) => {
        fetchProducts({ page, query: searchQuery });
    };

    // Load products when component mounts
    useEffect(() => {
        fetchProducts({ page: 1 });
    }, [fetchProducts]);

    useEffect(() => {
        console.log(pagination);
    }, [pagination])


    // Handle product deletion with confirmation dialog
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
            fetchProducts(); // Refresh product list after deletion
            Toast.fire({ icon: 'success', title: t("delete_success") });
        } catch (error) {
            console.error("Delete error:", error);
            Alert.fire({ icon: 'error', title: t("delete_error") });
        }
    };

    // Handle search input to filter products by name, description, or category
    const handleSearch = (e) => {
        const value = e.target.value.trim();
        setSearchQuery(value);
        fetchProducts({ page: 1, query: value });
    };

    const handleExportPdf = async () => {
        try {
            // عرض تحميل
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
            {/* Breadcrumb navigation */}
            <Breadcrumb title={t("products_list")} listItems={[t("products_list")]} />

            {/* Main container */}
            <div className="main_section">

                {/* Add product button */}
                <div className="w-[230px] cursor-pointer">
                    <Link
                        href={`${path}/add`}
                        className="main_btn capitalize bg-[var(--green-color)] text-white transition-colors hover:bg-[var(--main-color)] duration-150"
                    >
                        {/* Plus icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-lg font-medium">{t("add_product")}</span>
                    </Link>
                </div>

                {/* Search and tools */}
                <div className="w-full mt-4 flex items-center justify-between">
                    {/* Search input */}
                    <input
                        type="search"
                        onChange={handleSearch}
                        placeholder={t("search")}
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

                {/* Error message if fetching failed */}
                {fetchError && (
                    <div className="text-red-500 text-center mt-4">
                        {fetchError}
                    </div>
                )}

                {/* Product table */}
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
                            {/* Show loader while loading */}
                            {loading ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                // No products found
                                <tr>
                                    <td colSpan={14} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                                        <p>{t("no_products_found")}</p>
                                    </td>
                                </tr>
                            ) : (
                                // Display products
                                products.map(product => (
                                    <tr key={product.id}>
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
                                        <td>{product.weight ? product.weight : '-'}</td>
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
                                            {/* Action dropdown */}
                                            <div className="dropdown_container ">
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
                                                    {/* Edit product link */}
                                                    <DropdownLink href={`${path}/edit/${product.id}`}>
                                                        {t('edit_product')}
                                                    </DropdownLink>
                                                    {/* Delete product button */}
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

                {/* Pagination */}
                <div className="w-full mt-4">
                    <Pagination
                        pagination={pagination}
                        lang={locale}
                        onPageChange={(page) => fetchProducts({ page })}
                    />
                </div>
            </div>
        </section>
    );
};

export default Page;
