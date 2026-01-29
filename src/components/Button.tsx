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
        return <NavLink className={"bg-transparent m-2 px-6 py-2 hover:text-gray-600 text-black"} to={props.href} {...props}>{children}</NavLink>
    }

    let cssClass = props.textOnly ? "button--text-only button m-2  " : "button m-2";

    return (
        <button className={cssClass+ " disabled:bg-gray-400 bg-violet-500 active:hover:bg-violet-600 rounded-xl px-6 py-2 "} {...props}>{children}</button>
    )
}



export default Button;