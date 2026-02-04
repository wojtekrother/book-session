import clsx from "clsx";
import { Children, ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";




type ButtonProps = {
    href?: undefined,
    textOnly?: boolean
}
    & ComponentPropsWithoutRef<"button"> |
    {
        href: string
    }
    & ComponentPropsWithoutRef<"a">

const Button = ({ children, ...props }: ButtonProps) => {

    if (props.href !== undefined) {
        return <NavLink className={" border-gray-100  bg-transparent py-2 px-2" + 
            " hover:text-gray-500 text-black active:underline" } to={props.href} {...props}>{children}</NavLink>
    }

    
    return (
        <button className={clsx("rounded-xl py-2", {
            "px-2 bg-transparent hover:text-gray-500 cursor-pointer ": props.textOnly,
            "px-4 bg-yellow-300 active:hover:bg-yellow-400 disabled:bg-gray-400": !props.textOnly,
        })} {...props}>{children}</button>
    )
}



export default Button;