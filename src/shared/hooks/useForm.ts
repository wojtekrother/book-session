import React, { useState } from "react";
import { convertFileToString } from "../utils/file";
import { keyof } from "zod";

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
    value: any,
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

    const normalizeDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return date.toISOString().split('T')[0];
};

    const register = (name: keyof T, options?: { type?: string }) => {
        const isFile = options?.type === "file";
        const isDate = options?.type === "date";
        
        const field = name as keyof T
        const error = (touched[field] && errors[field]) ? errors[field] : undefined
        const date = isDate ? normalizeDate(values[field]) : ""
        return { name: name, ...(isFile ? {} : isDate ?{value:date}: { value: values[field] }), error, onChange, onBlur } as RegisterReturnType<T>
    }

    const reset = () => {
        setValues(initialValue);
        setErrors({})
        setTouched({})
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

    const isFormReady = () => {
        return (Object.keys(errors).length == 0)
    }

    const setAllValues = (values: T) => {
        setValues(values);

        const keys = Object.keys(values) as (keyof T)[];
        let touchedTemp = {} as Record<keyof T, boolean>
        for (const key of keys) {
            touchedTemp[key] = true;
        }
        setTouched(touchedTemp)

        let validationErrors = { ...getAllFieldsErrors(values), ...getCrossFielsErrors(values) }
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }
    }


    return { register, values, setAllValues, errors, touched, handleSubmit, validators: fieldsValidators, isFormReady, reset }



};


export default useForm;