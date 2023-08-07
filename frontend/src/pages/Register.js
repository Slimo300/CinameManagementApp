import React, {useState} from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [msg, setMsg] = useState("");
    const [navigate, setNavigate] = useState(false);


    const SubmitRegister = async e => {
        e.preventDefault();

        try {
            await axios.post("http://www.spellcinema.com/api/users/register", {
                email, password, passwordConfirmation
            });
            setNavigate(true);
        } catch(err) {
            setMsg(err.response.data.err);
        }
    }

    if (navigate) return <Navigate to="/login" />

    return (
        <div className="container">
            <h1 className="pt-4 text-center">Register</h1>
            <form className="pt-2 d-flex row align-items-center" onSubmit={SubmitRegister}>
                {!(msg==="")?<h5>{msg}</h5>:null}
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={e => setEmail(e.target.value)}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Repeat Password</label>
                    <input type="password" className="form-control" onChange={e => setPasswordConfirmation(e.target.value)}/>
                </div>
                <button type="submit" className="btn violet btn-primary pt-2">Submit</button>
                <div className="pt-4 text-center text-primary"><a href="/login">or Log In</a></div>
            </form>
        </div>
    )
};

export default Register;