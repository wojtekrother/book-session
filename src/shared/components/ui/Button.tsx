import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ComponentPropsWithoutRef  } from "react";
import { NavLink } from "react-router-dom";




type ButtonProps = {
    href?: undefined,
    textonly?: boolean
}
    & ComponentPropsWithoutRef<"button"> |
    {
        href: string
    }
    & ComponentPropsWithoutRef<"a">

const Button = ({ className, children, ...props }: ButtonProps) => {

    if (props.href !== undefined) {
        return <NavLink  className={({ isActive }) => twMerge(` 
            py-1.5 px-1.5 
             hover:text-gray-500 hover:underline text-black ${isActive ? "underline" : ""}  ${className ?? ""} `)}
             to={props.href} {...props}>{children}</NavLink>
    }

    
    return (
        <button className={twMerge(clsx("rounded-xl py-1.5", {
            "px-1.5 border-black/5  border rounded-4xl bg-black/1 hover:text-gray-500 hover:bg-black/10 cursor-pointer ": props.textonly,
            "px-4 bg-blue-300 active:hover:bg-blue-400 disabled:bg-gray-200 disabled:text-gray-300": !props.textonly
        }),className)} {...props}>{children}</button>
    )
}



export default Button;