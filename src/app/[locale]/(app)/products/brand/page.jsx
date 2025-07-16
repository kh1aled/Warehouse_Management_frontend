"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import drag from "@/assets/drag.png";
import { useEffect, useState } from "react";
import { createBrand, deleteBrandById, getBrands } from "@/api/brands";
import DropdownLink, { DropdownButton } from "@/components/DropdownLink";
import Dropdown from "@/components/Dropdown";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createToast, createAlert, createConfirm } from "@/lib/sweetalert";
import AnimateImage from "@/components/AnimateImage";
import Loader from "@/components/Loader";

const Page = ({ params }) => {
    const t = useTranslations("products");
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        country: "",
        description: "",
        status: "active",
        website: "",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = usePathname();
    const { locale } = params;

    const Toast = createToast();
    const Alert = createAlert();
    const Confirm = createConfirm();

    useEffect(() => {
        if (formData.image) {
            const previewUrl = URL.createObjectURL(formData.image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [formData.image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });
            await createBrand(data);
            Alert.fire({ icon: "success", title: t("brands.successAdd") });
            setFormData({
                name: "",
                code: "",
                country: "",
                description: "",
                status: "active",
                website: "",
                image: null,
            });
            setImagePreview(null);
            fetchBrands();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                Alert.fire({ icon: "error", title: t("brands.errorFields") });
            } else {
                console.error(error);
                Alert.fire({ icon: "error", title: t("brands.errorAdd") });
            }
        }
    };

    const fetchBrands = () => {
        getBrands()
            .then(setBrands)
            .catch((error) => console.error("Fetch brands error:", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id) => {
        const result = await Confirm.fire({
            icon: "warning",
            title: t("brands.confirmDelete"),
            confirmButtonText: t("delete"),
            cancelButtonText: t("cancel"),
        });
        if (!result) return;
        try {
            await deleteBrandById(id);
            fetchBrands();
            Toast.fire({ icon: "success", title: t("brands.deleteSuccess") });
        } catch (error) {
            console.error(error);
            Alert.fire({ icon: "error", title: t("brands.deleteError") });
        }
    };

    return (
        <section className="custom-section">
            <Breadcrumb
                title={t("brands.breadcrumbTitle")}
                listItems={[t("title"), t("brands.breadcrumbTitle")]}
            />

            <div className="basic_section mb-5 shadow-2xl rounded-lg space-y-5 grid grid-cols-12 gap-x-7 sm:gap-x-5">
                {/* Form */}
                <div className="col-span-12 lg:col-span-3">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {["name", "code", "country", "description", "website"].map((field) => (
                            <div className="form-field" key={field}>
                                <label className="form-label" htmlFor={field}>
                                    {t(`brands.fields.${field}.label`)}
                                </label>
                                <input
                                    className={`form-input ${errors[field] ? "!border-red-500" : ""}`}
                                    id={field}
                                    type="text"
                                    value={formData[field]}
                                    placeholder={t(`brands.fields.${field}.placeholder`)}
                                    onChange={handleChange}
                                />
                                {errors[field] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field][0]}</p>
                                )}
                            </div>
                        ))}

                        <div className="form-field">
                            <label className="form-label" htmlFor="status">
                                {t("brands.fields.status.label")}
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="active">{t("brands.fields.status.active")}</option>
                                <option value="inactive">{t("brands.fields.status.inactive")}</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                            )}
                        </div>

                        <div className="product_image relative max-h-[600px] min-h-[400px]">
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
                                        <img
                                            src={imagePreview}
                                            alt={t("brands.imageUpload.previewAlt")}
                                            className="mt-2 max-h-[100px] object-contain rounded"
                                        />
                                    ) : (
                                        <Image src={drag} alt={t("brands.imageUpload.iconAlt")} />
                                    )}
                                    <h4>{t("brands.imageUpload.dropText")}</h4>
                                    <h4>{t("brands.imageUpload.or")}</h4>
                                    <button
                                        type="button"
                                        className="rounded_btn"
                                        onClick={() => document.getElementById("ImageContent")?.click()}
                                    >
                                        {t("brands.imageUpload.browseButton")}
                                    </button>
                                    <span>{t("brands.imageUpload.note")}</span>
                                </div>
                            </label>
                        </div>

                        <div className="form-field">
                            <button type="submit" className="rounded_btn">
                                {t("brands.createButton")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="w-full mt-4 overflow-x-auto col-span-12 lg:col-span-9">
                    <table className="w-full custome_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("brands.table.image")}</th>
                                <th>{t("brands.table.name")}</th>
                                <th>{t("brands.table.code")}</th>
                                <th>{t("brands.table.country")}</th>
                                <th>{t("brands.table.description")}</th>
                                <th>{t("brands.table.status")}</th>
                                <th>{t("brands.table.website")}</th>
                                <th>{t("brands.table.action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-4">
                                        <div className="w-full p-8 relative">
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-gray-400">
                                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                                        <p>{t("brands.table.noData")}</p>
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <td>{brand.id}</td>
                                        <td>
                                            {brand.image ? (
                                                <AnimateImage
                                                    src={brand.image}
                                                    alt={brand.name}
                                                    width={12}
                                                    height={12}
                                                />
                                            ) : (
                                                <span className="text-gray-400">{t("brands.table.noImage")}</span>
                                            )}
                                        </td>
                                        <td>{brand.name}</td>
                                        <td>{brand.code}</td>
                                        <td>{brand.country}</td>
                                        <td>{brand.description}</td>
                                        <td>{brand.status}</td>
                                        <td>{brand.website}</td>
                                        <td>
                                            <div className="dropdown_container ">
                                                <Dropdown
                                                    align={locale === "ar" ? "left" : "right"}
                                                    width="48"
                                                    trigger={
                                                        <button className="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-white hover:text-gray-700">
                                                            {t("brands.table.action")}
                                                            <svg className="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    }
                                                >
                                                    <DropdownLink href={`${path}/edit/${brand.id}`}>
                                                        {t("brands.editButton")}
                                                    </DropdownLink>
                                                    <DropdownButton onClick={() => handleDelete(brand.id)}>
                                                        {t("brands.deleteButton")}
                                                    </DropdownButton>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Page;
