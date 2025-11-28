import { useState } from 'react'
import style from './Layout.module.scss'
import { Link } from 'react-router-dom'
const SideBarNavigation = () => {
    const [sideBarOpen,setSideBarOpen]= useState(true)
    const navigationMenu = [
        { title: '3D WaterSystem',link:'/dashboard3d' },
        { title: 'Overview',link:'/dashboard' },
        { title: 'menu3',link:'/dashboard3' }
   ]
   const handleSideBarState = ()=>{
    console.log(sideBarOpen)
        setSideBarOpen(!sideBarOpen)
   }
    return (
        <div 
        className={style.SideBarNavigation} 
        >
            <div className={style['wrap']}>
            {/* <div         onClick={()=>handleSideBarState()} className={style['sidebarControl']}>
            </div> */}
            <div className={style['navigationMenuWrap']}>
            {navigationMenu.map((data,index)=>{
                return (
                    <Link to={data.link}>
                    {data.title}     
                </Link>)
            })}
            </div>
            </div>
        </div>
    )
}

export default SideBarNavigation