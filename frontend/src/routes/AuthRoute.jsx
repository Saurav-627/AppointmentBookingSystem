import React, { useState } from "react";
import Login from "../entities/user/Login";
import Home from "../entities/user/Home";

const AuthRoute = (props) => {
  const phone = localStorage.getItem("phone")
    ? localStorage.getItem("phone")
    : null;

  return phone ? props.NextComponent: <Login />;
};

export default AuthRoute;
