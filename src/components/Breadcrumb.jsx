import React from 'react'

const Breadcrumb = ({ title, listItems }) => {
    return (
        <div className="breadcrumb-area w-full px-7 py-9 bg-white mb-5 shadow-2xl rounded-lg">
            <div className="px-2">

                <h5 className="text-[20px] text-heading font-bold mb-3">{title}</h5>
                <div className="breadcrumb-area-inner-wrap">
                    {
                        listItems && listItems.length > 0 ? (
                            listItems.map((item, index) => (
                                <span key={index} className="breadcrumb-span text-body capitalize">
                                    {item}
                                    {index < listItems.length - 1 && <span className="mx-1">&gt;</span>}
                                </span>
                            ))
                        ) : null
                    }
                    </div>
            </div>

        </div>
    )
}

export default Breadcrumb