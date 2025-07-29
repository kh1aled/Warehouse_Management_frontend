'use client';

import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import drag from "@/assets/drag.png";
import { useEffect, useState } from "react";
import { createCategory, deleteCategoryById, getCategories } from "@/api/categories";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import Dropdown from "@/components/Dropdown";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";
import AnimateImage from "@/components/AnimateImage";
import Loader from "@/components/Loader";
import SkeletonRows from "@/components/SkeletonRows";


const Page = ({ params }) => {
    const t = useTranslations("products");
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname();
    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();


    useEffect(() => {
        if (formData.image) {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const data = new FormData();
            if (formData.name) data.append("name", formData.name);
            if (formData.description) data.append("description", formData.description);
            if (formData.image) data.append("image", formData.image);
            await createCategory(data);
            Alert.fire({ icon: "success", title: t("categories.successAdd") })
            setFormData({ name: '', description: '', image: null });
            setImagePreview(null);
            fetchCategories();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({ icon: "error", title: t("categories.errorFields") })
            } else {
                console.error(error);
                Alert.fire({ icon: "error", title: t("categories.errorAdd") })

            }
        }
    };

    const fetchCategories = () => {
        getCategories()
            .then(setCategories)
            .catch((error) => {
                console.error("Fetch categories error:", error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const handleDelete = async (id) => {

        const result = await Confirm.fire({
            icon: "warning",
            title: t("categories.confirmDelete"),
            confirmButtonText: t("delete"),
            cancelButtonText: t("cancel"),
        });

        if (!result) return;
        try {
            await deleteCategoryById(id);
            fetchCategories();
            Toast.fire({ icon: "success", title: t("categories.deleteSuccess") });
        } catch (error) {
            console.error("Error is: ", error);
            Alert.fire({ icon: "error", title: t("categories.deleteError") });

        }
    };

    return (
        <section className="custom-section">
            <Breadcrumb
                title={t('categories.breadcrumb')}
                listItems={[t('categories.breadcrumb')]}
            />

            <div className="basic_section mb-5 shadow-2xl rounded-lg space-y-5 grid grid-cols-12 gap-x-7 sm:gap-x-5">
                <div className="add-category-form col-span-12 sm:col-span-12 lg:col-span-3">
                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="form-field">
                            <label className="form-label" htmlFor="name">{t('categories.categoryName')}</label>
                            <input
                                className={`form-input ${errors['name'] ? '!border-red-500' : ''}`}
                                id="name"
                                type="text"
                                value={formData.name}
                                placeholder={t('categories.enterCategoryName')}
                                onChange={handleChange}

                            />
                            {errors["name"] && <p className="text-red-500 text-sm mt-1">{errors["name"][0]}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="description">{t('categories.description')}</label>
                            <input
                                className={`form-input ${errors['name'] ? '!border-red-500' : ''}`}
                                id="description"
                                type="text"
                                value={formData.description}
                                placeholder={t('categories.enterCategoryDescription')}
                                onChange={handleChange}
                            />
                            {errors["description"] && <p className="text-red-500 text-sm mt-1">{errors["description"][0]}</p>}
                        </div>

                        <div className="product_image relative max-h-[600px] min-h-[400px]">
                            <input
                                id="ImageContent"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="ImageContent" className="product-image-upload-inner cursor-pointer ">
                                <div className="flex flex-col items-center gap-5">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="product-image-preview" />
                                    ) : (
                                        <Image src={drag} alt="drag-drop-icon" />
                                    )}
                                    <h4>{t('categories.dropImageHere')}</h4>
                                    <h4>{t('categories.or')}</h4>
                                    <button
                                        type="button"
                                        className="rounded_btn"
                                        onClick={() => document.getElementById("ImageContent")?.click()}
                                    >
                                        {t('categories.browseFile')}
                                    </button>
                                    <span>{t('categories.allowedFormats')}</span>
                                </div>
                            </label>
                        </div>



                        <div className="form-field">
                            <button type="submit" className="rounded_btn">{t('categories.createCategory')}</button>
                        </div>
                    </form>
                </div>
                <div className="w-full mt-4 overflow-x-auto col-span-12 sm:col-span-12 lg:col-span-9">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>{t('categories.id')}</th>
                                <th>{t('categories.image')}</th>
                                <th>{t('categories.name')}</th>
                                <th>{t('categories.description')}</th>
                                <th>{t('categories.createdAt')}</th>
                                <th>{t('categories.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4">
                                        <SkeletonRows/>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                                        <p>{t("no_products_found")}</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>
                                            <AnimateImage
                                                src={category.image}
                                                alt={category.name}
                                                width={12}
                                                height={12}
                                            />
                                        </td>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="hidden md:flex justify-center items-center gap-2">
                                                <Dropdown
                                                    align={locale === "ar" ? "left" : "right"}
                                                    width="48"
                                                    trigger={
                                                        <button className="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-white hover:text-gray-700">
                                                            <span className="capitalize">{t('categories.actions')}</span>
                                                            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    }
                                                >
                                                    <DropdownLink href={`${path}/edit/${category.id}`}>
                                                        {t('categories.editCategory')}
                                                    </DropdownLink>
                                                    <DropdownButton onClick={() => handleDelete(category.id)}>
                                                        {t('categories.deleteCategory')}
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
