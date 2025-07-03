const AuthCard = ({ logo, children }) => (
    <div className="h-screen w-full bg-gray-100 text-center flex flex-col sm:justify-center items-center pt-6 sm:pt-0">

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl mt-6 px-8 py-20 bg-white shadow-md overflow-hidden sm:rounded-lg flex flex-col items-center gap-4">
            <div>{logo}</div>
            {children}
        </div>
    </div>
)

export default AuthCard
