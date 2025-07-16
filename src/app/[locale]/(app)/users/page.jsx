'use client';

import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownLink, { DropdownButton } from '@/components/DropdownLink';
import { deleteProductById, getProducts } from "@/api/products";
import Dropdown from '@/components/Dropdown'

const page = () => {
    const t = useTranslations("products");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname();

    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {
        console.log(products);
    }, [products]);


    const fetchProducts = () => {
        getProducts()
            .then(setProducts)
            .catch((error) => {
                if (error.response?.status !== 409) throw error;
            })
            .finally(() => setLoading(false));
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد من حذف المنتج؟");
        if (!confirmDelete) return;

        try {
            await deleteProductById(id);
            fetchProducts();
        } catch (error) {
            console.error("حدث خطأ أثناء حذف المنتج:", error);
        }
    };


    return (
        <section className="w-full px-2 py-5">
            {/* Breadcrumb Area */}
            <Breadcrumb title={t("products_list")} listItems={[t("product_name"), t("products_list")]} />

            <div className="mt-4 w-full px-7 py-9 bg-white mb-5 shadow-2xl rounded-lg">
                <div className="w-[230px] cursor-pointer">
                    <Link href={`${path}/add`} className="main_btn capitalize  bg-[var(--green-color)] text-white transition-colors hover:bg-[var(--main-color)] duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {t("add_product") || "Add Product"}
                    </Link>
                </div>

                <div className="w-full mt-4 flex items-center justify-between">
                    <input type="search" placeholder="Search" name="search-input" id="search-input" className="search-input border-border" />

                    {/* Filter and Download Area */}
                    <div className="flex-center gap-3">
                        {/* Filter */}
                        <div className="flex-center gap-2 border border-solid border-[var(--bink-color)] px-3 py-2 cursor-pointer hover:bg-[var(--bink-color)] group hover:text-white transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[var(--bink-color)] group-hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            <span className="text-[var(--bink-color)] text-[14px] font-semibold group-hover:text-white">Filter</span>
                        </div>

                        {/* Download PDF */}
                        <div className="flex-center gap-2 border border-solid border-[var(--orange-color)] w-10 h-10 cursor-pointer hover:bg-[var(--orange-color)] group">
                            <i className="fa-solid fa-file-pdf text-[var(--orange-color)] group-hover:text-white text-2xl"></i>
                        </div>

                        {/* Print */}
                        <div className="flex-center gap-2 border border-solid border-[var(--green-color)] w-10 h-10 cursor-pointer hover:bg-[var(--green-color)] group">
                            <i className="fa-solid fa-print text-[var(--green-color)] group-hover:text-white text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-4 overflow-x-auto">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>image</th>
                                <th>name</th>
                                <th>description</th>
                                <th>category</th>
                                <th>count</th>
                                <th>minimum_quantity</th>
                                <th>unit</th>
                                <th>buying_price</th>
                                <th>selling_price</th>
                                <th>weight</th>
                                <th>status</th>
                                <th>created_at</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={13} className="text-center py-4">Loading...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="text-center py-4">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td><img src={product.image} alt={product.name} className="w-12 h-12 object-cover" /></td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category?.name}</td>
                                        <td>{product.count}</td>
                                        <td>{product.minimum_quantity}</td>
                                        <td>{product.unit}</td>
                                        <td>{product.buying_price}</td>
                                        <td>{product.selling_price}</td>
                                        <td>{product.weight}</td>
                                        <td>{product.status}</td>
                                        <td>{new Date(product.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="hidden md:flex items-center gap-2 relative ">
                                                <Dropdown
                                                    align="right"
                                                    width="48"
                                                    trigger={
                                                        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                                            <div className="flex justify-center items-center gap-2">
                                                                <div className='capitalize'>action</div>
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
                                                    <DropdownLink href={`${path}/edit/${product.id}`}>
                                                        Edit Product
                                                    </DropdownLink>
                                                    <DropdownButton onClick={() => handleDelete(product.id)}>
                                                        Delete Product
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

export default page;
