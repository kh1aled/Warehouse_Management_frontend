'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Breadcrumb from "@/components/Breadcrumb";
import { createCustomer } from "@/api/customers";
import { createToast, createAlert } from "@/lib/sweetalert";

const Page = ({params}) => {
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
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();
    const { locale } = params;


    const t = useTranslations("customers");
    const tPage = useTranslations("customers.page");
    const tAdd = useTranslations("customers.add");
    const tFields = useTranslations("customers.fields");
    const tAlerts = useTranslations("customers.alerts");

    const Toast = createToast();
    const Alert = createAlert();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
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

            await createCustomer(data);

            Toast.fire({
                icon: 'success',
                title: tAdd('createSuccess')
            });

            router.push(`/${locale}/people/customers`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);

                Alert.fire({
                    icon: 'error',
                    title: tPage('fieldErrors')
                });
            } else {
                console.error(error);
                Alert.fire({
                    icon: 'error',
                    title: tAdd('createError')
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <section className="custom-section">
            <Breadcrumb title={t("add_customer")} listItems={[t("customers_list"), t("add_customer")]} />
            <div className="main_section">
                <form onSubmit={handleSubmit} id="customer_add_form" className="form-container w-full mx-auto">
                    {[
                        { id: 'name' },
                        { id: 'phone', type: 'number' },
                        { id: 'email', type: 'email' },
                        { id: 'country' },
                        { id: 'city' },
                        { id: 'address' },
                        { id: 'zip_code' },
                    ].map(({ id, type = 'text' }) => (
                        <div key={id} className="form-field mb-4">
                            <label htmlFor={id} className="form-label block mb-1 font-semibold">
                                {tFields(`${id}.label`)}
                            </label>
                            <input
                                id={id}
                                type={type}
                                value={formData[id]}
                                onChange={handleChange}
                                className="form-input w-full border p-2 rounded"
                            />
                            {errors[id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                            )}
                        </div>
                    ))}
                </form>

                {/* زرار الحفظ */}
                <div className="w-full flex justify-end mt-8">
                    <button
                        type="submit"
                        form="customer_add_form"
                        disabled={submitLoading}
                        className={`text-white font-medium px-9 py-3 rounded-md shadow-lg bg-[var(--main-color)] hover:bg-[var(--green-color)] transition-all duration-200 ${submitLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {submitLoading ? tAdd('saveButton') : tAdd('createButton')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Page;
