import {
  authorizedPostCall,
  authorizedDeleteCall,
  authorizedGetCall,
  authorizedPutCall,
} from "./APIsServices";

export const getCategories = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedGetCall(
      `/category?limit=${data.limit}&page=${data.page}&searchQuery=${data.searchQuery}`
    )
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAllCategories = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedGetCall(
      `/category/get_all_categories`
    )
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addCategory = async (data) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall("/category", data)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteCategory = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/category/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateCategory = async (id, name) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/category/${id}`, { name })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
