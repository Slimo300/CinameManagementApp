import Link from "next/link";
import Image from "next/image";

import logo from "../statics/images/logo.png";

export default ({ user }) => {
    console.log(user);
    return (
        <nav className="bg-violet navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <Image src={logo} alt="Logo" width={250} height={50} className="d-inline-block align-text-top" />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/repertoire">Repertoire</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/pricing">Pricing</Link>
                        </li>
                    </ul>
                    { user && user.isAdmin ? <Link className="nav-item nav-link px-2" href="/admin">Admin</Link> : null }
                    { !user ? <Link className="nav-item nav-link px-2" href="/signin">Sign In</Link> : null }
                    { !user ? <Link className="nav-item nav-link px-2" href="/signup">Sign Up</Link> : null }
                    { user ? <Link className="nav-item nav-link px-2" href="/signout">Sign Out</Link> : null }
                </div>
            </div>
        </nav>
    );
}