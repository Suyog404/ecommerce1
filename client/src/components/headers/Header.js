import React, { useContext, useState, useHistory } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/menu.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import "./header.css";

function Header() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);
  //   const [history]=useHistory();

  const logoutUser = async () => {
    // let keysToRemove = ["password", "token"];

var item = localStorage.getItem("remember_me");
item
  ? window.location.href = "/"

  : localStorage.clear();
    await axios.get("/user/logout");
    window.location.href = "/";

   

    // history.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
          <Link className="nav-link" to="/create_product">
            Create Product
          </Link>
        </li>
        <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
          <Link className="nav-link" to="/category">
            Categories
          </Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
          <Link className="nav-link" to="/history">
            History
          </Link>
        </li>
        <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
          <Link className="nav-link" to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    // <header>
    //     <div className="menu" onClick={() => setMenu(!menu)}>
    //         <img src={Menu} alt="" width="30" />
    //     </div>

    //     <div className="logo">
    //         <h1>

    //             <Link to="/">{isAdmin ? 'Hello Admin' : 'Sports And Fitness'}</Link>
    //         </h1>
    //     </div>

    //     <ul style={styleMenu}>
    //         <li><Link to="/">{isAdmin ? 'Products' : 'Shop'}</Link></li>

    //         {isAdmin && adminRouter()}

    //         {
    //             isLogged ? loggedRouter() : <li><Link to="/login">Login ✥ Register</Link></li>
    //         }

    //         <li onClick={() => setMenu(!menu)}>
    //             <img src={Close} alt="" width="30" className="menu" />
    //         </li>

    //     </ul>

    //     {
    //         isAdmin ? ''
    //         :<div className="cart-icon">
    //             <span>{cart.length}</span>
    //             <Link to="/cart">
    //                 <img src={Cart} alt="" width="30" />
    //             </Link>
    //         </div>
    //     }

    // </header>
    <div className="hero-anime">
      <div
        className="navigation-wrap bg-light start-header start-style"
        id="navigation-wrap"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link className="navbar-brand" to="#" target="_blank">
                  <p className="title">
                    {" "}
                    {isAdmin ? "Hello Admin!!!" : "Sports&Fitness"}
                  </p>
                </Link>

                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ml-auto py-4 py-md-0">
                    {" "}
                    <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4 active">
                      <Link
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        to="/"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {isAdmin ? "Products" : "Shop"}
                      </Link>
                    </li>
                    {isAdmin && adminRouter()}
                    {/* <li > */}
                    {/* <Link
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        to="#"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      > */}
                    {isLogged ? (
                      loggedRouter()
                    ) : (
                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link to="/login" className="nav-link ">
                          Login ✥ Register
                        </Link>{" "}
                      </li>
                    )}
                    {/* </Link> */}
                    {/* <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <Link
                        className="nav-link"
                        onClick={() => logout(this.props.history)}
                        to="#"
                      >
                        Logout
                      </Link>
                    </li> */}
                  </ul>
                  {isAdmin ? (
                    ""
                  ) : (
                    <div className="cart-icon">
                      <span>{cart.length}</span>
                      <Link
                        className="nav-item pl-4 pl-md-0 ml-0 ml-md-4"
                        to="/cart"
                      >
                        <img src={Cart} alt="" width="30" />
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
