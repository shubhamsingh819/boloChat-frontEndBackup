import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    users {
      _id
      username
    }
  }
`;

export const GET_CHAT_HISTORY_QUERY = gql`
  query GetChatHistory($roomId: String!) {
    getChatHistory(roomId: $roomId) {
      senderId
      message
    }
  }
`;

export const TYPING_SUBSCRIPTION = gql`
  subscription Typing($roomId: String!) {
    typing(roomId: $roomId) {
      userId
    }
  }
`;

export const GET_CONNECTION_REQUESTS = gql`
  query GetConnectionRequests($receiver: ID!) {
    connectionRequests(receiver: $receiver) {
      sender
      receiver
    }
  }
`;

export const GET_ACCEPTED_CONNECTIONS = gql`
  query GetAcceptedConnections($userId: ID!) {
    acceptedConnections(userId: $userId) {
      username
    }
  }
`;

export const SEND_CONNECTION_REQUEST = gql`
  mutation SendConnectionRequest($sender: ID!, $receiver: ID!) {
    sendConnectionRequest(sender: $sender, receiver: $receiver)
  }
`;

export const HANDLE_REQUEST = gql`
  mutation HandleRequest($sender: ID!, $receiver: ID!, $action: String!) {
    handleRequest(sender: $sender, receiver: $receiver, action: $action)
  }
`;

export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($roomId: ID!) {
    chatHistory(roomId: $roomId) {
      senderId
      message
      timestamp
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: String!, $receiverId: String!, $message: String!, $roomId: String!) {
    sendMessage(
      senderId: $senderId
      receiverId: $receiverId
      message: $message
      roomId: $roomId
    ) {
      senderId
      receiverId
      message
      roomId
      timestamp
    }
  }
`;


export const JOIN_ROOM = gql`
  mutation JoinRoom($roomId: ID!) {
    joinRoom(roomId: $roomId)
  }
`;

export const LEAVE_ROOM = gql`
  mutation LeaveRoom($roomId: ID!) {
    leaveRoom(roomId: $roomId)
  }
`;


export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $pin: String!) {
    signup(username: $username, pin: $pin) {
      success
      message
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $pin: String!) {
    login(username: $username, pin: $pin) {
      username
      message
      success
    }
  }
`;

export const HANDLE_CONNECTION_REQUEST_MUTATION = gql`
  mutation HandleConnectionRequest($sender: String!, $receiver: String!, $action: String!) {
    handleConnectionRequest(sender: $sender, receiver: $receiver, action: $action)
  }
`;


export const GET_MESSAGES = gql`
  query GetMessages($senderId: String!, $receiverId: String!) {
    getMessages(senderId: $senderId, receiverId: $receiverId) {
      senderId
      receiverId
      message
      timestamp
    }
  }
`;