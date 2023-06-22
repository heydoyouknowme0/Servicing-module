<>
  {/* // import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// import { useState } from "react";
// import Mainpage from "./Mainpage";
// import Dashboard from "./Dashboard";
// const Header = () => {
//   const [isMainpage, setIsMainpage] = useState(true);
//   return (
//     <>
//       <BrowserRouter>
//         <nav className="navbar navbar-expand-lg mb-3 border-bottom fixed-top">
//           <div className="container">
//             <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start">
//               <a
//                 href="/"
//                 className="d-flex align-items-center mb-2 mb-sm-0 link-body-emphasis text-decoration-none"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="32"
//                   height="32"
//                   fill="currentColor"
//                   className="bi bi-buildings me-1"
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022ZM6 8.694 1 10.36V15h5V8.694ZM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15Z" />
//                   <path d="M2 11h1v1H2v-1Zm2 0h1v1H4v-1Zm-2 2h1v1H2v-1Zm2 0h1v1H4v-1Zm4-4h1v1H8V9Zm2 0h1v1h-1V9Zm-2 2h1v1H8v-1Zm2 0h1v1h-1v-1Zm2-2h1v1h-1V9Zm0 2h1v1h-1v-1ZM8 7h1v1H8V7Zm2 0h1v1h-1V7Zm2 0h1v1h-1V7ZM8 5h1v1H8V5Zm2 0h1v1h-1V5Zm2 0h1v1h-1V5Zm0-2h1v1h-1V3Z" />
//                 </svg>
//               </a>

//               <ul className="nav col-12 col-sm-auto me-sm-auto mb-2 justify-content-center mb-md-0">
//                 <li>
//                   <Link
//                     className="btn btn-primary"
//                     role="button"
//                     to={isMainpage ? "/Dashboard" : "/"}
//                     onClick={() => {
//                       setIsMainpage(!isMainpage);
//                     }}
//                   >
//                     {isMainpage ? "Mainpage" : "Dashboard"}
//                   </Link>
//                 </li>
//               </ul>
//               <li className="nav-item dropdown">
//                 <a
//                   href="#"
//                   className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   <img
//                     src="https://github.com/mdo.png"
//                     alt="mdo"
//                     width="32"
//                     height="32"
//                     className="rounded-circle"
//                   />
//                 </a>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end"
//                   aria-labelledby="navbarDropdown"
//                 >
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Action
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Another action
//                     </a>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Something else here
//                     </a>
//                   </li>
//                 </ul>
//               </li>
//             </div>
//           </div>
//         </nav>
//         <Routes>
//           <Route path="/" element={<Mainpage />} />
//           <Route path="/Dashboard" element={<Dashboard />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// };

// export default Header; */}
</>;
import "./header.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Mainpage from "./Mainpage";
import Dashboard from "./Dashboard";

const Header = () => {
  const [isMainpage, setIsMainpage] = useState(false);
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

  return (
    <>
      <BrowserRouter>
        <nav
          className="navbar navbar-expand-sm mb-3 border-bottom pt-3  fixed-top"
          id={isDarkMode ? "navdark" : "navlight"}
        >
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start">
              <a
                href="/"
                className="d-flex align-items-center mb-2 mb-sm-0 link-body-emphasis text-decoration-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-buildings me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022ZM6 8.694 1 10.36V15h5V8.694ZM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15Z" />
                  <path d="M2 11h1v1H2v-1Zm2 0h1v1H4v-1Zm-2 2h1v1H2v-1Zm2 0h1v1H4v-1Zm4-4h1v1H8V9Zm2 0h1v1h-1V9Zm-2 2h1v1H8v-1Zm2 0h1v1h-1v-1Zm2-2h1v1h-1V9Zm0 2h1v1h-1v-1ZM8 7h1v1H8V7Zm2 0h1v1h-1V7Zm2 0h1v1h-1V7ZM8 5h1v1H8V5Zm2 0h1v1h-1V5Zm2 0h1v1h-1V5Zm0-2h1v1h-1V3Z" />
                </svg>
              </a>
              <Link
                className="btn btn-primary"
                role="button"
                to={isMainpage ? "/" : "/Dashboard"}
                onClick={() => {
                  setIsMainpage(!isMainpage);
                }}
              >
                {isMainpage ? "Mainpage" : "Dashboard"}
              </Link>
            </div>
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
                    <button
                      className="dropdown-item"
                      onClick={handleModeChange}
                    >
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Header;
