import React, {useState} from "react";
import axiosObject, { BASE_URL } from "../Requests";

const Login = ({ setUser }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const SubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosObject.post(BASE_URL+"/users/login", {
                email: email,
                password: password
            }, {
                withCredentials: true,
            })
            window.localStorage.setItem("token", response.data.accessToken);
            
            const userResponse = await axiosObject.get(BASE_URL+"/users/current-user");

            setUser(userResponse.data);
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <div className="container">
            <h1 className="pt-4 text-center">Login</h1>
            <form className="pt-2 d-flex row align-items-center" onSubmit={SubmitLogin}>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn violet btn-primary pt-2">Submit</button>
                <div className="pt-4 text-center text-primary"><a href="/register">or Register</a></div>
                {/* <div className="pt-4 text-center text-primary"><a href="#">Forgot your password?</a></div> */}
            </form>
        </div>
    )
};

export default Login;