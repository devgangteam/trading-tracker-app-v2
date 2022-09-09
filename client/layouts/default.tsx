import { ReactElement } from "react"
import { HeaderMiddle } from "../components/navbar"

type AdminLayoutProps = {
    children: ReactElement
}

const routes = [
    {
        link: '/',
        label: 'Home'
    },
    {
        link: 'admin',
        label: 'Admin'
    }
]

export default function AdminLayout({children}: AdminLayoutProps) {
    return (
        <>
            <HeaderMiddle links={routes} />
            <main>{children}</main>
        </>
    )
}