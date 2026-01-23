

export const StringUtils = {
  isBlank: (val: string | null): boolean => {
    return !val || val.trim().length === 0;
  }
}


export const TypeCheckFormData = {
  isString(val: FormDataEntryValue | null):val is string {
    return typeof val === "string" 
  },

  isNumber(val: FormDataEntryValue | null):val is string {
    return typeof val === "string" && Number.isInteger(val)
  }
}