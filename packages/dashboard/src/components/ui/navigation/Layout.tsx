import style from './Layout.module.scss'

import SideBarNavigation from "./sideBar"

interface LayoutInterface {
    children: JSX.Element
}

const Layout = ({children}:LayoutInterface)=>{
    return (
    <div className={style.Layout}>
        <SideBarNavigation/>
        <div className={style['children']}>
        {children}
        </div>
    </div>)
}


export default Layout