import React, { useEffect, useState } from "react";

import { ModalNewMovie } from "../components/modals/NewMovie";
import axiosObject, { BASE_URL } from "../Requests";
import ModalNewSpectacl from "../components/modals/NewSpectacl";

const AdminPanel = () => {

    const [showModalNewMovie, setShowModalNewMovie] = useState(false);
    const ToggleShowModalNewMovie = () => {
        setShowModalNewMovie(!showModalNewMovie);
    }

    const [showModalNewSpectacl, setShowModalNewSpectacl] = useState(false);
    const ToggleShowModalNewSpectacl = () => {
        setShowModalNewSpectacl(!showModalNewSpectacl);
    }

    // movieTitle to find a movie by it
    const [movieTitle, setMovieTitle] = useState("");
    // object for display of a chosen movie
    const [movie, setMovie] = useState(null);

    // screening room chosen for given spectacl
    const [screeningRoom, setScreeningRoom] = useState(null);
    // list of all available screening rooms
    const [screeningRoomList, setScreeningRoomList] = useState(null);
    
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [alerts, setAlerts] = useState(null);

    useEffect(() => {
        const getScreeningRooms = async() => {
            try {
                const response = await axiosObject.get(BASE_URL+"/spectacles/screening-rooms")
                setScreeningRoomList(response.data);
                setScreeningRoom(response.data[0].id);
            } catch(err) {
                alert(err);
            }
        };

        getScreeningRooms();
    }, []);

    useEffect(() => {
        if (startDate !== "" && startTime !== "") setStart(new Date(startDate+" "+startTime));

    }, [startDate, startTime]);

    const NumFormat = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    }

    useEffect(() => {
        if (start && movie) {
            const endDate = new Date(start.getTime());
            endDate.setSeconds(endDate.getSeconds()+movie.runtime);
            setEnd(endDate);
            setEndDate(`${endDate.getFullYear()}-${NumFormat(endDate.getMonth()+1)}-${NumFormat(endDate.getDate())}`);
            setEndTime(`${NumFormat(endDate.getHours())}:${NumFormat(endDate.getMinutes())}`);
        }
    }, [start, movie]);

    const FindMovie = async e => {
        e.preventDefault();

        try {
            const response = await axiosObject.get(BASE_URL+"/spectacles/movies?title="+movieTitle);
            setMovie(response.data);
        } catch(err) {
            setAlerts(
                <ul className="bg-danger text-light" onClick={e => setAlerts(null)}>
                    {err.response.data.map(err => {
                        console.log(err);
                        return <li key={err.message}>{err.message}</li>
                    })}
                </ul>
            );
        }
    }

    const AddSpectacl = async e => {
        e.preventDefault();

        try {
            await axiosObject.post(BASE_URL+"/spectacles", {
                movieID: movie.id,
                screeningRoomID: screeningRoom,
                startTime: start,
                endTime: end
            });
        } catch (err) {
            console.log(err);
            setAlerts(
                <ul className="bg-danger text-light" onClick={e => setAlerts(null)}>
                    {err.response.data.map(err => {
                        console.log(err);
                        return <li key={err.message}>{err.message}</li>
                    })}
                </ul>
            );
        }
    }

    return (
        <div className="container">
        <button className="btn btn-secondary" onClick={ ToggleShowModalNewMovie }>New Movie</button>
        <button className="btn btn-secondary" onClick={ ToggleShowModalNewSpectacl }>New Spectacl</button>
            { alerts }
            <div className="d-flex column justify-content-around align-items-center mt-4">
                <form onSubmit={AddSpectacl}>
                    <h2 className="text-violet w-100 text-center">Type in Spectacl info</h2>
                    <div className="form-group mb-5">
                        <label className="px-1">Choose a movie:</label>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Movie Title" value={movieTitle} onChange={ e => setMovieTitle(e.target.value) }/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary bg-violet text-light" type="button" onClick={FindMovie}>Find Movie</button>
                            </div>
                        </div>
                        {movie?<FoundMovie movie={movie} />:null}
                    </div>
                    <div className="input-group mb-5">
                        <label className="input-group-text">Select Screening Room</label>
                        <select className="form-select" onChange={e => { setScreeningRoom(e.target.value)}} >
                            {
                                screeningRoomList?screeningRoomList.map(room => {
                                    return <option value={room.id}>{room.roomNumber} </option>
                                }):null
                            }
                        </select>
                    </div>
                    <div className="d-flex column justify-content-between mg-5">
                        <div className="form-group pb-2">
                            <label htmlFor="runtime">Start Date:</label>
                            <input type="date" className="form-control" value={startDate} onChange={(e)=> setStartDate(e.target.value) }/>
                        </div>
                        <div className="form-group pb-2">
                            <label htmlFor="runtime">Start Time:</label>
                            <input type="time" className="form-control" value={startTime} onChange={(e)=> setStartTime(e.target.value) }/>
                        </div>
                    </div>
                    <div className="d-flex column justify-content-between mg-5">
                        <div className="form-group pb-2">
                            <label htmlFor="runtime">End Date:</label>
                            <input type="date" className="form-control" value={endDate} disabled/>
                        </div>
                        <div className="form-group pb-2">
                            <label htmlFor="runtime">End Time:</label>
                            <input type="time" className="form-control" value={endTime} disabled/>
                        </div>
                    </div>
                    <div className="form-row text-center">
                        <div className="col-12 mt-2">
                            <button type="submit" className="btn bg-violet btn-large text-light w-100" onClick={AddSpectacl}>Add New Spectacl</button>
                        </div>
                    </div>
                </form>
            </div>
            <ModalNewMovie show={showModalNewMovie} toggle={ToggleShowModalNewMovie} />
            <ModalNewSpectacl show={showModalNewSpectacl} toggle={ToggleShowModalNewSpectacl} />
        </div>
    )
};


const FoundMovie = ({ movie }) => {
    return (
        <div className="d-flex flex-row w-100 justify-content-around pb-1 pt-3 border">
            <img width={100} height={100} alt="movie" src={movie.pictureUri?movie.pictureUri:""}/>
            <div className="d-flex flex-column justify-content-center px-4">
                <p className="row">{movie.title + " (" + movie.releaseYear + ")"}</p>
                <p className="row">Genres: {movie.genres + " "}</p>
            </div>
        </div>
    );
};

export default AdminPanel;
