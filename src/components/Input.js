const Input = ({ disabled = false, className, ...props }) => (
    <input
        disabled={disabled}
        className={`${className} rounded-md shadow-sm outline-none focus:outline-none border-gray-300 focus:ring-0 focus:border-gray-300`}
        {...props}
    />
)

export default Input
