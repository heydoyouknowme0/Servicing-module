import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import AuthService from "./services/auth.service";
import { IUser } from "./types/user.type";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import UserBoardWrapper from "./components/UserBoard/UserBoardWrapper";
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
    <div className="pt-sm-5 vh-100 d-flex flex-column">
      {/* <button
        className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
        id="bd-theme"
        type="button"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        aria-label="Toggle theme (auto)"
      >
        <svg className="bi my-1 theme-icon-active" width="1em" height="1em">
          <use href="#circle-half"></use>
        </svg>
        <span className="visually-hidden" id="bd-theme-text">
          Toggle theme
        </span>
      </button> */}
      <nav
        className="navbar sticky-top  mx-sm-5 px-xl-4 mb-sm-5 py-xl-3 navbar-expand-sm bg-body-tertiary rounded d-print-none"
        aria-label="Thirteenth navbar example"
      >
        <Link to={"/"} className="navbar-brand col-sm-auto ms-2 pe-0 me-0">
          SerMod
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample11"
          aria-controls="navbarsExample11"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ marginRight: "78px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="container-fluid ">
          <div
            className="collapse navbar-collapse d-sm-flex"
            id="navbarsExample11"
          >
            <ul className="navbar-nav col-sm-auto ">
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
              {currentUser ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>
        <button
          className="btn position-absolute top-0 end-0 mt-2 me-xl-4 mt-xl-3 me-2"
          style={{ backgroundColor: "#6528e0", color: "white" }}
          onClick={handleModeChange}
        >
          {isDarkMode ? "Dark" : "Light"}
        </button>
      </nav>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLoginConfirmed={handleLoginSuccess} />}
        />
        <Route path="/register" element={<Register />} />
        {currentUser && <Route path="/profile" element={<Profile />} />}
        {currentUser && (
          <Route
            path="/user"
            element={<UserBoardWrapper showAdminBoard={showAdminBoard} />}
          />
        )}
        {showAdminBoard && <Route path="/admin" element={<AdminBoard />} />}
      </Routes>
    </div>
  );
};

export default App;
