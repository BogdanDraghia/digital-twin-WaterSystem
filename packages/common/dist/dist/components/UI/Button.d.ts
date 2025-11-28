import React from 'react';
interface ButtonPropsInterface {
    name?: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}
declare const Button: (props: ButtonPropsInterface) => JSX.Element;
export default Button;
