import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ChatPage from "./ChatPage";
import './App.css';  // CSS for responsiveness

// Ensure that App is wrapped with Router at the root level
function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Passing navigate to SignupPage through Router context */}
                    <Route path="/" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/chat" element={user ? <ChatPage user={user} /> : <LoginPage setUser={setUser} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
