import axios from "axios";

export const BASE_URL = window._env_.API_URL;

let axiosObject = axios.create({});
axiosObject.defaults.headers.common['Content-Type'] = "application/json";

async function refreshAccessToken() {

  let response;

  try {
    response = await axios.post(BASE_URL+"/users/refresh", {}, {
      withCredentials: true,
    })
    
    window.localStorage.setItem("token", response.data.accessToken);
  
  } catch (err) {
    window.localStorage.clear();
  }
}

// Request interceptor for API calls
axiosObject.interceptors.request.use(
    config => {
        let accessToken = window.localStorage.getItem("token");
        config.headers = { 
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        };
        return config;
    },
    error => {
      Promise.reject(error);
  });
  
  // Response interceptor for API calls
  axiosObject.interceptors.response.use((response) => {
    return response;
  }, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      await refreshAccessToken();

      const access_token = window.localStorage.getItem("token");

      if (access_token === null) return Promise.reject(error);

      axiosObject.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      console.log(originalRequest);
      return axiosObject(originalRequest);
    }
    return Promise.reject(error);
  });

export default axiosObject;