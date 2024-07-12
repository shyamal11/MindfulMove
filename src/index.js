import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "remixicon/fonts/remixicon.css";
import "aos/dist/aos.css";
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from "./component/AuthContextProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
