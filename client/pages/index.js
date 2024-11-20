import React from "react";

import img from "../statics/images/theatre.jpg";
import Image from "next/image";
import useRequest from "../hooks/use-request";

const Index = () => {
    const refreshRequest = useRequest({
        url: "/api/users/refresh",
        method: "post",
        onSuccess: data => console.log(data),
    });
    const currentUserRequest = useRequest({
        url: "/api/users/current-user",
        method: "get",
        onSuccess: data => console.log(data),
    });

    const SubmitCurrentUser = async e => {
        e.preventDefault();
        await currentUserRequest.doRequest();
    }    
    const SubmitRefresh = async e => {
        e.preventDefault();
        await refreshRequest.doRequest();
    }

    return (
        <div className="container">
            <div className="d-flex row justify-content-center text-align-center pt-4">
                <h1 className="text-center"> Welcome to Spell Cinema!</h1>
                <Image src={img} className="pt-4" alt="movie theatre" />
            </div>
            <button className="btn btn-primary" onClick={SubmitRefresh}>Refresh</button>
            <button className="btn btn-primary" onClick={SubmitCurrentUser}>CurrentUser</button>
            {currentUserRequest.errors}
            {refreshRequest.errors}
        </div>
    );
};

export default Index;