import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

export let stompClient = null;
const SERVER_URL = "http://localhost:8080/ws";

export const connect = (onConnected) => {
  const socket = new SockJS(SERVER_URL);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      onConnected();
    },
    onStompError: (frame) => {
      console.error("WebSocket Error:", frame.headers["message"]);
    },
  });
  stompClient.activate();
  return stompClient;
};

export const subscribeToPrivateMessages = (userId, callback) => {
  if (stompClient && stompClient.connected) {
    return stompClient.subscribe(`/topic/private.${userId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  }
};

export const sendMessageToUser = (senderId, content, recipientId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/sendToUser",
      body: JSON.stringify({ senderId, content, recipientId }),
    });
  } else {
    console.error("WebSocket is not connected.");
  }
};

export const getRecipientsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_CHAT}/recipients`, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                userId: userId,
            }
        })
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}
