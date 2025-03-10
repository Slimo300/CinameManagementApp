import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import useRequest from "../../hooks/use-request";

export const ModalNewSpectacl = ({ show, toggle, screeningRooms }) => {
    const [movieTitle, setMovieTitle] = useState("");
    const [movie, setMovie] = useState(null);

    const [screeningRoom, setScreeningRoom] = useState(null);
    
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [alerts, setAlerts] = useState(null);

    const findMovieRequest = useRequest({
        url: `/api/spectacles/movie?title=${movieTitle}`,
        method: "get",
        body: {},
        onSuccess: () => setAlerts(
            <ul className="bg-success text-light" onClick={e => setAlerts(null)}>
                <li>Spectacl created!</li>
            </ul>
        )
    })

    // Effect for seting our start Date after both date and time are set
    useEffect(() => {
        if (startDate !== "" && startTime !== "") setStart(new Date(startDate+" "+startTime));

    }, [startDate, startTime]);

    // Effect for calculating end time for spectacl after start time is set and movie is chosen
    useEffect(() => {
        if (start && movie) {
            const endDate = new Date(start.getTime());
            endDate.setSeconds(endDate.getSeconds()+movie.runtime);
            setEnd(endDate);
            setEndDate(`${endDate.getFullYear()}-${NumFormat(endDate.getMonth()+1)}-${NumFormat(endDate.getDate())}`);
            setEndTime(`${NumFormat(endDate.getHours())}:${NumFormat(endDate.getMinutes())}`);
        }
    }, [start, movie]);

    const NumFormat = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    }

    const FindMovie = async e => {
        e.preventDefault();

        try {
            const response = await axiosObject.get(BASE_URL+"/spectacles/movies?title="+movieTitle);
            setMovie(response.data);
        } catch(err) {
            setAlerts(
                <ul className="bg-danger text-light" onClick={e => setAlerts(null)}>
                    {err.response.data.map(err => {
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
                startTime: start.toISOString(),
                endTime: end.toISOString()
            });
            setAlerts(
                <ul className="bg-success text-light" onClick={e => setAlerts(null)}>
                        <li>Spectacl Created</li>
                </ul>
            )
        } catch (err) {
            setAlerts(
                <ul className="bg-danger text-light" onClick={e => setAlerts(null)}>
                    {err.response.data.map(err => {
                        return <li key={err.message}>{err.message}</li>
                    })}
                </ul>
            );
        }
    }


    return (
        <Modal size="xl" tabIndex="-1" role="dialog" isOpen={show} toggle={toggle}>
            <div role="document">
                <ModalHeader toggle={toggle} className="bg-violet text-light text-center">
                    New Movie
                </ModalHeader>
                <ModalBody>
                    { alerts }
                    <div className="d-flex column justify-content-around">
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
                                        screeningRooms?screeningRooms.map(room => {
                                            return <option key={room.id} value={room.id}>{room.roomNumber} </option>
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
                </ModalBody>
            </div>
        </Modal>
    );
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

export default ModalNewSpectacl;
