import React, { useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader"; // Assuming Loader is a separate component
import "./usersignup.css";
import { useNavigate } from "react-router-dom";

const UserSignUp = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // Form data
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  // Error states
  const [signUpErrors, setSignUpErrors] = useState({});
  const [signInErrors, setSignInErrors] = useState({});

  // Loading states for each form
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!signUpData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!signUpData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(signUpData.email)) {
      errors.email = "Invalid email address";
    }
    if (!signUpData.password) {
      errors.password = "Password is required";
    } else if (signUpData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setSignUpErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSignUpLoading(true);
      try {
        const response = await fetch("http://localhost:5000/users/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: signUpData.name,
            email: signUpData.email,
            password: signUpData.password,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success("User created successfully! Please log in.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
            transition: Slide,
          });
          setRightPanelActive(false);
          setSignUpData({ name: "", email: "", password: "" });
        } else {
          toast.error(result.message || "Signup failed", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
            transition: Slide,
          });
        }
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error("An error occurred during signup.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
          transition: Slide,
        });
      } finally {
        setIsSignUpLoading(false);
      }
    }
  };

  // Handle Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!signInData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(signInData.email)) {
      errors.email = "Invalid email address";
    }
    if (!signInData.password) {
      errors.password = "Password is required";
    }

    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSignInLoading(true);
      try {
        const response = await fetch("http://localhost:5000/users/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signInData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success("Logged in successfully!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
            transition: Slide,
          });
          // Save token or user details here if needed
          // Redirect to the browsing page after a brief delay
          setTimeout(() => {
            navigate("/browse");
          }, 1100);
        } else {
          toast.error(result.message || "Login failed", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        }
      } catch (error) {
        console.error("Sign in error:", error);
        toast.error("An error occurred during login.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
          transition: Slide,
        });
      } finally {
        setIsSignInLoading(false);
      }
    }
  };

  return (
    <div className="usersignup-root">
      <div className="usersignup-main">
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />

        <div
          className={`usersignup-container ${
            rightPanelActive ? "right-panel-active" : ""
          }`}
        >
          {/* Sign Up Form */}
          <div
            className={`usersignup-form-container usersignup-sign-up-container ${
              rightPanelActive ? "active" : ""
            }`}
          >
            <form onSubmit={handleSignUpSubmit}>
              <h1>Create Account</h1>
              <div>___________________________________</div>
              <input
                type="text"
                placeholder="Name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, name: e.target.value })
                }
                className={signUpErrors.name ? "error" : ""}
              />
              {signUpErrors.name && (
                <span className="error-message">{signUpErrors.name}</span>
              )}

              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
                className={signUpErrors.email ? "error" : ""}
              />
              {signUpErrors.email && (
                <span className="error-message">{signUpErrors.email}</span>
              )}

              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                className={signUpErrors.password ? "error" : ""}
              />
              {signUpErrors.password && (
                <span className="error-message">{signUpErrors.password}</span>
              )}

              <input
                type="phone"
                placeholder="Contact No."
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
              />

              <button type="submit" disabled={isSignUpLoading}>
                {isSignUpLoading ? <Loader /> : "Sign Up"}
              </button>

              {/* Switch Link for Small Screens */}
              <p className="switch-link">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setRightPanelActive(false)}
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>

          {/* Sign In Form */}
          <div
            className={`usersignup-form-container usersignup-sign-in-container ${
              !rightPanelActive ? "active" : ""
            }`}
          >
            <form onSubmit={handleSignInSubmit}>
              <h1>Sign in</h1>
              <div>___________________________________</div>
              <input
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) =>
                  setSignInData({ ...signInData, email: e.target.value })
                }
                className={signInErrors.email ? "error" : ""}
              />
              {signInErrors.email && (
                <span className="error-message">{signInErrors.email}</span>
              )}

              <input
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
                }
                className={signInErrors.password ? "error" : ""}
              />
              {signInErrors.password && (
                <span className="error-message">{signInErrors.password}</span>
              )}

              <a href="#">Forgot your password?</a>
              <button type="submit" disabled={isSignInLoading}>
                {isSignInLoading ? <Loader /> : "Sign In"}
              </button>

              {/* Switch Link for Small Screens */}
              <p className="switch-link">
                Don't have an account?{" "}
                <button type="button" onClick={() => setRightPanelActive(true)}>
                  Sign Up
                </button>
              </p>
            </form>
          </div>

          {/* Overlay */}
          <div className="usersignup-overlay-container">
            <div className="usersignup-overlay">
              <div className="usersignup-overlay-panel usersignup-overlay-left">
                <h1>Already have an account ? </h1>
                <p>
                  To keep connected with us please login with your personal
                  info...
                </p>
                <button
                  className="usersignup-ghost"
                  onClick={() => setRightPanelActive(false)}
                  type="button"
                  id="login-button"
                >
                  Sign In
                </button>
              </div>
              <div className="usersignup-overlay-panel usersignup-overlay-right">
                <h1>Don't have an account?</h1>
                <p>
                  Enter your personal details and start your journey with us...
                </p>
                <button
                  className="usersignup-ghost"
                  onClick={() => setRightPanelActive(true)}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
