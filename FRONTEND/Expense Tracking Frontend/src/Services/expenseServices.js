import {
  authorizedPostCall,
  authorizedDeleteCall,
  authorizedGetCall,
  authorizedPutCall,
} from "./APIsServices";

export const getExpenses = async (data) => {
  const { limit, page, searchQuery, category_id, startDate, endDate } = data;
  return new Promise((resolve, reject) => {
    authorizedGetCall(
      `/expense?limit=${limit}&page=${page}&searchQuery=${searchQuery}&category_id=${category_id}&startDate=${startDate}&endDate=${endDate}`
    )
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOneExpenseDetails = async (data) => {
  const { id } = data;
  return new Promise((resolve, reject) => {
    authorizedGetCall(`/expense/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addExpense = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall("/expense", data)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteExpense = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/expense/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateExpense = async (data) => {
  const { id, date, amount, category_id, description } = data;
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/expense/${id}`, {
      date,
      amount,
      category_id,
      description,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
