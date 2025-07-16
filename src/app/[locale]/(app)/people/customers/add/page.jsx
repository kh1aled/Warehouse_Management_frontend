'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/Breadcrumb";
import { createCustomer } from "@/api/customers"; // لازم تكون عامل ده

const Page = () => {
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
    const router = useRouter();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) data.append(key, value);
            });


            await createCustomer(data);
            alert("تم الحفظ بنجاح");
            router.back();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
                alert("حدث خطأ أثناء الحفظ");
            }
        }
    };

    useEffect(() => {
        console.log(errors);

    }, [errors])


    useEffect(() => {
        console.log(formData);

    }, [formData])


    return (
        <section className="custom-section">
            <Breadcrumb title="Add Customer" listItems={["Customer", "Add Customer"]} />
            <div className="main_section">
                <form onSubmit={handleSubmit} className="form-container w-full  mx-auto">
                    {[
                        { id: 'name', label: 'Customer Name' },
                        { id: 'phone', label: 'Phone', type: "number" },
                        { id: 'email', label: 'Email', type: 'email' },
                        { id: 'country', label: 'Country' },
                        { id: 'city', label: 'City' },
                        { id: 'address', label: 'Address' },
                        { id: 'zip_code', label: 'Zip Code' },
                    ].map(({ id, label, type = 'text' }) => (
                        <div key={id} className="form-field mb-4">
                            <label htmlFor={id} className="form-label block mb-1 font-semibold">{label}</label>
                            <input
                                id={id}
                                type={type}
                                value={formData[id]}
                                onChange={handleChange}
                                className="form-input w-full border p-2 rounded"
                            />
                            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>}
                        </div>
                    ))}

                    <div className="form-field flex justify-end">
                        <button type="submit" className="main_btn bg-[var(--green-color)] text-white hover:bg-[var(--main-color)] duration-150">
                            Create Customer
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Page;
