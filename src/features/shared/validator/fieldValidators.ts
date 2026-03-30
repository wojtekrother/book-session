import { string } from "zod";
import { StringUtils } from "../../../utils/string";

export const validateLogin = (login: string): string | null => {
    if (StringUtils.isBlank(login)) {
        return "Login is required"
    }
    if (login.length < 3) {
        return "Login is too short";
    }
    return null
}

export const validatePassword = (password: string): string | null => {
    if (StringUtils.isBlank(password)) {
        return "Password is required";
    }
    if (password.length < 3) {
        return "Password is too short";
    }
    if (password.length > 20) {
        return "Password is too long";
    }
    return null;
}

export const validateTitle = (title: string): string | null => {
    if (StringUtils.isBlank(title)) {
        return "Title is required";
    }

    if (title.length > 50) {
        return "Title is too long";
    }
    return null;
}

export const validateDescription = (description: string): string | null => {
    if (StringUtils.isBlank(description)) {
        return "Description is required";
    }

    if (description.length > 300) {
        return "Description is too long";
    }
    return null;
}

export const validateSummary = (summary: string): string | null => {
    if (StringUtils.isBlank(summary)) {
        return "Summary is required";
    }

    if (summary.length > 150) {
        return "Summary is too long";
    }
    return null;
}

export const validateDuration = (duration: string | number): string | null => {
    if (typeof duration === "string") {
        if (StringUtils.isBlank(duration)) {
            return "Duration is required";
        }

        if (duration.length > 3) {
            return "Duration is too long";
        }
        if (Number.isNaN(duration)) {
            return "Duraction have to be a number";
        }
        if (Number(duration) > 365) {
            return "Duraction have to be less than 365";
        }
    } else {
        if (duration <= 0) {
            return "Duraction have to be positive number";
        }

        if (duration > 365) {
            return "Duraction have to be less than 365";
        }
    }
    return null;
}

