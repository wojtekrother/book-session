import { forEach } from "lodash";
import React, { useState } from "react";
import z, { keyof } from "zod";

export type Errors<T> = {
    [K in keyof T]?: string 
}

type Touched<T> = Partial<Record<keyof T, boolean>>

type Validators<T> = {
    [K in keyof T]?: (value: T[K]) => string | null
}

export type RegisterReturnType = {
    name: string,
    value: string,
    error?: string,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}


const useForm = <T extends Record<string, any>>(
    initialValue: T,
    initFieldsValidators: Validators<T>,
    intiCrossFieldValidator?: (form: T) => Errors<T>) => {

    const [values, setValues] = useState<T>(initialValue);
    const [errors, setErrors] = useState<Errors<T>>({});
    const [touched, setTouched] = useState<Touched<T>>({});
    const [fieldsValidators] = useState<Validators<T>>(initFieldsValidators);
    const crossFieldValidator = intiCrossFieldValidator;


    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = e.target.name as keyof T
        const value = e.target.value
        const valuesTemp = { ...values, [field]: value }
        setValues(prevValue => {
            return { ...prevValue, [field]: value }
        });
       
        setErrors(prevErrors => {
            const errorMessage = validateField(field, value)
            const updated = addOrRemoveError({
                errors: prevErrors,
                field,
                errorMessage,
            })

            return {
                ...updated,
                ...getCrossFielsErrors(valuesTemp),
            }
        })
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

    const register = (name: keyof T) => {
        const field = name as keyof T
        const error = (touched[field] && errors[field]) ? errors[field] : undefined

        return { name: name, value: values[field], error, onChange, onBlur } as RegisterReturnType
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