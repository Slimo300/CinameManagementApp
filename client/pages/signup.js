import { useState } from "react"; 
import useRequest from "../hooks/use-request";
import Router from "next/router";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            email, password, passwordConfirmation
        },
        onSuccess: () => Router.push("/signin")
    })

    const SubmitRegister = async e => {
        e.preventDefault();

        await doRequest();
    }

    return (
        <div className="container">
            <h1 className="pt-4 text-center">Sign Up</h1>
            <form className="pt-2 d-flex row align-items-center" onSubmit={SubmitRegister}>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Repeat Password</label>
                    <input type="password" className="form-control" onChange={e => setPasswordConfirmation(e.target.value)}/>
                </div>
                { errors }
                <button type="submit" className="btn bg-violet btn-primary pt-2">Submit</button>
                <div className="pt-4 text-center text-primary"><a href="/signin">or Log In</a></div>
            </form>
        </div>
    )
};