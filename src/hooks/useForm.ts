import React, { useState } from "react";
import z, { keyof } from "zod";

type Errors<T> = {
    [K in keyof T]?: string | null
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


const useForm = <T extends Record<string, any>>(initialValue: T) => {
    //values
    const [values, setValues] = useState<T>(initialValue);
    //errors
    const [errors, setErrors] = useState<Errors<T>>({});
    //touched
    const [touched, setTouched] = useState<Touched<T>>({});
    const [validators, setValidators] = useState<Validators<T>>({})


    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = e.target.name as keyof T
        const value = e.target.value
        setValues(prevValue => {
            return { ...prevValue, [field]: value }
        });
        // 2. Bezpieczne wywołanie walidatora
        // Używamy 'as any', ponieważ e.target.value to zawsze string, 
        // a T[field] może być innym typem w modelu danych.
        const validator = validators[field];

        if (validator) {
            const errorMessage = validator(value as any)
            setErrors(prev => ({ ...prev, [field]: errorMessage }));
        } 
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

    function validate(values: T): Errors<T> {
        let errors:Errors<T> = {}
        Object.keys(values).forEach(key => {
            const validator = validators[key as keyof T];
            if (validator !== undefined) {
                const errorMessage = validator(values[key as keyof T])
                if (errorMessage!= null) {
                errors[key as keyof T] = errorMessage
                }
                
            }
        })
        setErrors(errors);
        return errors
    }

    const handleSubmit = (callback: (data: T) => void) =>
        (e: React.FormEvent<HTMLFormElement>) => {

            e.preventDefault()

            const validationErrors = validate(values)

            if (Object.keys(validationErrors).length) {
                setErrors(validationErrors)
                return
            }

            callback(values)
        }



    return { register, values, errors, touched, handleSubmit, setValidators }



};


export default useForm;