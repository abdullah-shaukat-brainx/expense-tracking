import { postCall, putCall, authorizedPutCall } from "./APIsServices";

export const signup = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    postCall("/users/signup", { name, email, password })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    postCall("/users/login", { email, password })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const forgetPassword = async (email) => {
  return new Promise((resolve, reject) => {
    postCall("/users/forget_password", { email })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const resetPassword = async (token, newPassword) => {
  return new Promise((resolve, reject) => {
    putCall(`/users/reset_password/${token}`, {
      newPassword,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateProfile = async (name, password) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall("/users/update_profile", { name, password })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
