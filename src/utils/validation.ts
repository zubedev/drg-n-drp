import { Validatable } from "../models/validatable.js";

// Validation function
export function validate(obj: Validatable) {
    let isValid = true;
    if (obj.required) { // required = true
        isValid = isValid && obj.value.toString().trim().length !== 0;
    }
    if (typeof obj.value === 'string' && obj.minLength != null) { // or undefined, can be 0
        isValid = isValid && obj.value.trim().length >= obj.minLength;
    }
    if (typeof obj.value === 'string' && obj.maxLength != null) { // or undefined, can be 0
        isValid = isValid && obj.value.trim().length <= obj.maxLength;
    }
    if (typeof obj.value === 'number' && obj.minVal != null) { // or undefined, can be 0
        isValid = isValid && obj.value >= obj.minVal;
    }
    if (typeof obj.value === 'number' && obj.maxVal != null) { // or undefined, can be 0
        isValid = isValid && obj.value <= obj.maxVal;
    }
    return isValid;
}
