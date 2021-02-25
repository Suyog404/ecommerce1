import React, { Component } from "react";
import axios from 'axios'
import alertify from 'alertifyjs'
import 'alertifyjs/build/css/alertify.min.css'
import "./login.css";

export default class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
        password: "",
        confirmPassword: "",
        passworderr: "",
        confirmPassworderr: "",
      isSubmitting: false,
      isValidForm: false,
    };
  }
  componentDidMount() {
    this.id = this.props.match.params["id"];
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      () => ({
       
          [name]: value,
      }),
      () => {
        this.validateForm(name);
      }
    );
  };
  validateForm() {
    let errMsg;
     
        errMsg = this.state.password
          ? this.state.password.match(
              /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            )
            ? ""
            : "Must contain at least one numeric digit, one uppercase and one lowercase letter, and at least 8 or more characters"
          : "Required Field*";
       let passerr;
       passerr=this.state.confirmPassword
       ?this.state.password===this.state.confirmPassword
       ?""
       :'Passwords didnot match!!'
       :""
    this.setState(
      () => ({
        
          passworderr: errMsg,
confirmPassworderr:passerr        
      }),
      () => {
        const errors = Object.values(this.state.passworderr&&this.state.confirmPassworderr).filter((items) => items);
        this.setState({
          isValidForm: errors.length === 0,
        });
      }
    );
  }
  handleSubmit = async e => {
    e.preventDefault();
//  if (this.state.data.password !== this.state.data.confirmPassword) {
//       return showWarnings("Passwords didnot match");
//     }
    this.setState({
      isSubmitting: true,
    });
    // POST("/auth/reset_password/" + this.id, { password: this.state.password })
    //   .then((response) => {
    //     showInfo("Password reset successful.Please login");
    //     this.props.history.push("/");
    //   })
    //   .catch((err) => {
    //     handleError(err);
    //   })
    //   .finally(() => {
    //     this.setState({
    //       isSubmitting: false,
    //     });
    //   });
      try {
        await axios.post('http://localhost:5000/user/reset/'+ this.id,{ password: this.state.password })
       console.log(this.state.password)
        alertify.success("Password reset successful.Please login")
        localStorage.setItem('firstLogin', true)

        
        window.location.href = "/login";
    } catch (err) {
        
        this.setState({
                  isSubmitting: false,
                });
                window.location.href = "/login";

    }
  };
  render() {
    return (
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                {/* <img src="images/signin-image.jpg" alt="" /> */}
              </figure>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Reset Password</h2>
              <form
                className="register-form"
                id="login-form"
                onSubmit={this.handleSubmit}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="zmdi zmdi-lock"></i>
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
                  <strong>{this.state.passworderr}</strong>
                </p>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={this.handleChange}
                  />
                </div>
                <p className="text-danger">
                  {" "}
                  <strong>{this.state.confirmPassworderr}</strong>
                </p>
                           
                <div className="form-group form-button">
                  <button
                    disabled={!this.state.isValidForm}
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    style={{ textAlign: "center", paddingTop: "5px" }}
                  >
                    {this.state.isSubmitting ? "Resetting..." : "Reset"}
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
