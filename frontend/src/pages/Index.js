import React from "react";
import axios from "axios";

import img from "../images/theatre.jpg";
import axiosObject, { BASE_URL } from "../Requests";

const Index = () => {
    const Refresh = () => {
        const refresh = async () => {
            try {
                await axios.post(BASE_URL+"/users/refresh", {}, {
                    withCredentials: true,
                });
            } catch(err) {
                alert(JSON.stringify(err.response.data));
            }
        };

        refresh();
    };

    const CurrentUser = () => {
        const currentuser = async () => {
            try {
                const response = await axiosObject.get(BASE_URL+"/users/current-user");
                console.log(response.data);
            } catch (err) {
                alert(JSON.stringify(err.response.data));
            }
        }

        currentuser();
    };

    return (
        <div className="container">
            <div className="d-flex row justify-content-center text-align-center pt-4">
                <h1 className="text-center"> Welcome to Spell Cinema!</h1>
                <img src={img} className="pt-4" alt="movie theatre"></img>
            </div>
            <button className="btn btn-primary" onClick={Refresh}>Refresh</button>
            <button className="btn btn-primary" onClick={CurrentUser}>CurrentUser</button>
        </div>
    );
};

export default Index;