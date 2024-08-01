
import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter} from "react-router-dom";
import App from "App";
import '@fontsource/inter';


// Soft UI Dashboard React Context Provider
import { PhotoLabContextProvider } from "context";
import {LoginProvider} from "./context/loggingConxtext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <PhotoLabContextProvider >
        <LoginProvider>
                <App />
        </LoginProvider>
    </PhotoLabContextProvider >
  </HashRouter>
);
