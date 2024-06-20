import {
  authorizedPostCall,
  authorizedDeleteCall,
  authorizedGetCall,
  authorizedPutCall,
} from "./APIsServices";

export const getBudgets = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedGetCall(`/budget?limit=${data.limit}&page=${data.page}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addBudget = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall("/budget", data)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteBudget = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/budget/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateBudget = async (id, amount) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/budget/${id}`, { amount })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
