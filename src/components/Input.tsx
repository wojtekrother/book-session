import { ComponentPropsWithRef } from "react";


type InputProps = {
    label: string,
    name: string,
} & ComponentPropsWithRef<'input'>

const Input  = ({label, name, ...props}: InputProps) => {
    return (
        <p className="control">
            <label htmlFor={name}>
                {label}
            </label>
            <input name={name} {...props} >
            </input>
        </p>
    )
}

export default Input;