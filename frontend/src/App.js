import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axiosObject, { BASE_URL } from "./Requests";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosObject.get(BASE_URL+"/users/current-user")
        setUser(response.data);
      } catch (err) {
        console.log("User not authorized: ", err.response)
      }
    }

    getUser();
  }, []);

  return (
    <div>
      <Router>
        <Nav user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
