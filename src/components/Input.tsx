import { ComponentPropsWithRef } from "react";


type InputProps = {
    label: string,
    name: string,
    error?: string
} & ComponentPropsWithRef<'input'>

const Input = ({ label, name, error, ...props }: InputProps) => {
    return (
        <p className="control">
            <label htmlFor={name}>
                {label}&nbsp;{error && <span className="text-xs text-red-600">({error})</span>}
            </label>
            <input name={name} {...props} >
            </input>
        </p>
    )
}

export default Input;