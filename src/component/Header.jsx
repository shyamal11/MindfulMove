import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import roundImage from '../assets/img/Health___Fitness.png';
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContextProvider";
import AuthModal from "./modal";

const nav__links = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/programs",
    display: "Programs",
  },
  {
    path: "/profile",
    display: "Track your fitness",
  },
  {
    path: "#", // Placeholder for the "Ask Help" link
    display: "Need Assistance?",
  },
];

const Header = ({ toggleBot }) => {
  const { logout, user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const headerFunc = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add("sticky__header");
    } else {
      headerRef.current.classList.remove("sticky__header");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", headerFunc);

    return () => window.removeEventListener("scroll", headerFunc);
  }, []);

  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === "logout-event") {
        logout();
        navigate('/'); // Redirect to the home page after logout
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [logout, navigate]);

  const handleLogOut = () => {
    localStorage.setItem("logout-event", Date.now());
    logout();
    // Redirect to the home page after logout
  };

  const handleLogIn = () => {
    setIsModalOpen(true);
  };

  const handleAskHelp = (e) => {
    e.preventDefault(); // Prevent default link behavior
    toggleBot(); // Open the bot window
  };

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="container">
          <div className="nav__wrapper">
            <div className="logo">
              <div className="logo__img">
                <img src={roundImage} alt="Health and Fitness Logo" />
              </div>
              <h2>MindfulMove</h2>
            </div>
            <div className="navigation">
              <ul className="menu">
                {nav__links.map((item) => (
                  <li key={item.path} className="nav__item">
                    {item.path === "#" ? (
                      <a href={item.path} onClick={handleAskHelp}>
                        {item.display}
                      </a>
                    ) : (
                      <NavLink className="nav__item" to={item.path}>
                        {item.display}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav__right">
              {user && <p className="nav__item"> {user.username} </p>}

              {user ? (
                <button className="register__btn" onClick={handleLogOut}>
                  Log Out
                </button>
              ) : (
                <button className="register__btn" onClick={handleLogIn}>
                  Log In
                </button>
              )}
              <span className="mobile__menu">
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
