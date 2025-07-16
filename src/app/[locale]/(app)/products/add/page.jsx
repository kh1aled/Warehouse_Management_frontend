'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
import { createProduct } from "@/api/products";
import { getCategories } from "@/api/categories";

import drag from "@/assets/drag.png";
import { useTranslations } from "next-intl";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const router = useRouter();
    const tProducts = useTranslations('products');
    const t = useTranslations('products.add');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        count: "",
        minimum_quantity: "",
        unit: "",
        buying_price: "",
        selling_price: "",
        weight: "",
        status: "active",
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();
    const { locale } = params;

    // Generate image preview when file selected
    useEffect(() => {
        if (formData.image) {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

    // Fetch categories
    useEffect(() => {
        setCategoriesLoading(true);
        getCategories()
            .then(setCategories)
            .catch((error) => {
                console.error("Error fetching categories:", error);
                Alert.fire({
                    icon: 'error',
                    title: t('alerts.categories_error')
                });
            })
            .finally(() => setCategoriesLoading(false));
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) data.append(key, value);
            });

            await createProduct(data);
            Toast.fire({
                icon: 'success',
                title: t('alerts.create_success')
            });
            setImagePreview(null);
            setFormData({
                name: "",
                description: "",
                category_id: "",
                count: "",
                minimum_quantity: "",
                unit: "",
                buying_price: "",
                selling_price: "",
                weight: "",
                status: "active",
                image: null,
            });
            router.push(`/${locale}/products`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                //field_errors
                Alert.fire({
                    icon: 'error',
                    title: t('alerts.field_errors')
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t('alerts.create_error')
                })
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: 'name', type: 'text' },
        { id: 'description', type: 'text' },
        { id: 'count', type: 'number' },
        { id: 'minimum_quantity', type: 'number' },
        { id: 'unit', type: 'text' },
        { id: 'buying_price', type: 'text' },
        { id: 'selling_price', type: 'text' },
        { id: 'weight', type: 'text' },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title={t("addProduct")} listItems={[t('products'), t("addProduct")]} />
            <div className="main_section">
                {categoriesLoading ? (
                    <div className="w-full p-8 relative">
                        <Loader />
                    </div>

                ) : (
                    <form
                        id="addProductForm"
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col lg:flex-row gap-6"
                        encType="multipart/form-data"
                        style={{ opacity: submitLoading ? 0.6 : 1, pointerEvents: submitLoading ? "none" : "auto" }}
                    >
                        {/* Left: Fields */}
                        <div className="form-container lg:w-[70%] w-full">
                            {fields.map(({ id, type }) => (
                                <div className="mb-5" key={id}>
                                    <label className="form-label" htmlFor={id}>
                                        {tProducts(`fields.${id}.label`)}
                                    </label>
                                    <input
                                        id={id}
                                        type={type}
                                        value={formData[id]}
                                        placeholder={tProducts(`fields.${id}.placeholder`)}
                                        onChange={handleChange}
                                        className={`form-input ${errors[id] ? '!border-red-500' : ''}`}
                                    />

                                    {errors[id] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                                    )}
                                </div>
                            ))}

                            {/* Category */}
                            <div className="mb-5">
                                <label className="form-label" htmlFor="category_id">
                                    {tProducts('fields.category.label')}
                                </label>
                                <select
                                    id="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="form-select appearance-none"
                                >
                                    <option value="">{tProducts('fields.category.label')}</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="mb-5">
                                <label className="form-label" htmlFor="status">
                                    {tProducts('fields.status.label')}
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="active">{tProducts('fields.status.options.active')}</option>
                                    <option value="inactive">{tProducts('fields.status.options.inactive')}</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Image Upload */}
                        <div className="product_image w-full lg:w-[30%]">
                            <input
                                id="ImageContent"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <label
                                htmlFor="ImageContent"
                                className="w-full h-full border-2 border-dashed border-[#505050] flex flex-col items-center justify-center text-gray-300 rounded-lg p-4 hover:border-[var(--green-color)] cursor-pointer transition"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={tProducts('image_upload.alt')}
                                            className="product-image-preview"
                                        />
                                    ) : (
                                        <Image src={drag} alt={tProducts('image_upload.placeholderAlt')} className="h-16 w-16" />
                                    )}
                                    <p className="text-sm text-gray-400">
                                        {tProducts('image_upload.dropText')}
                                    </p>
                                    <span className="px-4 py-1 bg-[var(--green-color)] text-white rounded hover:bg-[var(--main-color)] transition">
                                        {tProducts('image_upload.browseButton')}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {tProducts('image_upload.note')}
                                    </span>
                                </div>
                            </label>
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
                            )}
                        </div>
                    </form>
                )}

                {/* Submit Button */}
                {!categoriesLoading && (
                    <div className="w-full flex justify-end mt-8">
                        <button
                            type="submit"
                            form="addProductForm"
                            disabled={submitLoading}
                            className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)]  transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {submitLoading ? t('saveButton') : t('createButton')}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Page;
