import React, { useState } from "react";

import { ModalNewMovie } from "../components/modals/NewMovie"

const AdminPanel = () => {

    const [showModalNewMovie, setShowModalNewMovie] = useState(false);
    const ToggleShowModalNewMovie = () => {
        setShowModalNewMovie(!showModalNewMovie);
    }

    return (
        <div className="container">
            <h1>AdminPanel</h1>
            <div className="d-flex column justify-content-around align-items-center">
                <button className="btn btn-secondary" onClick={ ToggleShowModalNewMovie }>New Movie</button>
                <button className="btn btn-secondary">New Spectacl</button>
            </div>
        <ModalNewMovie show={showModalNewMovie} toggle={ToggleShowModalNewMovie} />
        </div>
    )
};

export default AdminPanel;