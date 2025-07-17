'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Breadcrumb from "@/components/Breadcrumb";
import { createEmployee } from "@/api/employees";
import drag from "@/assets/drag.png";
import { useTranslations } from "next-intl";
import { createToast, createAlert } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const { locale } = params;
    const tEmployees = useTranslations("employees");

    const router = useRouter();
    const Toast = createToast();
    const Alert = createAlert();

    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        hire_date: "",
        role: "",
        status: "active",
        phone: "",
        address: "",
        salary: "",
        photo: null,
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!formData.photo) return;

        const previewUrl = URL.createObjectURL(formData.photo);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [formData.photo]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, photo: file }));
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

            await createEmployee(data);
            Toast.fire({ icon: "success", title: tEmployees("alerts.create_success") });

            setImagePreview(null);
            setFormData({
                name: "",
                username: "",
                email: "",
                password: "",
                hire_date: "",
                role: "",
                status: "active",
                phone: "",
                address: "",
                salary: "",
                photo: null,
            });

            router.push(`/${locale}/people/employees`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({ icon: "error", title: tEmployees("alerts.field_errors") });
            } else {
                Alert.fire({ icon: "error", title: tEmployees("alerts.create_error") });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fieldConfigs = {
        name: { type: "text" },
        username: { type: "text" },
        email: { type: "email" },
        password: { type: "password" },
        hire_date: { type: "date" },
        role: { type: "text" },
        phone: { type: "text" },
        address: { type: "text" },
        salary: { type: "number" }
    };

    return (
        <section className="custom-section">
            <Breadcrumb
                title={tEmployees("add.title")}
                listItems={[tEmployees("title"), tEmployees("add.title")]}
            />

            <div className="main_section">
                <form
                    id="addEmployeeForm"
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col lg:flex-row gap-6"
                    encType="multipart/form-data"
                    style={{
                        opacity: submitLoading ? 0.6 : 1,
                        pointerEvents: submitLoading ? "none" : "auto",
                    }}
                >
                    {/* Left side form */}
                    <div className="form-container lg:w-[70%] w-full">
                        {Object.entries(fieldConfigs).map(([field, config]) => (
                            <div className="mb-5" key={field}>
                                <label htmlFor={field} className="form-label">
                                    {tEmployees(`fields.${field}.label`)}
                                </label>
                                <input
                                    id={field}
                                    type={config.type}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className={`form-input ${errors[field] ? "!border-red-500" : ""}`}
                                />
                                {Array.isArray(errors[field])
                                    ? errors[field].map((msg, idx) => (
                                        <p key={idx} className="text-red-500 text-sm mt-1">{msg}</p>
                                    ))
                                    : errors[field] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                                    )
                                }
                            </div>
                        ))}

                        {/* Status */}
                        <div className="mb-5">
                            <label className="form-label" htmlFor="status">
                                {tEmployees("fields.status.label")}
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="active">{tEmployees("fields.status.options.active")}</option>
                                <option value="inactive">{tEmployees("fields.status.options.inactive")}</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Right side image upload */}
                    <div className="w-full lg:w-[30%] order-first lg:order-none">
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
                                        alt={tEmployees("image_upload.alt")}
                                        className="product-image-preview"
                                    />
                                ) : (
                                    <Image
                                        src={drag}
                                        alt={tEmployees("image_upload.placeholderAlt")}
                                        className="h-16 w-16"
                                    />
                                )}
                                <p className="text-sm text-gray-400">
                                    {tEmployees("image_upload.dropText")}
                                </p>
                                <span className="px-4 py-1 bg-[var(--green-color)] text-white rounded hover:bg-[var(--main-color)] transition">
                                    {tEmployees("image_upload.browseButton")}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {tEmployees("image_upload.note")}
                                </span>
                            </div>
                        </label>
                        {errors.photo && (
                            <p className="text-red-500 text-sm mt-1">{errors.photo[0]}</p>
                        )}
                    </div>
                </form>

                {/* Submit Button */}
                <div className="w-full flex justify-end mt-8">
                    <button
                        type="submit"
                        form="addEmployeeForm"
                        disabled={submitLoading}
                        className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                    >
                        {submitLoading
                            ? tEmployees("saveButton")
                            : tEmployees("add.submit")}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Page;
