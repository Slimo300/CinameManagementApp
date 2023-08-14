import React from "react";

import img from "../images/theatre.jpg";
import axiosObject, { BASE_URL } from "../Requests";

const Index = () => {
    const Refresh = () => {
        const refresh = async () => {
            try {
                await axiosObject.post(BASE_URL+"/users/refresh", {}, {
                    withCredentials: true,
                });
            } catch(err) {
                alert(err.response);
            }
        };

        refresh();
    };

    return (
        <div className="container">
            <div className="d-flex row justify-content-center text-align-center pt-4">
                <h1 className="text-center"> Welcome to Spell Cinema!</h1>
                <img src={img} className="pt-4" alt="movie theatre"></img>
            </div>
            <button className="btn btn-primary" onClick={Refresh}>Refresh</button>
        </div>
    );
};

export default Index;