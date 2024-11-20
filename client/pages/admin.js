import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendar } from "@fortawesome/free-solid-svg-icons";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ModalNewMovie } from "../components/modals/new-movie";
import { ModalNewSpectacl } from "../components/modals/new-spectacl";

const AdminPanel = () => {

    const [showModalNewMovie, setShowModalNewMovie] = useState(false);
    const ToggleShowModalNewMovie = () => {
        setShowModalNewMovie(!showModalNewMovie);
    }

    const [showModalNewSpectacl, setShowModalNewSpectacl] = useState(false);
    const ToggleShowModalNewSpectacl = () => {
        setShowModalNewSpectacl(!showModalNewSpectacl);
    }

    // const [alerts, setAlerts] = useState(null);

    const [days, setDays] = useState([]);

    useEffect(() => {
        let today = new Date();

        const days = [];
        for (let i = 0; i < 5; i++) {
            days.push(
                today
            );

            today = new Date(today.getTime());
            today.setDate(today.getDate()+1);
        }

        setDays(days);
    }, []);

    return (
        <div className="container pt-3">
            {/* { alerts } */}
            <div className="d-flex w-100 justify-content-around flex-row">
                <button className="btn bg-violet text-light d-flex flex-row" onClick={ ToggleShowModalNewMovie }><p className="px-3 pt-3">New Movie</p><FontAwesomeIcon className="pt-3" icon={faPlus}/></button>
                <button className="btn bg-violet text-light d-flex flex-row" onClick={ ToggleShowModalNewSpectacl }><p className="px-3 pt-3">New Spectacl</p><FontAwesomeIcon className="pt-3" icon={faPlus}/></button>
            </div>
            <hr className="pt-3" />
            <div className="d-flex flex-row justify-content-center">              
                <ul className="pagination">
                    {days.map( day => {
                        return <li className="page-item"><div className="text-violet page-link">{day.toLocaleDateString("en-EN", {
                            weekday: "short",
                        })}</div></li>
                    })}
                </ul>
                <DatePicker className="btn btn-success" customInput={<CustomInput />} />
            </div>
            <div className="d-flex column justify-content-around align-items-center mt-4">
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ModalNewMovie show={showModalNewMovie} toggle={ToggleShowModalNewMovie} />
            <ModalNewSpectacl show={showModalNewSpectacl} toggle={ToggleShowModalNewSpectacl} />
        </div>
    )
};

const CustomInput = React.forwardRef((props, ref) => {
    return <div onClick={props.onClick} className="btn border">

      <label ref={ref}>         
        {props.value || props.placeholder}
      </label>
      <FontAwesomeIcon icon={faCalendar} className="text-violet" />
    </div>
});

export default AdminPanel;