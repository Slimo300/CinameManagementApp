import { useState } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: { email, password },
        onSuccess: () => Router.push("/")
    });

    const SubmitSignin = async (e) => {
        e.preventDefault();

        await doRequest();
    };

    return (
        <div className="container">
            <h1 className="pt-4 text-center">Sign In</h1>
            <form className="pt-2 d-flex row align-items-center" onSubmit={SubmitSignin}>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                </div>
                { errors }
                <button type="submit" className="btn bg-violet btn-primary pt-2">Submit</button>
                <div className="pt-4 text-center text-primary"><a href="/signup">or Register</a></div>
                {/* <div className="pt-4 text-center text-primary"><a href="#">Forgot your password?</a></div> */}
            </form>
        </div>
    )
};