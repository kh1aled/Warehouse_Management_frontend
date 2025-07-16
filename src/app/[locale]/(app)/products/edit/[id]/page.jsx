'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
import { getProductById, updateProductById } from "@/api/products";
import { getCategories } from "@/api/categories";
import drag from "@/assets/drag.png";
import { createToast, createAlert } from "@/lib/sweetalert";
import { useTranslations } from "next-intl";

const Page = ({ params }) => {
    const router = useRouter();
    const t = useTranslations("products");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        count: "",
        minimum_quantity: "",
        unit: "",
        buying_price: "",
        selling_price: "",
        weight: "",
        status: "active",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const Toast = createToast();
    const Alert = createAlert();

    const { id, locale } = params;

    // Load product data
    useEffect(() => {
        getProductById(id)
            .then((data) => {
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    category: data.category_id || "",
                    count: data.count || "",
                    minimum_quantity: data.minimum_quantity || "",
                    unit: data.unit || "",
                    buying_price: data.buying_price || "",
                    selling_price: data.selling_price || "",
                    weight: data.weight || "",
                    status: data.status || "active",
                    image: "",
                });
                if (data.image) setImagePreview(data.image);
            })
            .catch((error) => {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("product_edit.alerts.loadError"),
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Load categories
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((error) => {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("product_edit.alerts.categoriesError"),
                });
            });
    }, []);

    useEffect(() => {
        if (formData.image && typeof formData.image !== "string") {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

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
                if (key === "image") {
                    if (value && typeof value !== "string") {
                        data.append("image", value);
                    }
                } else {
                    data.append(key, value ?? "");
                }
            });

            await updateProductById(id, data);

            Toast.fire({
                icon: "success",
                title: t("product_edit.alerts.updateSuccess"),
            });

            router.push(`/${locale}/products`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({
                    icon: "error",
                    title: t("product_edit.alerts.fieldErrors"),
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("product_edit.alerts.updateError"),
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: "name", type: "text" },
        { id: "description", type: "text", },
        { id: "count", type: "number" },
        { id: "minimum_quantity", type: "number" },
        { id: "unit", type: "text" },
        { id: "buying_price", type: "text" },
        { id: "selling_price", type: "text" },
        { id: "weight", type: "text" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title={t("product_edit.title")} listItems={[t("product_edit.title"), t("product_edit.EditProduct")]} />
            <div className="main_section">
                {
                    loading ?
                        (<div className="w-full p-8 relative">
                            <Loader />
                        </div>
                        )
                        :
                        (
                            <>
                                <form
                                    id="editProductForm"
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
                                                    {t(`fields.${id}.label`)}
                                                </label>
                                                <input
                                                    id={id}
                                                    type={type}
                                                    value={formData[id]}
                                                    onChange={handleChange}
                                                    className={`form-input ${errors[id] ? "!border-red-500" : ""}`}
                                                />
                                                {errors[id] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                                                )}
                                            </div>
                                        ))}

                                        {/* Category */}
                                        <div className="mb-5">
                                            <label className="form-label" htmlFor="category_id">
                                                {t("fields.category.label")}
                                            </label>
                                            <select
                                                id="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="form-select appearance-none"
                                            >
                                                <option value="">{t("fields.category.placeholder")}</option>
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
                                                {t("fields.status.label")}
                                            </label>
                                            <select
                                                id="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="active">{t("fields.status.options.active")}</option>
                                                <option value="inactive">{t("fields.status.options.inactive")}</option>
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
                                                        alt={t("image_upload.alt")}
                                                        className="max-h-[200px] max-w-[200px] object-contain rounded-md"
                                                    />
                                                ) : (
                                                    <Image src={drag} alt={t("image_upload.placeholderAlt")} className="h-16 w-16" />
                                                )}
                                                <p className="text-sm text-gray-400">{t("image_upload.dropText")}</p>
                                                <span className="px-4 py-1 bg-[var(--green-color)] text-white rounded hover:bg-[var(--main-color)] transition">
                                                    {t("image_upload.browseButton")}
                                                </span>
                                                <span className="text-xs text-gray-500">{t("image_upload.note")}</span>
                                            </div>
                                        </label>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
                                        )}
                                    </div>
                                </form>

                                <div className="w-full flex justify-end mt-8">
                                    <button
                                        type="submit"
                                        form="editProductForm"
                                        disabled={submitLoading}
                                        className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        {submitLoading ? t("product_edit.saveButton") : t("product_edit.createButton")}
                                    </button>
                                </div>
                            </>

                        )
                }
            </div>

        </section>
    );
};

export default Page;
