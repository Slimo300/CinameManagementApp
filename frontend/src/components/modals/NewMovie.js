import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import axiosObject, { BASE_URL } from "../../Requests";


export const ModalNewMovie = ({ show, toggle }) => {

    const [errors, setErrors] = useState(null);

    const [title, setTitle] = useState("");
    const [pictureUri, setPictureUri] = useState("");
    const [runtime, setRuntime] = useState("");
    const [releaseYear, setReleaseYear] = useState("");

    const [genre, setGenre] = useState("");
    const [genreList, setGenreList] = useState([]);

    const [searchTitle, setSearchTitle] = useState("");
    const [foundMovies, setFoundMovies] = useState([]);

    useEffect(() => {
            let dropdown = document.getElementById("dropdownUsers");
            if (dropdown === null) return;
            if (foundMovies && foundMovies.length !== 0) {
                dropdown.classList.add("show");
            } else {
                dropdown.classList.remove("show");
            }
    }, [foundMovies]);

    const clear = () => {
        setTitle("");
        setPictureUri("");
        setRuntime("");
        setReleaseYear("");
        setGenre("");
        setGenreList([]);
        setSearchTitle("");
        setFoundMovies([]);
    }

    const AddMovie = async (e) => {
        e.preventDefault();
        try {
            await axiosObject.post(BASE_URL+"/spectacles/movies", {
                title, releaseYear, runtime, pictureUri,
                genres: genreList,
            });
            clear();
            setErrors(
                <ul className="bg-success text-light" onClick={e => setErrors(null)}>
                    <li>Movie Created!</li>
                </ul>
            )
        } catch (err) {
            console.log(err);
            setErrors(
                <ul className="bg-danger text-light" onClick={e => setErrors(null)}>
                    {err.response.data.map(err => {
                        return <li key={err.message}>{err.message}</li>
                    })}
                </ul>
            );
        }
    };

    const MovieSearch = async (title) => {
        let dropdown = document.getElementById("dropdownUsers");
        if (dropdown === null) return;

        const options = {
          method: 'GET',
          url: 'https://moviesdatabase.p.rapidapi.com/titles/search/title/'+title,
          params: {
            titleType: 'movie',
            info: "base_info",
            exact: true,
            limit: 10,
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

    const FillInForm = (movieData) => {
        setTitle(movieData.titleText?movieData.titleText.text:"");
        setPictureUri(movieData.primaryImage?movieData.primaryImage.url:"");
        setRuntime(movieData.runtime?movieData.runtime.seconds:"");
        setGenreList(movieData.genres.genres.map(g => {return g.text}));
        setReleaseYear(movieData.releaseYear.year);
        document.getElementById("dropdownUsers").classList.remove("show");
    };

    return (
        <Modal size="xl" tabIndex="-1" role="dialog" isOpen={show} toggle={toggle}>
            <div role="document">
                <ModalHeader toggle={toggle} className="bg-violet text-light text-center">
                    New Movie
                </ModalHeader>
                <ModalBody>
                    { errors }
                    <div className="d-flex column justify-content-around">
                        <form onSubmit={AddMovie}>
                            <h2 className="text-violet">Type in Movie info</h2>
                            <div className="form-group">
                                <label htmlFor="titlel">Title:</label>
                                <input name="title" type="text" className="form-control" placeholder="Title" value={title} onChange={(e)=> setTitle(e.target.value) }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="runtime">Release Year:</label>
                                <input name="runtime" type="text" className="form-control" placeholder="Release Year" value={releaseYear} onChange={(e)=> setReleaseYear(e.target.value) }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="picture">Picture URI:</label>
                                <input name="picture" type="text" className="form-control" placeholder="Picture URI" value={pictureUri} onChange={(e)=> setPictureUri(e.target.value) }/>
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

                        <form className="pb-5">
                            <h2 className="text-violet pt-2 text-center">Or Find a Movie!</h2>
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
                                                <FoundMovie movie={item} fillForm={FillInForm}/>
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
        <div className="d-flex column w-100 justify-content-around pb-1">
            <img width={60} height={60} alt="movie" src={movie.primaryImage?movie.primaryImage.url:""}/>
            <p className="px-4">{movie.titleText.text + " (" + movie.releaseYear.year + ")"}</p>
            <button className="btn text-light bg-violet" onClick={e => {e.preventDefault(); fillForm(movie)}}><FontAwesomeIcon icon={faPlus}/></button>
        </div>
    );
};

export default ModalNewMovie;
