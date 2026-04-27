import { ComponentPropsWithRef, forwardRef } from "react";


type InputProps = {
    label: string,
    name: string,
    error?: string
} & ComponentPropsWithRef<'input'>

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, name, error, className, ...props }: InputProps, ref) => {
    return (
        <p className={`text-gray-600 flex flex-col ${className}`}>
            <label htmlFor={name} className="p-1">
                {label}&nbsp;{error && <span className=" text-xs text-red-600">({error})</span>}
            </label>
            <input name={name} ref={ref} {...props} className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl " >
            </input>
        </p>
    )
})

export default Input;