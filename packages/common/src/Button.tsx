import React from 'react'

import {ButtonProps} from "./components/UI/Button.types"

const Button = (props:ButtonProps)=>{
    return (
        <div>
            
            {props.name}
        </div>
    )
}

export default Button