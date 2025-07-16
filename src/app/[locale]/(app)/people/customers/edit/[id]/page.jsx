'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
import { getCustomerById, updateCustomerById } from "@/api/customers";
import { createToast, createAlert } from "@/lib/sweetalert";
import { useTranslations } from "next-intl";

const Page = ({ params }) => {
    const { id, locale } = params;
    const router = useRouter();
    const t = useTranslations("customers");

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        country: '',
        city: '',
        address: '',
        zip_code: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const Toast = createToast();
    const Alert = createAlert();

    useEffect(() => {
        if (!id) return;
        getCustomerById(id)
            .then((data) => {
                setFormData({
                    ...data,
                    phone: data.phone?.phone_number || '',
                });
            })
            .catch((error) => {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("page.loadError"),
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitLoading(true);

        try {
            await updateCustomerById(id, formData);
            Toast.fire({
                icon: "success",
                title: t("page.updateSuccess"),
            });
            router.push(`/${locale}/people/customers`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({
                    icon: "error",
                    title: t("page.fieldErrors"),
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: "error",
                    title: t("page.updateError"),
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: "name", type: "text" },
        { id: "phone", type: "text" },
        { id: "email", type: "email" },
        { id: "country", type: "text" },
        { id: "city", type: "text" },
        { id: "address", type: "text" },
        { id: "zip_code", type: "text" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title={t("page.title")} listItems={t.raw("page.breadcrumb")} />
            <div className="main_section">
                {loading ? (
                    <div className="w-full p-8 relative">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <form
                            id="editCustomerForm"
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col lg:flex-row gap-6"
                            style={{
                                opacity: submitLoading ? 0.6 : 1,
                                pointerEvents: submitLoading ? "none" : "auto",
                            }}
                        >
                            {/* Fields */}
                            <div className="form-container w-full">
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
                            </div>
                        </form>

                        <div className="w-full flex justify-end mt-8">
                            <button
                                type="submit"
                                form="editCustomerForm"
                                disabled={submitLoading}
                                className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${
                                    submitLoading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                            >
                                {submitLoading ? t("page.saveButton") : t("page.createButton")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Page;