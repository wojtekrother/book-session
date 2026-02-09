
type ErrorFieldProps = {
    errors: string[] | string
}

const ErrorField = ({ errors, ...props }: ErrorFieldProps) => {

    if (typeof errors === "string") {
        errors = [errors];
    }

    if (errors.length === 0 ){
        return <></>
    }

    return (
        <div className=" border-2 border-red-300 text-xs text-red-600 ">
            <div className="text-xl pl-2 pb-1">Errors:</div>
            <ul>
                {errors.map(err => <li key={err} className="list-disc list-inside pb-1 pl-4">{err}</li>)}
            </ul>
        </div>
    )
}

export default ErrorField;