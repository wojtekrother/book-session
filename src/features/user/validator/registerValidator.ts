import { Errors } from "../../../shared/hooks/useForm";
import { StringUtils } from "../../../shared/utils/string";
import { UserCreateDTO } from "../schema/user.schema";

export const registerValidate = (register: UserCreateDTO): Errors<UserCreateDTO> => {
    let errors: Errors<UserCreateDTO> = {};
    if (StringUtils.isBlank(register.confirmPassword)) {
        errors.confirmPassword = "Confirm password is required"
    }
    if (register.password !== register.confirmPassword) {
        errors.confirmPassword = "Confirm password is not the same like password";
    }
    return errors
}