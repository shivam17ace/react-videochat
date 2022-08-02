import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routef from "../src/Routes/route"
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <Routef />
    </BrowserRouter>
, document.getElementById("root"));
