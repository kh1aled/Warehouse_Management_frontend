"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { createUser } from "@/api/users";
import { getRoles } from "@/api/roles";
import { useTranslations } from "next-intl";
import { createToast, createAlert } from "@/lib/sweetalert";
import EditSkeleton from "@/components/EditSkeleton";
import drag from "@/assets/drag.png";
import Image from "next/image";

const Page = ({ params }) => {
    const router = useRouter();
    const tUsers = useTranslations("users");
    const t = useTranslations("users.add");

    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        address: "",
        role_id: "",
        phone: "",
        password: "",
        password_confirmation: "",
        image: null,

    });
    const [imagePreview, setImagePreview] = useState(null);


    // Generate image preview when file selected
    useEffect(() => {
        if (formData.image) {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [rolesLoading, setRolesLoading] = useState(false);
    const Toast = createToast();
    const Alert = createAlert();
    const { locale } = params;

    useEffect(() => {
        setRolesLoading(true);
        getRoles()
            .then(setRoles)
            .catch((error) => {
                console.error("Error fetching roles:", error);
                Alert.fire({ icon: "error", title: t("alerts.roles_error") });
            })
            .finally(() => setRolesLoading(false));
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log("Value", value);

        setFormData((prev) => ({ ...prev, [id]: value }));
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

            await createUser(data);
            Toast.fire({ icon: "success", title: t("alerts.create_success") });
            setFormData({
                name: "",
                username: "",
                email: "",
                address: "",
                role_id: "",
                phone: "",
                password: "",
                password_confirmation: "",
            });
            router.push(`/${locale}/users`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({ icon: "error", title: t("alerts.field_errors") });
            } else {
                console.error(error);
                Alert.fire({ icon: "error", title: t("alerts.create_error") });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };


    const fields = [
        { id: "name", type: "text" },
        { id: "username", type: "text" },
        { id: "email", type: "email" },
        { id: "phone", type: "text" },
        { id: "address", type: "text" },
        { id: "password", type: "password" },
        { id: "password_confirmation", type: "password" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title={t("addUser")} listItems={[tUsers("users"), t("addUser")]} />

            <div className="main_section">
                {rolesLoading ? (
                    <div className="w-full p-8 relative">
                        <EditSkeleton />
                    </div>
                ) : (
                    <form
                        id="addUserForm"
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col lg:flex-row gap-6"
                        style={{
                            opacity: submitLoading ? 0.6 : 1,
                            pointerEvents: submitLoading ? "none" : "auto",
                        }}
                    >
                        {/** Left: Inputs Form */}
                        <div className="form-container lg:w-[70%] w-full">
                            {fields.map(({ id, type }) => (
                                <div className="mb-5" key={id}>
                                    <label className="form-label" htmlFor={id}>
                                        {tUsers(`fields.${id}.label`)}
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

                            {/* Role */}
                            <div className="mb-5">
                                <label className="form-label" htmlFor="role_id">
                                    {tUsers("fields.role.label")}
                                </label>
                                <select
                                    id="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">{tUsers("fields.role.label")}</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role_id[0]}</p>
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
                                            alt={t('image_upload.alt')}
                                            className="product-image-preview"
                                        />
                                    ) : (
                                        <Image src={drag} alt={t('image_upload.placeholderAlt')} className="h-16 w-16" />
                                    )}
                                    <p className="text-sm text-gray-400">
                                        {t('image_upload.dropText')}
                                    </p>
                                    <span className="px-4 py-1 bg-[var(--green-color)] text-white rounded hover:bg-[var(--main-color)] transition">
                                        {t('image_upload.browseButton')}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {t('image_upload.note')}
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
                {!rolesLoading && (
                    <div className="w-full flex justify-end mt-8">
                        <button
                            type="submit"
                            form="addUserForm"
                            disabled={submitLoading}
                            className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)]  transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {submitLoading ? t("saveButton") : t("createButton")}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Page;