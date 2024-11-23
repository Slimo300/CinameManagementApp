import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess, withAuth }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      
      const client = axios.create({
        baseURL: "/",
        withCredentials: true,
      });

      if (withAuth) {
        client.interceptors.response.use((res) => res, async err => {
          const originalRequest = err.config;
          if (err.status === 401) {
              try {
                  console.log("refreshing token");
                  await axios.post("/api/users/refresh", {}, { withCredentials: true });
                  return axios(originalRequest);
              } catch (err) {
                  return Promise.reject(err);
              }
          }
        })
      }

      const response = await client[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors ? err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            )): null}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
