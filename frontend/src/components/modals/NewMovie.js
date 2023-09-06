import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";


export const ModalNewMovie = ({ show, toggle }) => {

    const [msg, setMsg] = useState("");

    const [title, setTitle] = useState("");
    const [pictureURI, setPictureURI] = useState("");
    const [runtime, setRuntime] = useState("");

    const [genre, setGenre] = useState("");
    const [genreList, setGenreList] = useState([]);

    const [searchTitle, setSearchTitle] = useState("");
    const [foundMovies, setFoundMovies] = useState([]);

    const AddMovie = (e) => {
        e.preventDefault();
        try {
            console.log({
                title, pictureURI, runtime, genreList
            })
        } catch (err) {
            setMsg(err);
        }
    };

    useEffect(() => {
            let dropdown = document.getElementById("dropdownUsers");
            if (dropdown === null) return;
            if (foundMovies && foundMovies.length !== 0) {
                dropdown.classList.add("show");
            } else {
                dropdown.classList.remove("show");
            }
    }, [foundMovies]);

    const MovieSearch = async (title) => {
        let dropdown = document.getElementById("dropdownUsers");
        if (dropdown === null) return;

        const options = {
          method: 'GET',
          url: 'https://moviesdatabase.p.rapidapi.com/titles/search/title/'+title,
          params: {
            titleType: 'movie',
            info: "base_info",
            limit: 3,
          },
          headers: {
            'X-RapidAPI-Key': window._env_.MOVIES_API_KEY,
            'X-RapidAPI-Host': window._env_.MOVIES_API_HOST,
          }
        };
        
        try {
            const response = await axios.request(options);
            setFoundMovies(response.data.results);
        } catch (error) {
            alert(error);
        }
    };

    const DeleteGenre = (genre) => {
        setGenreList(genreList.filter(g => {return g !== genre}));
    };

    const FillForm = (movieData) => {
        setTitle(movieData.titleText?movieData.titleText.text:"");
        setPictureURI(movieData.primaryImage?movieData.primaryImage.url:"");
        setRuntime(movieData.runtime?movieData.runtime.seconds:"");
        setGenreList(movieData.genres.genres.map(g => {return g.text}));
        document.getElementById("dropdownUsers").classList.remove("show");
    };

    return (
        <Modal id="buy" tabIndex="-1" role="dialog" isOpen={show} toggle={toggle}>
            <div role="document">
                <ModalHeader toggle={toggle} className="bg-violet text-light text-center">
                    New Movie
                </ModalHeader>
                <ModalBody>
                    <div>
                        {msg!==""?<h5 className="mb-4 text-danger">{msg}</h5>:null}
                        <form onSubmit={AddMovie}>
                            <div className="form-group">
                                <label htmlFor="titlel">Title:</label>
                                <input name="title" type="text" className="form-control" placeholder="Title" value={title} onChange={(e)=> setTitle(e.target.value) }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="picture">Picture URI:</label>
                                <input name="picture" type="text" className="form-control" placeholder="PictureURI" value={pictureURI} onChange={(e)=> setPictureURI(e.target.value) }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="runtime">Runtime:</label>
                                <input name="runtime" type="text" className="form-control" placeholder="Runtime" value={runtime} onChange={(e)=> setRuntime(e.target.value) }/>
                            </div>
                            <div className="form-group">
                                <label className="px-1" htmlFor="genres">Genres:</label>
                                {genreList && genreList.length !== 0?genreList.map(genre => {return <GenreEntry id={genre} genre={genre} deleteGenre={DeleteGenre} />}):null}
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Genre" value={genre} onChange={ e => setGenre(e.target.value) }/>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary bg-violet text-light" type="button" onClick={ () => setGenreList(state => {
                                            if (genre === "") {
                                                return state;
                                            }
                                            let newState = state;
                                            newState.push(genre);
                                            setGenre("");
                                            return newState
                                        }) }>Add Genre</button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row text-center">
                                <div className="col-12 mt-2">
                                    <button type="submit" className="btn bg-violet btn-large text-light">Create Movie</button>
                                </div>
                            </div>
                        </form>

                        <hr />

                        <h2 className="text-violet pt-2 text-center">Or Find a Movie!</h2>
                        <form className="pb-5">
                            <div className="form-group">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for a movie" value={searchTitle} onChange={ e => setSearchTitle(e.target.value) }/>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary bg-violet text-light" onClick={() => MovieSearch(searchTitle)} type="button">Search</button>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown w-100">
                                <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                                <div id="dropdownUsers" className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                    {foundMovies.length===0?null:foundMovies.map( item => {
                                        return <div key={item.ID} className="d-flex justify-content-center w-100">
                                                <FoundMovie movie={item} fillForm={FillForm}/>
                                                <hr />
                                            </div>
                                    })}
                                </div>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </div>
        </Modal>
    );
};

const GenreEntry = ({ genre, deleteGenre }) => {

    return <button className="btn bg-violet text-light m-1" onClick={e => {e.preventDefault(); deleteGenre(genre)}}>
        <div>{genre}</div>
        <FontAwesomeIcon icon={faXmark}/>
    </button>
}

const FoundMovie = ({ movie, fillForm }) => {
    return (
        <div className="d-flex col justify-content-center w-100">
            <img width={60} height={60} alt="movie" src={movie.primaryImage?movie.primaryImage.url:""}/>
            <p className="px-4">{movie.titleText.text + " (" + movie.releaseYear.year + ")"}</p>
            <button className="btn text-light bg-violet" onClick={e => {e.preventDefault(); fillForm(movie)}}><FontAwesomeIcon icon={faPlus}/></button>
        </div>
    );
};

export default ModalNewMovie;
