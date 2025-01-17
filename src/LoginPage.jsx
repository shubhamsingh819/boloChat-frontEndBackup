/*

graph ql login function 

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/queries"; // Import the mutation
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./LoginPage.css"; // Import the CSS file

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  // GraphQL Mutation hook for login
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    // Check if the user is already logged in
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser(storedUserId); // Set the user in parent state
      navigate("/chat"); // Redirect to the chat page
    }
  }, [navigate, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, pin } });
  
      // Store the username in localStorage
      localStorage.setItem("userId", data.login.username);
  
      // Set the user in the parent component (App) if needed
      setUser(data.login.username);
  
      toast.success(`${data.login.message} Redirecting to chat page...`);
      setTimeout(() => {
        navigate("/chat");
      }, 1000); // Redirect after 1 second
    } catch (err) {
      console.error(err, "error");
      toast.error(err.message || "Login failed.");
    }
  };
  

  const handleSignupRedirect = () => {
    navigate("/"); // Redirect to signup page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="animated-text">Bolo Chat Login</h1>
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
            // Allow only numeric input and limit to 4 characters
            if (/^\d{0,4}$/.test(value)) {
              setPin(value);
            }
          }}
          maxLength="4"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <span onClick={handleSignupRedirect} className="signup-button">
              Sign Up
            </span>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;

*/


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./LoginPage.css"; // Import the CSS file

const LoginPage = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUser(storedUserId); // Set the user in parent state
            navigate("/chat"); // Redirect to the chat page
        }
    }, [navigate, setUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://bolochat-backendbackup-2.onrender.com/login", { username, pin });
            console.log(response, "response");
        
            // Store the username in localStorage
            localStorage.setItem("userId", response.data.username);

            // Set the user in the parent component (App) if needed
            setUser(response.data.username);

            toast.success("loggedIn successful! Redirecting to chatPage...");
            setTimeout(() => {
              navigate("/chat");
            }, 1000); // Redirect after 3 seconds
        } catch (error) {
            console.log(error,"error")
              toast.error(error.response.data.error);
        }
    };

    const handleSignupRedirect = () => {
        navigate("/"); // Redirect to signup page
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
            <h1 className="animated-text">Bolo Chat Login</h1>
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
                        // Allow only numeric input and limit to 4 characters
                        if (/^\d{0,4}$/.test(value)) {
                          setPin(value);
                        }
                      }}
                      maxLength="4"
                    required
                />
                <button type="submit">Login</button>
                <div className="signup-link">
                <p>Don't have an account? 
                    <span onClick={handleSignupRedirect} className="signup-button"> Sign Up</span>
                </p>
            </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;
