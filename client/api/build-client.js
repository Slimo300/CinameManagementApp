import axios from "axios";
import { Agent } from "https";

const getClient = (req) => {
    if (typeof window === "undefined") {
        return axios.create({
            baseURL: "https://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req?req.headers:{},
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        });
    }
    return axios.create({
        baseURL: "/",
    });
}

export default ({ req }) => {
    const client = getClient(req);

    client.interceptors.response.use((res) => res, async err => {
        const originalRequest = err.config;
        if (err.status === 401) {
            try {
                await getClient(err.config).post("/api/users/refresh", {}, { withCredentials: true });
                return getClient(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    })
    return client;
};