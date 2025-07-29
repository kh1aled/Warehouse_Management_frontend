'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import EditSkeleton from "@/components/EditSkeleton";
import drag from "@/assets/drag.png";
import { getEmployeeById, updateEmployeeById } from "@/api/employees";
import { createToast, createAlert } from "@/lib/sweetalert";
import { useTranslations } from "next-intl";

const Page = ({ params }) => {
    const router = useRouter();
    const { id, locale } = params;
    const t = useTranslations("employees");

    // Form state
    const [formData, setFormData] = useState({
        photo: null,
        name: '',
        email: '',
        username: '',
        phone: '',
        address: '',
        role: '',
        status: '',
        hire_date: '',
        salary: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const Toast = createToast();
    const Alert = createAlert();

    // Load employee data on mount
    useEffect(() => {
        getEmployeeById(id)
            .then(data => {
                setFormData({
                    name: data.name || '',
                    username: data.username || '',
                    email: data.email || '',
                    password: '',
                    hire_date: data.hire_date || '',
                    role: data.role || '',
                    status: data.status || 'active',
                    phone: data.phone[0]?.phone_number || '',
                    address: data.address || '',
                    salary: data.salary || '',
                });

                if (data.photo) {
                    setImagePreview(`${data.photo}`);
                }
            })
            .catch(err => {
                console.error(err);
                Alert.fire({
                    icon: "error",
                    title: t("edit.alerts.loadError"),
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Generate image preview when a new image is selected
    useEffect(() => {
        if (formData.photo && typeof formData.photo !== "string") {
            const previewUrl = URL.createObjectURL(formData.photo);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.photo]);

    // Handle input changes for text fields
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, photo: file }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const data = new FormData();

            // Append all fields to FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "photo") {
                    if (value && typeof value !== "string") {
                        data.append("photo", value);
                    }
                } else if (key === "password" && !value) {
                    return; // Skip empty passwords
                } else {
                    data.append(key, value ?? '');
                }
            });

            // Submit data to backend
            await updateEmployeeById(id, data);

            Toast.fire({
                icon: "success",
                title: t("alerts.updateSuccess"),
            });

            router.push(`/${locale}/people/employees`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({
                    icon: "error",
                    title: t("alerts.fieldErrors"),
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("alerts.updateError"),
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // Form field configuration
    const fields = [
        { id: "name", type: "text" },
        { id: "username", type: "text" },
        { id: "email", type: "email" },
        { id: "hire_date", type: "date" },
        { id: "password", type: "password" },
        { id: "role", type: "text" },
        { id: "status", type: "text" },
        { id: "phone", type: "text" },
        { id: "address", type: "text" },
        { id: "salary", type: "number" },
    ];

    return (
        <section className="custom-section">
            {/* Breadcrumb navigation */}
            <Breadcrumb title={t("edit.title")} listItems={[t("title"), t("edit.title")]} />

            <div className="main_section">
                {loading ? (
                    <div className="w-full py-12 relative">
                        <EditSkeleton />
                    </div>
                ) : (
                    <>
                        {/* Employee Form */}
                        <form
                            id="editEmployeeForm"
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col lg:flex-row gap-6"
                            encType="multipart/form-data"
                            style={{ opacity: submitLoading ? 0.6 : 1, pointerEvents: submitLoading ? "none" : "auto" }}
                        >
                            {/* Left Side: Fields */}
                            <div className="form-container lg:w-[70%] w-full">
                                {fields.map(({ id, type }) => (
                                    <div key={id} className="form-group">
                                        <label className="mb-2" htmlFor={id}>{t(`fields.${id}.label`)}</label>

                                        {/* Status as select input */}
                                        {id === 'status' ? (
                                            <select
                                                id={id}
                                                value={formData.status}
                                                onChange={handleChange}
                                                className={`form-input ${errors.status ? '!border-red-500' : ''}`}
                                            >
                                                <option value="active">{t('fields.status.options.active')}</option>
                                                <option value="inactive">{t('fields.status.options.inactive')}</option>
                                            </select>
                                        ) : (
                                            <input
                                                id={id}
                                                type={type}
                                                value={formData[id]}
                                                onChange={handleChange}
                                                className={`form-input ${errors[id] ? '!border-red-500' : ''}`}
                                            />
                                        )}

                                        {/* Show validation error */}
                                        {errors[id] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Right Side: Image Upload */}
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
                                                alt={t("add.upload_image")}
                                                className="max-h-[200px] max-w-[200px] object-contain rounded-md"
                                            />
                                        ) : (
                                            <Image src={drag} alt="drag" className="h-16 w-16" />
                                        )}
                                        <p className="text-sm text-gray-400">{t("image_upload.dropText")}</p>
                                        <span className="px-4 py-1 bg-[var(--green-color)] text-white rounded hover:bg-[var(--main-color)] transition">
                                            {t("image_upload.browseButton")}
                                        </span>
                                        <span className="text-xs text-gray-500">{t("image_upload.note")}</span>
                                    </div>
                                </label>

                                {/* Image upload validation error */}
                                {errors.photo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.photo[0]}</p>
                                )}
                            </div>
                        </form>

                        {/* Submit Button */}
                        <div className="w-full flex justify-end mt-8">
                            <button
                                type="submit"
                                form="editEmployeeForm"
                                disabled={submitLoading}
                                className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {submitLoading ? t("edit.saving") : t("edit.submit")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Page;
