'use client';
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import drag from "@/assets/drag.png";
import { useEffect, useState } from "react";
import { getBrandById, updateBrandById } from "@/api/brands";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    image: null,
    country: "",
    description: "",
    status: "active",
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const { id, lang } = params;

  useEffect(() => {
    if (formData.image && typeof formData.image !== "string") {
      const previewUrl = URL.createObjectURL(formData.image);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [formData.image]);

  useEffect(() => {
    if (!id) return;
    getBrandById(id)
      .then((data) => {
        setFormData(data);
        if (data.image) setImagePreview(data.image);
      })
      .catch((error) => console.error("Error loading brand:", error));
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

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

      await updateBrandById(id, data);
      alert("✅ تم تعديل البراند بنجاح");
      router.push(`/products/brand`);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        alert("⚠️ حدثت أخطاء في الحقول");
      } else {
        console.error(error);
        alert("❌ حدث خطأ أثناء تعديل البراند");
      }
    }
  };

  const fields = [
    { id: "name", label: "Brand Name", type: "text" },
    { id: "code", label: "Code", type: "text" },
    { id: "country", label: "Country", type: "text" },
    { id: "description", label: "Description", type: "text" },
    { id: "website", label: "Website", type: "text" },
  ];

  return (
    <section className="custom-section">
      <Breadcrumb title="Edit Brand" listItems={["brands", "edit brand"]} />
      <div className="main_section">
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center items-start gap-2"
          encType="multipart/form-data"
        >
          {/* Form Inputs */}
          <div className="form-container-category w-[70%]">
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
                {errors[id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[id][0]}</p>
                )}
              </div>
            ))}

            {/* Status */}
            <div className="form-field">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
              )}
            </div>

            <div className="form-field flex justify-end">
              <button
                type="submit"
                className="main_btn bg-[var(--green-color)] text-white hover:bg-[var(--main-color)] duration-150 w-[17rem]"
              >
                Update Brand
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
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 max-h-[100px] object-contain rounded"
                  />
                ) : (
                  <Image src={drag} alt="drag-drop-icon" />
                )}
                <h4>Drop brand logo here</h4>
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
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
