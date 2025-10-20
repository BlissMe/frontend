import { RuleObject } from "antd/es/form";
import { StoreValue } from "rc-field-form/lib/interface";

export const passwordFieldValidation = (
  _: RuleObject,
  value: StoreValue
): Promise<void> => {
  /* if (!value) {
    return Promise.reject(new Error("Password is required!"));
  } */

  if (value.length < 6) {
    return Promise.reject(
      new Error("Password should be at least 6 characters long")
    );
  }

  if (!/(?=.*[A-Z])/.test(value)) {
    return Promise.reject(
      new Error("Password should contain at least one capital letter")
    );
  }

  if (!/(?=.*\d)/.test(value)) {
    return Promise.reject(
      new Error("Password should contain at least one number")
    );
  }

  return Promise.resolve();
};
// Username validation function (numbers only)
export const validateUsername = (_: any, value: string) => {
  // Must be 6–10 digits, only numbers allowed
  const usernameRegex = /^\d{6,10}$/;

  if (!usernameRegex.test(value)) {
    return Promise.reject(
      "Username must be 6–10 digits long and contain only numbers."
    );
  }

  return Promise.resolve();
};


