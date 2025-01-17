/*
graph ql signup function 

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../graphql/queries"; // Import your mutation
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignupPage.css";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits.");
      return;
    }
    try {
      const { data } = await signup({ variables: { username, pin } });
      if (data.signup.success) {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.signup.message || "Signup failed.");
      }
    } catch (err) {
      toast.error(error.message || "Signup failed.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1 className="animated-text">Bolo Chat Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </button>
        <div className="signup-link">
          <p>
            Already have an account?{" "}
            <span onClick={handleLoginRedirect} className="signup-button">
              Login
            </span>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;

*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./SignupPage.css"; // Import the CSS file

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits.");
      return;
    }
    try {
      await axios.post("https://bolochat-backendbackup-2.onrender.com/signup", { username, pin });
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Redirect after 3 seconds
    } catch (error) {
      toast.error("Username already exists.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to signup page
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1 class="animated-text">Bolo Chat Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,4}$/.test(value)) {
              setPin(value);
            }
          }}
          maxLength="4"
          required
        />

        <button type="submit">Signup</button>

        <div className="signup-link">
          <p>
            Allready have an account?
            <span onClick={handleLoginRedirect} className="signup-button">
              {" "}
              LoggedIn
            </span>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
