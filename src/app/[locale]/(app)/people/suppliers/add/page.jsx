'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Breadcrumb from "@/components/Breadcrumb";

import { createSupplier } from "@/api/suppliers";
import { createToast, createAlert } from "@/lib/sweetalert";

const Page = ({ params }) => {
    const router = useRouter();
    const t = useTranslations("suppliers.add");
    const tSuppliers = useTranslations("suppliers");

    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();

    const [submitLoading, setSubmitLoading] = useState(false);
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
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) data.append(key, value);
            });

            await createSupplier(data);
            Toast.fire({
                icon: 'success',
                title: t('alerts.create_success')
            });
            router.push(`/${locale}/people/suppliers`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({
                    icon: 'error',
                    title: t('alerts.field_errors')
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: 'error',
                    title: t('alerts.create_error')
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: 'name', type: 'text' },
        { id: 'phone', type: 'number' },
        { id: 'email', type: 'email' },
        { id: 'country', type: 'text' },
        { id: 'city', type: 'text' },
        { id: 'address', type: 'text' },
        { id: 'zip_code', type: 'text' },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title={t('addSupplier')} listItems={[tSuppliers('title'), t('addSupplier')]} />

            <div className="main_section">
                <form
                    id="addSupplierForm"
                    onSubmit={handleSubmit}
                    className="form-container w-full mx-auto"
                    style={{ opacity: submitLoading ? 0.6 : 1, pointerEvents: submitLoading ? "none" : "auto" }}
                >
                    {fields.map(({ id, type }) => (
                        <div className="mb-5" key={id}>
                            <label className="form-label" htmlFor={id}>
                                {tSuppliers(`fields.${id}.label`)}
                            </label>
                            <input
                                id={id}
                                type={type}
                                value={formData[id]}
                                onChange={handleChange}
                                className={`form-input ${errors[id] ? '!border-red-500' : ''}`}
                            />
                            {errors[id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                            )}
                        </div>
                    ))}

                </form>
                <div className="w-full flex justify-end mt-8">
                    <button
                        form="addSupplierForm"
                        type="submit"
                        disabled={submitLoading}
                        className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] transition-all duration-200 hover:bg-[var(--green-color)] ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {submitLoading ? t('saveButton') : t('createButton')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Page;
