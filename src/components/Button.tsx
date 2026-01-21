import { Children, ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";




type ButtonProps = {
    href?: undefined
}
    & ComponentPropsWithoutRef<"button"> |
    {
        href: string
    }
    & ComponentPropsWithoutRef<"a">

const Button = ({ children, ...props }: ButtonProps) => {

    if (props.href !== undefined) {
        return <NavLink to={props.href} >{children}</NavLink>
    }

    return (
        <button>{children}</button>
    )
}



export default Button;