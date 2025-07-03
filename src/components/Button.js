const Button = ({ type = 'submit', className, ...props }) => (
    <button
        type={type}
        className={`${className} cursor: pointer inline-flex items-center justify-center px-4 py-4 bg-main-color border-none border-transparent rounded-md font-semibold  text-white uppercase tracking-widest hover:bg-green-color transition-colors  active:bg-green-color focus:outline-none focus:ring-0  disabled:opacity-25  ease-in-out duration-150 text-sm`}
        {...props}
    />
)

export default Button
