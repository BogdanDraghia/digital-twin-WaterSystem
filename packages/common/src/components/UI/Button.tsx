import React from 'react'

import style from './test.module.scss'

interface ButtonPropsInterface {
    name?: string;
    onClick:React.MouseEventHandler<HTMLButtonElement>
  }
const Button = (props:ButtonPropsInterface)=>{
    return (
        <>
        <div  className={style.button}>
            ok
        </div>
                <button onClick={props.onClick}>
            {props.name}
        </button>
        </>

    )
}

export default Button