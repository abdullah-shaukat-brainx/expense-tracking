import axios from "axios";
const BASE_URL = "http://localhost:3000/api/v1"; //To ENV file

export const postCall = async (url, data) => {
  try {
    const response = await axios.post(BASE_URL + url, data);
    const result = {
      ...response.data,
    };
    if (response.headers.access_token) {
      result.access_token = response.headers.access_token;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const putCall = async (url, data) => {
  try {
    const response = await axios.put(BASE_URL + url, data);
    const result = {
      ...response.data,
    };
    return result;
  } catch (error) {
    throw error;
  }
};

export const authorizedGetCall = async (url) => {
  try {
    const response = await axios.get(BASE_URL + url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const result = {
      ...response.data,
    };
    return result;
  } catch (error) {
    throw error;
  }
};

export const authorizedPostCall = async (url, data) => {
  try {
    const response = await axios.post(BASE_URL + url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const result = {
      ...response.data,
    };
    if (response.headers.access_token) {
      result.access_token = response.headers.access_token;
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const authorizedDeleteCall = async (url) => {
  try {
    const response = await axios.delete(BASE_URL + url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const authorizedPutCall = async (url, data) => {
  try {
    const response = await axios.put(BASE_URL + url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const result = {
      ...response.data,
    };
    if (response.headers.access_token) {
      result.access_token = response.headers.access_token;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
