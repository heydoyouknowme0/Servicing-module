import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import AuthService from "./services/auth.service";
import { IUser } from "./types/user.type";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import UserBoardWrapper from "./components/UserBoardWrapper";
import AdminBoard from "./components/AdminBoard";

import EventBus from "./common/EventBus";

interface State {
  showAdminBoard: boolean;
  currentUser: IUser | undefined;
}

const App: React.FC = () => {
  const [state, setState] = useState<State>({
    showAdminBoard: false,
    currentUser: undefined,
  });
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.removeAttribute("data-bs-theme");
    }
  }, []);

  const handleModeChange = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.removeAttribute("data-bs-theme");
    } else {
      document.body.setAttribute("data-bs-theme", "dark");
    }
  };
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    EventBus.on("logout", logOut);
    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setState({
      ...state,
      showAdminBoard: false,
      currentUser: undefined,
    });
  };

  const { currentUser, showAdminBoard } = state;

  const navigationItems = [
    { to: "/home", label: "Home" },
    { to: "/admin", label: "Admin Board", condition: showAdminBoard },
    { to: "/user", label: "User", condition: currentUser },
  ];

  const handleLoginSuccess = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm mb-3 border-bottom pt-3  fixed-top">
        <Link to={"/"} className="navbar-brand">
          SerMod
        </Link>
        <div className="navbar-nav mr-auto">
          {navigationItems.map(
            (item) =>
              item.condition && (
                <li className="nav-item" key={item.to}>
                  <Link to={item.to} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              )
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home" className="nav-link" onClick={logOut}>
                Logout
              </Link>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="darkModeDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Mode
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="darkModeDropdown"
            >
              <li>
                <button className="dropdown-item" onClick={handleModeChange}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={<Login onLoginConfirmed={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          {currentUser && <Route path="/profile" element={<Profile />} />}
          {currentUser && <Route path="/user" element={<UserBoardWrapper />} />}
          {showAdminBoard && <Route path="/admin" element={<AdminBoard />} />}
        </Routes>
      </div>
    </div>
  );
};

export default App;
