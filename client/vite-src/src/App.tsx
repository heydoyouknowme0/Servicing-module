import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
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
  showAdminBoard?: boolean;
  currentUser: IUser | undefined;
}

const App: React.FC = () => {
  const [state, setState] = useState<State>({
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
        showAdminBoard: user.roles.includes("ROLE_ADMIN")
          ? true
          : user.roles.includes("ROLE_SERVICER")
          ? false
          : undefined,
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
      showAdminBoard: undefined,
      currentUser: undefined,
    });
  };

  const { currentUser, showAdminBoard } = state;

  const navigationItems = [
    { to: "/home", label: "Home" },
    { to: "/admin", label: "Request", condition: showAdminBoard },
    { to: "/user", label: "Dashboard", condition: currentUser },
  ];

  const handleLoginSuccess = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN")
          ? true
          : user.roles.includes("ROLE_SERVICER")
          ? false
          : undefined,
      });
    }
  };

  return (
    <div className="pt-sm-3 pt-md-5 vh-100 d-flex flex-column d-print-none">
      <Navbar
        sticky="top"
        expand="sm"
        bg="body-tertiary"
        variant="light"
        className="mx-md-5 mx-sm-2 px-xl-4 mb-sm-5 py-xl-3 navbar-expand-sm rounded d-print-none"
      >
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand col-sm-auto ms-2 pe-0 me-0"
        >
          ServicingModule
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarNav"
          style={{ marginRight: "78px" }}
        />
        <Container fluid>
          <Navbar.Collapse id="navbarNav">
            <Nav className="navbar-nav col-sm-5 col-md-auto">
              {navigationItems.map(
                (item) =>
                  item.condition && (
                    <Nav.Item key={item.to}>
                      <Nav.Link as={Link} to={item.to}>
                        {item.label}
                      </Nav.Link>
                    </Nav.Item>
                  )
              )}
              {currentUser ? (
                <>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/profile">
                      {currentUser.username}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/home" onClick={logOut}>
                      Logout
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link as={Link} to="/register">
                      Sign Up
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>

        <Button
          className="btn position-absolute top-0 end-0 mt-2 me-xl-4 mt-xl-3 me-2"
          style={{ backgroundColor: "#6528e0", color: "white" }}
          onClick={handleModeChange}
        >
          {isDarkMode ? "Dark" : "Light"}
        </Button>
      </Navbar>

      <Routes>
        <Route path="*" element={<Home />} />
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
