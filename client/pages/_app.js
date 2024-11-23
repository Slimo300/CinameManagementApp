import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";
import { UserProvider } from "../hooks/use-user";
import Nav from "../components/nav";
import "../statics/css/styles.css";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <UserProvider user={currentUser}>
        <Head>
            <title>Spell Cinema</title>
        </Head>
        <Nav user={ currentUser } />
        <Component { ...pageProps } />
    </UserProvider>
};
 
AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx);
    let userData = {};
    try {
        const response = await client.get("/api/users/current-user");
        userData = response.data;
    } catch (err) {
        console.log(err);
    }
    let pageProps = {};
    if (Component.getInitialProps) {
        try {
            pageProps = await Component.getInitialProps(ctx);
        } catch (err) {
        }
    }
    return {
        pageProps,
        ...userData
    }
};

export default AppComponent;