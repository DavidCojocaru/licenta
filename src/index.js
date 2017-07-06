import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import MainMenu from "./MainMenu";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={MainMenu} />
  </BrowserRouter>,
  document.getElementById("root")
);
