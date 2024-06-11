export const isAuthenticated = () => {
  return localStorage.getItem("access_token") !== null;
};
// Use jwt and log out user to cehck validataion, logour if exoured or inalid