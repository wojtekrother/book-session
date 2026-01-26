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
        return <NavLink className={"m-2 p-4"} to={props.href} {...props}>{children}</NavLink>
    }

    let cssClass = props.textOnly ? "button--text-only button m-2 p-4" : "button m-2 p-4";

    return (
        <button className={cssClass} {...props}>{children}</button>
    )
}



export default Button;