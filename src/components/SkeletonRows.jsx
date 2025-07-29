import React from 'react'

const SkeletonRows = () => {
    return (
        <div className="space-y-2 w-full p-4 ">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-full h-6 bg-gray-300 dark:bg-gray-800 rounded animate-pulse"
                ></div>
            ))}
        </div>
    )
}

export default SkeletonRows