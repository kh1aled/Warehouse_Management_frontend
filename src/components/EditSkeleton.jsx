'use client';

const EditSkeleton = () => {
    return (
        <section className="custom-section">
            <div className="main_section animate-pulse">
                <form className="w-full flex flex-col lg:flex-row gap-6">
                    {/* Left Fields */}
                    <div className="lg:w-[70%] w-full">
                        {[...Array(4)].map((_, idx) => (
                            <div className="mb-5" key={idx}>
                                <div className="h-4 w-1/3 bg-gray-300 dark:bg-[#4a4a4a] rounded mb-2"></div>
                                <div className="h-10 w-full bg-gray-300 dark:bg-[#3a3a3a] rounded"></div>
                            </div>
                        ))}

                        {/* Category Dropdown */}
                        <div className="mb-5">
                            <div className="h-4 w-1/3 bg-gray-300 dark:bg-[#4a4a4a] rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-300 dark:bg-[#3a3a3a] rounded"></div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="mb-5">
                            <div className="h-4 w-1/3 bg-gray-300 dark:bg-[#4a4a4a] rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-300 dark:bg-[#3a3a3a] rounded"></div>
                        </div>
                    </div>

                    {/* Right: Image Placeholder */}
                    <div className="w-full lg:w-[30%] h-[320px] border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="w-32 h-32 bg-gray-300 dark:bg-[#4a4a4a] rounded-md" />
                    </div>
                </form>

                {/* Submit Button Placeholder */}
                <div className="w-full flex justify-end mt-8">
                    <div className="w-36 h-10 bg-gray-300 dark:bg-[#4a4a4a] rounded"></div>
                </div>
            </div>
        </section>

    )
}

export default EditSkeleton