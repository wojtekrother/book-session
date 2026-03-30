import { forEach } from "lodash";
import React, { useState } from "react";
import z, { keyof } from "zod";
import { convertFileToString } from "../utils/file";

export type Errors<T> = {
    [K in keyof T]?: string
}

type Touched<T> = Partial<Record<keyof T, boolean>>

type Validators<T> = {
    [K in keyof T]?: (value: T[K]) => string | null
}

type Conventers<T> = {
    [K in keyof T]?: (value: T[K]) => T[K]
}

export type RegisterReturnType<T> = {
    name: keyof T,
    value: T[keyof T],
    error?: string,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export type UseFormProps<T extends Record<string, any>> = {
    initialValue: T,
    initialConventers?: Conventers<T>
    initFieldsValidators: Validators<T>,
    intiCrossFieldValidator?: (form: T) => Errors<T>
}


const useForm = <T extends Record<string, any>>(
    { initialValue,
        initialConventers,
        initFieldsValidators,
        intiCrossFieldValidator }: UseFormProps<T>) => {

    const [values, setValues] = useState<T>(initialValue);
    const [errors, setErrors] = useState<Errors<T>>({});
    const [touched, setTouched] = useState<Touched<T>>({});
    const [fieldsValidators] = useState<Validators<T>>(initFieldsValidators);
    const crossFieldValidator = intiCrossFieldValidator;


    const onChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = e.target.name as keyof T;
        const type = e.target.type;
        const value = e.target.value;

        let valueTemp: T[keyof T];
        if (e.target instanceof HTMLInputElement && type === "file") {
            const files = e.target.files
            valueTemp = files !== null ? await convertFileToString(files?.[0]) as unknown as T[keyof T] : "" as T[keyof T];
        } else {
            valueTemp = value as T[keyof T];
        }



        //setValues(valuesTemp)
        setValues(prevValue => {
            const newValues = { ...prevValue, [field]: valueTemp }


            setErrors(prevErrors => {
                const errorMessage = validateField(field, valueTemp)
                const updated = addOrRemoveError({
                    errors: prevErrors,
                    field: field,
                    errorMessage,
                })

                return {
                    ...updated,
                    ...getCrossFielsErrors(newValues),
                }
            })
            return newValues
        });
    }
    function validateField(field: keyof T, value: any): string | null {
        const validator = fieldsValidators[field];
        if (validator) {
            return validator(value as any)
        }
        return null
    }

    function addOrRemoveError({ errors, field, errorMessage }:
        { errors: Errors<T>, field: keyof T, errorMessage: string | null }
    ): Errors<T> {
        let newErrors = { ...errors };
        if (errorMessage != null) {
            newErrors[field] = errorMessage
        } else {
            if (newErrors.hasOwnProperty(field)) {
                delete newErrors[field]
            }
        }
        return newErrors

    }

    function getCrossFielsErrors(values: T): Errors<T> {
        if (crossFieldValidator) {
            return crossFieldValidator(values)
        }
        return {};
    }

    function getAllFieldsErrors(values: T): Errors<T> {
        let errors: Errors<T> = {};
        (Object.keys(values) as (keyof T)[]).forEach(key => {
            const errorMessage = validateField(key, values[key])
            if (errorMessage != null) {
                errors[key as keyof T] = errorMessage
            }
        })
        return errors
    }


    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = e.target.name as keyof T
        setTouched(prevValue => {
            return { ...prevValue, [field]: true }
        })
    }

    const register = (name: keyof T,  options?: { type?: string }) => {
        const isFile = options?.type === "file";
        const field = name as keyof T
        const error = (touched[field] && errors[field]) ? errors[field] : undefined

        return { name: name, ...(isFile ? {}: {value:values[field]}), error, onChange, onBlur } as RegisterReturnType
    }



    const handleSubmit = (callback: (data: T) => void) =>
        (e: React.FormEvent<HTMLFormElement>) => {

            e.preventDefault()

            let validationErrors = { ...getAllFieldsErrors(values), ...getCrossFielsErrors(values) }


            if (Object.keys(validationErrors).length) {
                setErrors(validationErrors)
                return
            }

            callback(values)
        }

    const isAllTouched = () => {
        return (Object.keys(values) as (keyof T)[]).every((key) => touched[key] === true)
    }

    const isFormReady = () => {
        return (Object.keys(errors).length == 0)
    }


    return { register, values, errors, touched, handleSubmit, validators: fieldsValidators, isFormReady }



};


export default useForm;