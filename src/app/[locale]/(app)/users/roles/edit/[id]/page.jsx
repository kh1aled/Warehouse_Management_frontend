"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { updateRoleById, getRoleById } from "@/api/roles";
import { useTranslations } from "next-intl";
import { createToast, createAlert } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const router = useRouter();
    const tRoles = useTranslations("roles");
    const t = useTranslations("roles.edit");

    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const Toast = createToast();
    const Alert = createAlert();
    const { locale, id } = params;

    useEffect(() => {
        getRoleById(id)
            .then((data) => setFormData({ name: data.name }))
            .catch((error) => {
                console.error("Error fetching role:", error);
                Alert.fire({ icon: "error", title: t("alerts.fetch_error") });
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitLoading(true);

        try {
            await updateRoleById(id, formData);
            Toast.fire({ icon: "success", title: t("alerts.update_success") });
            router.push(`/${locale}/users/roles`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({ icon: "error", title: t("alerts.field_errors") });
            } else {
                console.error(error);
                Alert.fire({ icon: "error", title: t("alerts.update_error") });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <section className="custom-section">
            <Breadcrumb title={t("editRole")} listItems={[tRoles("roles"), t("editRole")]} />

            <div className="main_section">
                <form
                    id="editRoleForm"
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col lg:flex-row gap-6"
                    style={{
                        opacity: submitLoading || loading ? 0.6 : 1,
                        pointerEvents: submitLoading || loading ? "none" : "auto",
                    }}
                >
                    <div className="form-container w-full">
                        <div className="mb-5">
                            <label className="form-label" htmlFor="name">
                                {tRoles("fields.name.label")}
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? "!border-red-500" : ""}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                            )}
                        </div>
                    </div>
                </form>

                <div className="w-full flex justify-end mt-8">
                    <button
                        type="submit"
                        form="editRoleForm"
                        disabled={submitLoading || loading}
                        className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading || loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {submitLoading ? t("saveButton") : t("updateButton")}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Page;
