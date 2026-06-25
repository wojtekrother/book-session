
import { StringUtils } from "../../../shared/utils/string";

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
    const MAX_PASSWORD_LENGTH = 20;
    const MIN_PASSWORD_LENGTH = 3;
    if (StringUtils.isBlank(password)) {
        return "Password is required";
    }
    if (password.length < 3) {
        return `Password is too short (min ${MIN_PASSWORD_LENGTH} chars)`;
    }
    if (password.length > 20) {
        return `Password is too long (max ${MAX_PASSWORD_LENGTH} chars)`;
    }
    return null;
}

export const validateTitle = (title: string): string | null => {
    const MAX_TITLE_LENGTH = 50;
    if (StringUtils.isBlank(title)) {
        return "Title is required";
    }

    if (title.length > MAX_TITLE_LENGTH) {
        return `Title is too long (max ${MAX_TITLE_LENGTH} chars)`;
    }
    return null;
}

export const validateDescription = (description: string): string | null => {
    const MAX_DESCRIPTION_LENGTH = 300;
    if (StringUtils.isBlank(description)) {
        return "Description is required";
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return `Description is too long (max ${MAX_DESCRIPTION_LENGTH} chars)`;
    }
    return null;
}

export const validateSummary = (summary: string): string | null => {
    const MAX_SUMMARY_LENGTH = 150;
    if (StringUtils.isBlank(summary)) {
        return "Summary is required";
    }

    if (summary.length > 150) {
        return `Summary is too long (max ${MAX_SUMMARY_LENGTH} chars)`;
    }
    return null;
}

export const validateDuration = (duration: string | number): string | null => {
    const MAX_DURATION_LENGTH = 3;
    const MAX_DURATION = 365;
    const MIN_DURATION = 1;
    if (typeof duration === "string") {
        if (StringUtils.isBlank(duration)) {
            return "Duration is required";
        }

        if (duration.length > MAX_DURATION_LENGTH) {
            return `Duraction have to be less than ${MAX_DURATION}`;
        }
        if (Number.isNaN(duration)) {
            return "Duraction have to be a number";
        }
        if (Number(duration) > MAX_DURATION) {
            return `Duraction have to be less than ${MAX_DURATION}`;
        }
    } else {
        if (duration < MIN_DURATION) {
            return `Duraction have to be not less than ${MIN_DURATION}`;
        }

        if (duration > 365) {
            return `Duraction have to be less than ${MAX_DURATION}`;
        }
    }
    return null;
}

