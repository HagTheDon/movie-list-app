import axios from "axios";
const BASE_URL = "http://localhost:3004/v1/";
//const BASE_URL = "https://api.cabbily.com/v1/admin/";
//const BASE_URL = "https://api-staging.cabbily.com/v1/admin/";

export const mainApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": true,
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

mainApi.defaults.headers.common["Content-Type"] = "application/json";

mainApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//USER
export const registerUser = async (params: any) => {
  console.log("register endpoint hit with", params);
  const response = await mainApi.post(`users/register`, JSON.stringify(params));
  return response.data;
};

export const loginUser = async (params: any) => {
  const response = await mainApi.post("users/login", JSON.stringify(params));
  return response.data;
};

export const getProfile = async (params: any) => {
  const response = await mainApi.get(`users`);
  return response.data;
};

export const editProfile = async (params: any) => {
  const response = await mainApi.put(
    `users/${params.id}`,
    JSON.stringify(params)
  );
  return response.data;
};

export const deleteAccount = async (params: any) => {
  const response = await mainApi.delete(`users`, JSON.stringify(params));
  return response.data;
};

//MOVIES

export const getMovies = async (params: any) => {
  const response = await mainApi.get(`movies`, { params });
  return response.data;
};

export const getMovie = async (params: any) => {
  const response = await mainApi.get(`movies/${params.id}`);
  return response.data;
};

export const editMovie = async (params: any) => {
  const response = await mainApi.put(
    `movies/${params.id}`,
    JSON.stringify(params)
  );
  return response.data;
};

export const addMovie = async (params: any) => {
  const response = await mainApi.post(`movies`, JSON.stringify(params));
  return response.data;
};

export const deleteMovie = async (params: any) => {
  const response = await mainApi.delete(`movies/${params.id}`);
  return response.data;
};

//IMAGE
export const uploadImage = async (params: any) => {
  const response = await mainApi.post(
    `/images?asset_type=${params.asset_type}`,
    params.body,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
