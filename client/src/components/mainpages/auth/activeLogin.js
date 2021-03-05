import React, { Component } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const defaultForm = {
  email: "",
  password: "",
};
export default class ActiveLoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        ...defaultForm,
      },
      error: {
        ...defaultForm,
      },
      isSubmitting: false,
      isValidForm: false,
      remember_me: false,
    };
  }

  handleChange = (e) => {
    let { type, name, value, checked } = e.target;
    if (type === "checkbox") {
      return this.setState({
        [name]: checked,
      });
    }
    this.setState(
      (preState) => ({
        data: {
          ...preState.data,
          [name]: value,
        },
      }),
      () => {
        this.validateForm(name);
      }
    );
  };
  validateForm(fieldname) {
    let errMsg = this.state.data[fieldname] ? "" : `${fieldname} is required`;
    this.setState(
      (preState) => ({
        error: {
          ...preState.error,
          [fieldname]: errMsg,
        },
      }),
      () => {
        const errors = Object.values(this.state.error).filter((err) => err);
        this.setState({
          isValidForm: errors.length === 0,
        });
      }
    );
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isSubmitting: true,
    });

    console.log(this.state.data);

    try {
      await axios.post("http://localhost:5000/user/activeLogin", this.state.data);
      console.log(this.state.data);
      alertify.success("Hello!!");
      localStorage.setItem("firstLogin", true);
      localStorage.setItem("email", this.state.data.email);
      // localStorage.setItem("password", this.state.data.password);
      localStorage.setItem("remember_me", this.state.remember_me);
      window.location.href = "/";
    } catch (err) {
    //   alertify.error("Something went wrong");
    //   console.log("error is>>", err);
      this.setState({
        isSubmitting: false,
      });
      window.location.href = "/";

    }
  };
  render() {
    return (
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src="images/signin-image.jpg" alt="" />
              </figure>
              {/* <Link to="/register" className="signup-image-link">
                Create an account
              </Link> */}
            </div>

            <div className="signin-form">
              <h2 className="form-title">Please Login</h2>
              <form
                className="register-form"
                id="login-form"
                onSubmit={this.handleSubmit}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="email">
                    {/* <i className="zmdi zmdi-account material-icons-name"></i> */}
                  </label>
                  <input
                    value={this.state.data.email}
                    // {localStorage.getItem('email')===null?"":localStorage.getItem('email')}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Your email"
                    onChange={this.handleChange}
                  />
                </div>
                <p className="text-danger">
                  {" "}
                  <strong>{this.state.error.email}</strong>
                </p>

                <div className="form-group">
                  <label htmlFor="password">
                    {/* <i className="zmdi zmdi-lock"></i> */}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                  />
                </div>
                <p className="text-danger">
                  {" "}
                  <strong>{this.state.error.password}</strong>
                </p>
                <div className="form-group">
                  <label htmlFor="activeCode">
                    {/* <i className="zmdi zmdi-lock"></i> */}
                  </label>
                  <input
                    type="text"
                    name="activeCode"
                    id="activeCode"
                    placeholder="Activation Code"
                    onChange={this.handleChange} autocomplete="false"
                  />
                </div>
                <p className="text-danger">
                  {" "}
                  <strong>{this.state.error.code}</strong>
                </p>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="remember_me"
                    id="remember_me"
                    className="agree-term"
                    checked={this.state.remember_me}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="remember_me" className="label-agree-term">
                    <span>
                      <span></span>
                    </span>
                    Remember me
                  </label>
                </div>
                <div className="form-group">
                  <Link to="/forgot" className="label-agree-term">
                    Forgot Password?
                  </Link>
                </div>
                <div className="form-group form-button">
                  <button
                    disabled={!this.state.isValidForm}
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    style={{ textAlign: "center", paddingTop: "5px" }}
                  >
                    {this.state.isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
