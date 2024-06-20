import { authorizedGetCall } from "./APIsServices";

export const getDashboardAnalytics = async (month, year) => {
  return new Promise((resolve, reject) => {
    authorizedGetCall(`/dashboard?month=${month}&year=${year}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
