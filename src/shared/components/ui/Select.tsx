import { ComponentPropsWithRef, forwardRef } from "react";


type selectProps = {
    label: string,
    name: string,
    error?: string
} & ComponentPropsWithRef<'select'>

const Select = forwardRef<HTMLSelectElement, selectProps>(({ label, name, error, className, children, ...props }: selectProps, ref) => {
    return (
        <p className={`text-gray-600 flex flex-col ${className}`}>
            <label htmlFor={name} className="p-1">
                {label}&nbsp;{error && <span className=" text-xs text-red-600">({error})</span>}
            </label>
            <select name={name} ref={ref} {...props} className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl " >
                {children}
            </select>
        </p>
    )
})

export default Select;