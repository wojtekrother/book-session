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
        return <NavLink className={twMerge(` border-gray-100  bg-transparent py-2 px-2" + 
            " hover:text-gray-500 text-black active:underline  ${className ?? ""} `)} to={props.href} {...props}>{children}</NavLink>
    }

    
    return (
        <button className={twMerge(clsx("rounded-xl py-2", {
            "px-2 bg-transparent hover:text-gray-500 cursor-pointer ": props.textonly,
            "px-4 bg-yellow-300 active:hover:bg-yellow-400 disabled:bg-gray-400": !props.textonly
        }),className)} {...props}>{children}</button>
    )
}



export default Button;