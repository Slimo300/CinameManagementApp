import React from "react";

import img from "../images/theatre.jpg";

const Index = () => {
    return (
        <div className="container">
            <div className="d-flex row justify-content-center text-align-center pt-4">
                <h1 className="text-center"> Welcome to Spell Cinema!</h1>
                <img src={img} className="pt-4" alt="movie theatre"></img>
            </div>
        </div>
    );
};

export default Index;