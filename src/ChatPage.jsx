// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import "./App.css";

// const socket = io("http://192.168.0.116:3001");

// const ChatPage = () => {
//   const [currentRoomId, setCurrentRoomId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [typingUser, setTypingUser] = useState("");
//   const [userList, setUserList] = useState([]);

//   // Retrieve the logged-in user's ID (username) from localStorage
//   const userId = localStorage.getItem("userId");

//   const messagesEndRef = useRef(null);

//   // Fetch user list dynamically from backend
//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const response = await axios.get("http://192.168.0.116:3001/users"); // API endpoint to fetch users
//         // Filter out the logged-in user from the user list
//         const filteredUsers = response.data.filter(
//           (user) => user.username !== userId
//         );
//         setUserList(filteredUsers); // Set the filtered list
//       } catch (error) {
//         console.error("Failed to fetch user list:", error);
//       }
//     };
//     fetchUserList();
//   }, [userId]); // Ensure the list updates if userId changes

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUserId = localStorage.getItem("userId");
//       if (updatedUserId && updatedUserId !== userId) {
//         setUser(updatedUserId); // Update userId if it changes
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, [userId]);

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on("chat message", (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     // Listen for typing indicator
//     socket.on("typing", (data) => {
//       if (data.userId !== userId) {
//         setTypingUser(`${data.userId} is typing...`);
//         setTimeout(() => setTypingUser(""), 2000); // Clear after 2 seconds
//       }
//     });

//     // Listen for chat history
//     socket.on("chat history", (history) => {
//       setMessages(history);
//     });

//     return () => {
//       socket.off("chat message");
//       socket.off("typing");
//       socket.off("chat history");
//     };
//   }, []);

//   const joinRoom = (receiverId) => {
//     // Ensure consistent room ID by sorting userIds alphabetically
//     const sortedIds = [userId, receiverId].sort();
//     const newRoomId = `${sortedIds[0]}-${sortedIds[1]}`; // Consistent room ID

//     if (currentRoomId) {
//       socket.emit("leaveRoom", { roomId: currentRoomId });
//     }

//     setCurrentRoomId(newRoomId);
//     socket.emit("joinRoom", { roomId: newRoomId });
//     setMessages([]); // Clear messages on room switch
//     console.log(`Joined room: ${newRoomId}`);
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim() && currentRoomId) {
//       socket.emit("chat message", {
//         senderId: userId,
//         receiverId: currentRoomId.split("-")[1],
//         message: inputMessage,
//         roomId: currentRoomId,
//       });
//       setInputMessage(""); // Clear the input
//       console.log(
//         `Message sent from ${userId} to ${currentRoomId.split("-")[1]}`
//       );
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <div className="chat-app">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>User List</h2>
//         <ul className="user-list">
//           {userList.map((user) => (
//             <li key={user._id} onClick={() => joinRoom(user.username)}>
//               <p>Username: {user.username}</p> {/* Display user username */}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Section */}
//       <div className="chat">
//         {/* Chat Header */}
//         <div className="chat-header">
//           <h3>Logged in as: {userId}</h3>{" "}
//           {/* Dynamically show logged-in user's name */}
//         </div>

//         {/* Messages */}
//         <div className="messages">
//           <ul>
//             {messages.map((msg, index) => (
//               <li
//                 key={index}
//                 className={
//                   msg.senderId === userId ? "message-right" : "message-left"
//                 }
//               >
//                 <div className="message-content">
//                   <strong>{msg.senderId}:</strong> {msg.message}
//                 </div>
//                 <span className="timestamp">
//                   {new Date(msg.timestamp).toLocaleTimeString()}
//                 </span>
//               </li>
//             ))}
//           </ul>

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Typing Indicator */}
//         {typingUser && <div className="typing-indicator">{typingUser}</div>}

//         {/* Input */}
//         <form className="chat-input" onSubmit={sendMessage}>
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={inputMessage}
//             onChange={(e) => {
//               setInputMessage(e.target.value);
//               socket.emit("typing", { roomId: currentRoomId, userId });
//             }}
//           />
//           <button type="submit">Send</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// const socket = io("http://192.168.0.116:3001");

// const ChatPage = () => {
//   const [currentRoomId, setCurrentRoomId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [typingUser, setTypingUser] = useState("");
//   const [userList, setUserList] = useState([]);
//   const [connectionRequests, setConnectionRequests] = useState([]);

//   const navigate = useNavigate();

//   const userId = localStorage.getItem("userId");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchUserList = async () => {
//       try {
//         const response = await axios.get("http://192.168.0.116:3001/users");
//         const filteredUsers = response.data.filter(
//           (user) => user.username !== userId
//         );
//         setUserList(filteredUsers);
//       } catch (error) {
//         console.error("Failed to fetch user list:", error);
//       }
//     };

//     const fetchConnectionRequests = async () => {
//       try {
//         const response = await axios.get(
//           `http://192.168.0.116:3001/connectionRequests?receiver=${userId}`
//         );
//         setConnectionRequests(response.data);
//       } catch (error) {
//         console.error("Failed to fetch connection requests:", error);
//       }
//     };

//     fetchUserList();
//     fetchConnectionRequests();
//   }, [userId]);

//   useEffect(() => {
//     socket.on("chat message", (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     socket.on("typing", (data) => {
//       if (data.userId !== userId) {
//         setTypingUser(`${data.userId} is typing...`);
//         setTimeout(() => setTypingUser(""), 2000);
//       }
//     });

//     socket.on("chat history", (history) => {
//       setMessages(history);
//     });

//     return () => {
//       socket.off("chat message");
//       socket.off("typing");
//       socket.off("chat history");
//     };
//   }, [userId]);

//   const joinRoom = (receiverId) => {
//     const sortedIds = [userId, receiverId].sort();
//     const newRoomId = `${sortedIds[0]}-${sortedIds[1]}`;

//     if (currentRoomId) {
//       socket.emit("leaveRoom", { roomId: currentRoomId });
//     }

//     setCurrentRoomId(newRoomId);
//     socket.emit("joinRoom", { roomId: newRoomId });
//     setMessages([]);
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim() && currentRoomId) {
//       socket.emit("chat message", {
//         senderId: userId,
//         receiverId: currentRoomId.split("-")[1],
//         message: inputMessage,
//         roomId: currentRoomId,
//       });
//       setInputMessage("");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     socket.disconnect();
//     navigate("/login");
//   };

//   const sendConnectionRequest = async (receiver) => {
//     try {
//       const response = await axios.post(
//         "http://192.168.0.116:3001/sendRequest",
//         {
//           sender: userId,
//           receiver,
//         }
//       );
//       alert(response.data);
//     } catch (error) {
//       console.error("Failed to send request:", error);
//     }
//   };

//   const handleRequest = async (sender, action) => {
//     try {
//       const response = await axios.post(
//         "http://192.168.0.116:3001/handleRequest",
//         {
//           sender,
//           receiver: userId,
//           action,
//         }
//       );
//       alert(response.data);
//       if (action === "accept") {
//         setConnectionRequests((prev) =>
//           prev.filter((request) => request.sender !== sender)
//         );
//       }
//     } catch (error) {
//       console.error("Failed to handle request:", error);
//     }
//   };

//   return (
//     <>
//       <h1 className="animated-text">Bolo Chat App</h1>
//       <div className="chat-app">
//         <div className="sidebar">
//           <h2>Bolo Chat User</h2>
//           <ul className="user-list">
//             {userList.map((user) => (
//               <li
//                 key={user._id}
//                 onClick={() => joinRoom(user.username)}
//                 className={
//                   currentRoomId && currentRoomId.includes(user.username)
//                     ? "selected-user"
//                     : ""
//                 }
//               >
//                 <p>Username: {user.username}</p>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     sendConnectionRequest(user.username);
//                   }}
//                 >
//                   Send Request
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <h3>Connection Requests</h3>
//           <ul className="request-list">
//             {connectionRequests.map((request) => (
//               <li key={request.sender}>
//                 <p>{request.sender} wants to connect</p>
//                 <button onClick={() => handleRequest(request.sender, "accept")}>
//                   Accept
//                 </button>
//                 <button onClick={() => handleRequest(request.sender, "decline")}>
//                   Reject
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="chat">
//           <div className="chat-header">
//             <h3>Logged in as: {userId}</h3>
//             <button className="logout-button" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>

//           <div className="messages">
//             <ul>
//               {messages.map((msg, index) => (
//                 <li
//                   key={index}
//                   className={
//                     msg.senderId === userId ? "message-right" : "message-left"
//                   }
//                 >
//                   <div className="message-content">
//                     <strong>{msg.senderId}:</strong> {msg.message}
//                   </div>
//                   <span className="timestamp">
//                     {new Date(msg.timestamp).toLocaleTimeString()}
//                   </span>
//                 </li>
//               ))}
//             </ul>

//             <div ref={messagesEndRef} />
//           </div>

//           {typingUser && <div className="typing-indicator">{typingUser}</div>}

//           <form className="chat-input" onSubmit={sendMessage}>
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={inputMessage}
//               onChange={(e) => {
//                 setInputMessage(e.target.value);
//                 socket.emit("typing", { roomId: currentRoomId, userId });
//               }}
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatPage;

/*
graph ql chat function 

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {HANDLE_CONNECTION_REQUEST_MUTATION, SEND_CONNECTION_REQUEST,GET_USERS, GET_CONNECTION_REQUESTS, GET_ACCEPTED_CONNECTIONS , HANDLE_REQUEST, GET_CHAT_HISTORY, SEND_MESSAGE, JOIN_ROOM, LEAVE_ROOM } from "../graphql/queries";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // Import socket.io client
import "./App.css";

const ChatPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  const socket = useRef(null); // Use a ref to store the socket instance

  const { data: userListData } = useQuery(GET_USERS);
  const { data: connectionRequestsData } = useQuery(GET_CONNECTION_REQUESTS, {
    variables: { receiver: userId },
  });
  const { data: acceptedConnectionsData } = useQuery(GET_ACCEPTED_CONNECTIONS, {
    variables: { userId },
  });
  const { data: chatHistoryData } = useQuery(GET_CHAT_HISTORY, {
    variables: { roomId: currentRoomId },
  });

  const [sendConnectionRequest] = useMutation(SEND_CONNECTION_REQUEST);
  const [handleRequest] = useMutation(HANDLE_REQUEST);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [joinRoom] = useMutation(JOIN_ROOM);
  const [leaveRoom] = useMutation(LEAVE_ROOM);

  const [handleConnectionRequest] = useMutation(HANDLE_CONNECTION_REQUEST_MUTATION);

  useEffect(() => {
    if (chatHistoryData) {
      setMessages(chatHistoryData.chatHistory);
    }
  }, [chatHistoryData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection when the component mounts
    socket.current = io("http://192.168.0.116:3001"); // Connect to the server

    // Listen for incoming messages
    socket.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleUserClick = (username) => {
    setSelectedUser(username);
    // Join the chat room
    const newRoomId = `${userId}-${username}`.split("-").sort().join("-");
    setCurrentRoomId(newRoomId);
    joinRoom({ variables: { roomId: newRoomId } });
  };

  const handleRequestAction = async (senderId, action) => {
    try {
      // Call the handleConnectionRequest mutation with senderId, receiver (userId), and action (accept or decline)
      const { data } = await handleConnectionRequest({
        variables: { sender: senderId, receiver: userId, action },
      });
  
      // Display success toast with the result from the mutation
      toast.success(data.handleConnectionRequest); // Use the result from the resolver
    } catch (error) {
      console.error("Failed to handle connection request:", error.message);
      toast.error("Failed to process request");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && currentRoomId) {
      try {
        const message = {
          senderId: userId,
          receiverId: currentRoomId.split("-")[1],
          message: inputMessage,
          roomId: currentRoomId,
        };

        // Send the message using the mutation
        await sendMessage({
          variables: message,
        });

        // Emit the message to the socket server for real-time delivery
        socket.current.emit("sendMessage", message);

        setInputMessage("");
      } catch (error) {
        console.error("Failed to send message:", error.message);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`chat-app ${theme}`}>
      <h1 className="animated-text">Bolo Chat App</h1>
      <div className="sidebar">
        <h2>Bolo Chat User</h2>

        <ul className="user-list">
  {userListData?.users
    ?.filter((user) => user.username !== userId) // Filter out the current user's username
    .map((user) => {
      // Check if the current user has accepted the connection
      const isConnected = acceptedConnectionsData?.acceptedConnections?.some(
        (acceptedUser) => acceptedUser.username === user.username
      );
      
      // Check if a request has been sent or received
      const hasSentRequest = sentRequests.includes(user.username);
      const hasReceivedRequest = connectionRequestsData?.connectionRequests?.some(
        (request) => request.sender === user.username
      );

      return (
        <li key={user._id} onClick={() => handleUserClick(user.username)}>
          <p>Username: {user.username}</p>

          {isConnected ? (
            <button className="accept-btn-1" disabled>
              Request Accepted
            </button>
          ) : (
            <div>
              {hasSentRequest ? (
                <button className="request-sent" disabled>
                  Request Sent
                </button>
              ) : hasReceivedRequest ? (
                <button
                  onClick={() => handleRequestAction(user._id, "accept")}
                  className="accept-btn"
                >
                  Accept Request
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasSentRequest) {
                      toast.error("Request already sent.");
                    } else {
                      sendConnectionRequest({
                        variables: { sender: userId, receiver: user.username },
                      });
                      setSentRequests([...sentRequests, user.username]);
                    }
                  }}
                  disabled={hasSentRequest} // Disable the button if the request has been sent
                >
                  {hasSentRequest ? "Request Sent" : "Send Request"}
                </button>
              )}
            </div>
          )}
        </li>
      );
    })}
</ul>



        <h3>Connection Requests</h3>
        {connectionRequestsData?.connectionRequests?.length === 0 ? (
          <p>No connection requests.</p>
        ) : (
          connectionRequestsData?.connectionRequests?.map((request) => (
            <ul key={request.sender} className="request-list">
              <li>
                <p>{request.sender} wants to connect</p>
                <div style={{ display: "flex" }}>
                  <button
                    onClick={() => handleRequestAction(request.sender, "accept")}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.sender, "decline")}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </li>
            </ul>
          ))
        )}
      </div>

      <div className="chat">
        <div className="chat-header">
          <h3>Logged in as: {userId}</h3>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        <div className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className={msg.senderId === userId ? "message-right" : "message-left"}>
                <div className="message-content">
                  <strong>{msg.senderId}:</strong>
                  <div className="message-container">{msg.message}</div>
                </div>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
          <div ref={messagesEndRef} />
        </div>

        {typingUser && <div className="typing-indicator">{typingUser}</div>}

        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ChatPage;


*/

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./App.css";

const socket = io("https://bolochat-backendbackup-2.onrender.com");

const ChatPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // Track sent requests
  const [selectedUser, setSelectedUser] = useState(null);
  const [theme, setTheme] = useState("light"); // State for theme mode
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [visibleUsersCount, setVisibleUsersCount] = useState(8); // Initial count of visible users

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersResponse = await axios.get(
          "https://bolochat-backendbackup-2.onrender.com/users"
        );
        console.log(usersResponse.data); // Log user data to check the structure and content
        setUserList(
          usersResponse.data.filter((user) => user.username !== userId)
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUserData();
  }, []); // Fetch user data when component mounts

  console.log(acceptedConnections, "acceptedConnections");

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const requestsResponse = await axios.get(
          `https://bolochat-backendbackup-2.onrender.com/connectionRequests?receiver=${userId}`
        );
        setConnectionRequests(requestsResponse.data);
      } catch (error) {
        console.error("Failed to fetch connection requests:", error);
      }
    };

    fetchConnectionRequests();
  }, [userId]); // Fetch connection requests when userId changes

  useEffect(() => {
    const fetchAcceptedConnections = async () => {
      try {
        const connectionsResponse = await axios.get(
          `https://bolochat-backendbackup-2.onrender.com/acceptedConnections?userId=${userId}`
        );
        setAcceptedConnections(connectionsResponse.data);
      } catch (error) {
        console.error("Failed to fetch accepted connections:", error);
      }
    };

    fetchAcceptedConnections();
  }, [userId]);

  useEffect(() => {
    socket.on("acceptConnection", (userId, senderId) => {
      // If the userId or senderId matches, update the accepted connections state
      if (userId === senderId) {
        setAcceptedConnections((prev) => [...prev, senderId]);
      }
    });

    return () => {
      socket.off("acceptConnection");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Run whenever the 'messages' array changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(userList, "userList");

  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("typing", (data) => {
      if (data.userId !== userId) {
        setTypingUser(`${data.userId} is typing...`);
        setTimeout(() => setTypingUser(""), 2000);
      }
    });

    socket.on("chat history", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("chat message");
      socket.off("typing");
      socket.off("chat history");
    };
  }, [userId]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  console.log(acceptedConnections, "acceptedConnections");
  const joinRoom = (receiverId) => {
    // Check if the receiverId exists in the acceptedConnections array
    const isAccepted = acceptedConnections.some(
      (connection) => connection.user === receiverId
    );

    if (!isAccepted) {
      toast.error(
        "You can only chat with users who have accepted your request."
      );
      return;
    }

    // Proceed with joining the room
    const sortedIds = [userId, receiverId].sort();
    const newRoomId = `${sortedIds[0]}-${sortedIds[1]}`;

    // Leave the previous room if any
    if (currentRoomId) {
      socket.emit("leaveRoom", { roomId: currentRoomId });
    }

    // Join the new room
    setCurrentRoomId(newRoomId);
    socket.emit("joinRoom", { roomId: newRoomId });
    setMessages([]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && currentRoomId) {
      socket.emit("chat message", {
        senderId: userId,
        receiverId: currentRoomId.split("-")[1],
        message: inputMessage,
        roomId: currentRoomId,
      });
      setInputMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    socket.disconnect();
    navigate("/login");
  };

  const sendConnectionRequest = async (receiverId) => {
    try {
      const response = await axios.post(
        "https://bolochat-backendbackup-2.onrender.com/sendRequest",
        {
          sender: userId,
          receiver: receiverId,
        }
      );
      console.log(response.data); // Debugging the response
      toast.success(response.data);

      // Mark the request as sent by updating the sentRequests state
      const updatedSentRequests = [...sentRequests, receiverId];
      setSentRequests(updatedSentRequests);

      // Save sent requests to local storage
      localStorage.setItem("sentRequests", JSON.stringify(updatedSentRequests));
    } catch (error) {
      console.error(
        "Failed to send connection request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRequest = async (senderId, action) => {
    try {
      const response = await axios.post(
        "https://bolochat-backendbackup-2.onrender.com/handleRequest",
        {
          sender: senderId,
          receiver: userId,
          action,
        }
      );

      toast.success(response.data);

      if (action === "accept") {
        // Remove the request from the connectionRequests state
        setConnectionRequests((prev) =>
          prev.filter((request) => request.sender !== senderId)
        );

        // Update the acceptedConnections state for both users
        setAcceptedConnections((prev) => {
          if (!prev.includes(senderId)) {
            return [...prev, senderId];
          }
          return prev;
        });

        // Notify the sender about the acceptance
        socket.emit("acceptConnection", userId, senderId);

        // Update the sentRequests state to remove the accepted request
        setSentRequests((prev) =>
          prev.filter((request) => request !== senderId)
        );

        // Save the updated sentRequests and acceptedConnections to localStorage
        localStorage.setItem(
          "sentRequests",
          JSON.stringify(sentRequests.filter((request) => request !== senderId))
        );
        localStorage.setItem(
          "acceptedConnections",
          JSON.stringify([...acceptedConnections, senderId])
        );
      } else if (action === "decline") {
        // Remove the rejected request from the connectionRequests state
        setConnectionRequests((prev) =>
          prev.filter((request) => request.sender !== senderId)
        );

        // Optionally notify the sender about the rejection
        socket.emit("rejectConnection", userId, senderId);

        // Save the updated connectionRequests to localStorage
        localStorage.setItem(
          "connectionRequests",
          JSON.stringify(
            connectionRequests.filter((request) => request.sender !== senderId)
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to handle connection request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleUserClick = (username) => {
    setSelectedUser(username); // Track the selected user
    joinRoom(username); // Call your joinRoom function with the selected user
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference
  };

  const handleShowMore = () => {
    setVisibleUsersCount((prevCount) => prevCount + 3);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setVisibleUsersCount(8); // Reset visible users count when searching
  };

  // Filter users based on the search query
  const filteredUsers = userList.filter((user) =>
    user.username.toLowerCase().includes(searchQuery)
  );

  // Slice the filtered users based on visibleUsersCount
  const visibleUsers = filteredUsers.slice(0, visibleUsersCount);

  return (
    <>
      <h1 className="animated-text">Bolo Chat App</h1>
      <div className={`chat-app ${theme}`}>
        <div className="sidebar">
          <h2>Bolo Chat User</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
       <ul className="user-list">
        {visibleUsers.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user.username)}
            className={
              selectedUser === user.username ? "selected-user" : ""
            }
          >
            <p>Username: {user.username}</p>
            {/* Check if the user is in the accepted connections */}
            {acceptedConnections.some(
              (connection) => connection.user === user.username
            ) ? (
              <button className="accept-btn-1" disabled>
                Request Accepted
              </button>
            ) : (
              <button
                className="send-request-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (sentRequests.includes(user.username)) {
                    setTimeout(() => {
                      toast.error("Request already sent.");
                    }, 500);
                  } else {
                    sendConnectionRequest(user.username);
                  }
                }}
              >
                {sentRequests.includes(user.username)
                  ? "Request Sent"
                  : "Send Request"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* Show More Button */}
      {visibleUsersCount < filteredUsers.length && (
        <button className="show-more-btn" onClick={handleShowMore}>
          Show More
        </button>
      )}

          <h3>Connection Requests</h3>
          {connectionRequests.map((request) => (
            <ul className="request-list">
              <li key={request.sender}>
                <p>{request.sender} wants to connect</p>
                <div style={{ display: "flex" }}>
                  <button
                    onClick={() => handleRequest(request.sender, "accept")}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                  <br />
                  <button
                    onClick={() => handleRequest(request.sender, "decline")}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </li>
            </ul>
          ))}
        </div>

        <div className="chat">
          <div className="chat-header">
            <h3>Logged in as: {userId}</h3>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>

          <div className="messages">
            <ul>
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={
                    msg.senderId === userId ? "message-right" : "message-left"
                  }
                >
                  <div className="message-content">
                    <strong>{msg.senderId}:</strong>
                    <div className="message-container">{msg.message}</div>
                  </div>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>

            <div ref={messagesEndRef} />
          </div>

          {typingUser && <div className="typing-indicator">{typingUser}</div>}

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                socket.emit("typing", { roomId: currentRoomId, userId });
              }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ChatPage;
