import Image from "next/image"

const ApplicationLogo = props => (
    <Image width={100} height={100} src="/warehouse.png"  alt={"warehouse"} {...props}/>
)

export default ApplicationLogo
