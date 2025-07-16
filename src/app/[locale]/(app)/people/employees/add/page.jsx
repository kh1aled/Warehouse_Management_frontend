'use client';
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/api/employees";
import Image from "next/image";
import drag from "@/assets/drag.png";

const Page = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        hire_date: '',
        role: '',
        status: 'active',
        phone: '',
        address: '',
        salary: '',
        photo: null,
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            photo: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value ?? "");
            });

            await createEmployee(data);

            alert("تم إضافة الموظف بنجاح");
            router.push(`/people/employees`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                alert("حدثت أخطاء في الحقول");
            } else {
                console.error(error);
                alert("حدث خطأ أثناء إضافة الموظف");
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // تحديث المعاينة
    useEffect(() => {
        if (formData.photo && typeof formData.photo !== 'string') {
            const previewUrl = URL.createObjectURL(formData.photo);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.photo]);

    const fields = [
        { id: "name", label: "Name", type: "text" , placeholder: "" },
        { id: "username", label: "Username", type: "text" , placeholder: ""},
        { id: "email", label: "Email", type: "email" , placeholder: ""},
        { id: "password", label: "Password", type: "password" , placeholder: ""},
        { id: "role", label: "Role", type: "text" , placeholder: ""},
        { id: "hire_date", label: "Hire_date", type: "date" , placeholder: "YYYY-MM-DD"},
        { id: "phone", label: "Phone", type: "text" , placeholder: ""},
        { id: "address", label: "Address", type: "text" , placeholder: "" },
        { id: "salary", label: "Salary", type: "number" , placeholder: "" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title="Add Employee" listItems={["employees", "add employee"]} />
            <div className="main_section">
                <form onSubmit={handleSubmit} className="w-full flex justify-center items-start gap-2" encType="multipart/form-data">
                    {/* Form Inputs */}
                    <div className="form-container w-[70%]">
                        {fields.map(({ id, label, type , placeholder }) => (
                            <div className="form-field mb-4" key={id}>
                                <label className="form-label" htmlFor={id}>{label}</label>
                                <input
                                    id={id}
                                    type={type}
                                    value={formData[id]}
                                    onChange={handleChange}
                                    className="form-input w-full border p-2 rounded"
                                    placeholder={placeholder}
                                />
                                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>}
                            </div>
                        ))}

                        <div className="form-field">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-input w-full border p-2 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
                        </div>

                        <div className="form-field flex justify-end">
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`main_btn bg-[var(--green-color)] text-white hover:bg-[var(--main-color)] duration-150 ${submitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {submitLoading ? "Saving..." : "Create Employee"}
                            </button>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="product_image relative w-[30%] max-h-[600px] min-h-[400px]">
                        <input
                            id="ImageContent"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="ImageContent" className="product-image-upload-inner cursor-pointer">
                            <div className="flex flex-col items-center gap-5">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mt-2 max-h-[180px] object-contain rounded" />
                                ) : (
                                    <Image src={drag} alt="drag-drop-icon" />
                                )}
                                <h4>Drop employee image here</h4>
                                <h4>Or</h4>
                                <button
                                    type="button"
                                    className="rounded_btn"
                                    onClick={() => document.getElementById("ImageContent")?.click()}
                                >
                                    Browse File
                                </button>
                                <span>Allowed JPEG, JPG & PNG format | Max 2MB</span>
                            </div>
                        </label>
                        {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo[0]}</p>}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Page;
