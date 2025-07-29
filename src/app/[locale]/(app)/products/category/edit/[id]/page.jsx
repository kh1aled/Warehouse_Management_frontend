'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
import drag from "@/assets/drag.png";
import { getCategoryById, updateCategoryById } from "@/api/categories";
import { createToast, createAlert } from "@/lib/sweetalert";
import { useTranslations } from "next-intl";
import EditSkeleton from "@/components/EditSkeleton";

const Page = ({ params }) => {
    const router = useRouter();
    const t = useTranslations("products");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const Toast = createToast();
    const Alert = createAlert();

    const { id, locale } = params;

    // Load category data
    useEffect(() => {
        if (!id) return;
        getCategoryById(id)
            .then((data) => {
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    image: "",
                });
                if (data.image) setImagePreview(data.image);
            })
            .catch((error) => {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("categories.edit.alerts.loadError"),
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Image preview
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
                    if (typeof value === "string" || value === null) {
                        data.append("image", "");
                    } else {
                        data.append("image", value);
                    }
                } else {
                    data.append(key, value ?? "");
                }
            });

            await updateCategoryById(id, data);

            Toast.fire({
                icon: "success",
                title: t("categories.edit.alerts.updateSuccess"),
            });

            router.push(`/${locale}/products/category`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({
                    icon: "error",
                    title: t("categories.edit.alerts.fieldErrors"),
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("categories.edit.alerts.updateError"),
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: "name", type: "text" },
        { id: "description", type: "text" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb
                title={t("categories.editCategory")}
                listItems={[t("product_edit.title"), t("categories.breadcrumb"), t("categories.editCategory")]}
            />

            <div className="main_section">

                {
                    loading ? (
                        <EditSkeleton/>
                    ) : (
                        <>
                            <form
                                id="editCategoryForm"
                                onSubmit={handleSubmit}
                                className="w-full flex flex-col lg:flex-row gap-6"
                                encType="multipart/form-data"
                                style={{
                                    opacity: submitLoading ? 0.6 : 1,
                                    pointerEvents: submitLoading ? "none" : "auto",
                                }}
                            >
                                {/* Left: Fields */}
                                <div className="form-container lg:grid-cols-1 lg:w-[70%] w-full">
                                    {fields.map(({ id, type }) => (
                                        <div className="w-full mb-5" key={id}>
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
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors[id][0]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
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
                                    form="editCategoryForm"
                                    disabled={submitLoading}
                                    className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    {submitLoading ? t("categories.edit.editCategory") : t("categories.edit.updateButton")}
                                </button>
                            </div>
                        </>
                    )
                }
            </div>
        </section >
    );
};

export default Page;
