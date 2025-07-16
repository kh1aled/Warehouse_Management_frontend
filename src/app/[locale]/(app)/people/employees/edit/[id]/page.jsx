'use client';
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeById, updateEmployeeById } from "@/api/employees";
import Loader from "@/components/Loader";
import Image from "next/image";
import drag from "@/assets/drag.png";

const Page = ({ params }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        role: '',
        status: '',
        phone: '',
        address: '',
        salary: '',
        photo: null,
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        if (!id) return;

        getEmployeeById(id)
            .then((data) => {
                setFormData({
                    ...data,
                    phone: data.phone?.phone_number || '',
                    photo: null,
                });
                if (data.photo) {
                    setImagePreview(`/storage/${data.photo}`);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (formData.image && typeof formData.image !== 'string') {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            photo: file,
        }));
    };

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

            await updateEmployeeById(id, data);

            alert("تم تعديل بيانات الموظف بنجاح");
            router.push(`/people/employees`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                alert("حدثت أخطاء في الحقول");
            } else {
                console.error(error);
                alert("حدث خطأ أثناء تعديل البيانات");
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const fields = [
        { id: "name", label: "Name", type: "text" },
        { id: "username", label: "Username", type: "text" },
        { id: "email", label: "Email", type: "email" },
        { id: "role", label: "Role", type: "text" },
        { id: "status", label: "Status", type: "text" },
        { id: "phone", label: "Phone", type: "text" },
        { id: "address", label: "Address", type: "text" },
        { id: "salary", label: "Salary", type: "number" },
    ];

    return (
        <section className="custom-section">
            <Breadcrumb title="Edit Employee" listItems={["employees", "edit employee"]} />
            <div className="main_section">
                {loading ? (
                    <div className="w-full h-full py-12 relative">
                        <Loader />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full flex justify-center items-start gap-2" encType="multipart/form-data">
                        {/* Form Inputs */}
                        <div className="form-container w-[70%]">
                            {fields.map(({ id, label, type }) => (
                                <div className="form-field" key={id}>
                                    <label className="form-label" htmlFor={id}>{label}</label>
                                    <input
                                        id={id}
                                        type={type}
                                        value={formData[id]}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>}
                                </div>
                            ))}

                            <div className="form-field flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className={`main_btn bg-[var(--green-color)] text-white hover:bg-[var(--main-color)] duration-150 ${submitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {submitLoading ? "Updating..." : "Update Employee"}
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
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>}
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Page;
