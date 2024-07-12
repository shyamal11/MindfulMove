import React, { useEffect, useContext } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "./App.css"; // Ensure your global styles are imported correctly
import Footer from "./UI/Footer";
import Header from "./component/Header";
import AllRoutes from "./component/AllRoutes";
import Bot from "./component/bot";
import Login from "./UI/LogIn/Login";
import { AuthContext } from "./component/AuthContextProvider";
import Home from "./UI/Home"


function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Header />
      <AllRoutes /> 
      <Bot />
      <Footer />
    </div>
  );
}

export default App;
