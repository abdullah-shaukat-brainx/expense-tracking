import { EMAIL_REGEX, PASSWORD_REGEX } from "../Constants";

export const isValidEmailFormat = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

export const isValidPasswordFormat = (password) => {
  return PASSWORD_REGEX.test(String(password));
};