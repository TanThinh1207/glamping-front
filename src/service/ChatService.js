import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

let activeClient = null;
const getAccessToken = () => localStorage.getItem("accessToken");

export const connect = () => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS(`${import.meta.env.VITE_WEB_SOCKET}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`, // Attach token to WebSocket
      },
      onConnect: () => {
        activeClient = client;
        resolve(client);
      },
      onStompError: (frame) => reject(frame),
      onWebSocketError: (error) => reject(error),
    });
    client.activate();
  });
};

export const subscribeToPrivateMessages = (userId, callback) => {
  if (activeClient?.connected) {
    return activeClient.subscribe(`/topic/private.${userId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  }
  return null;
};

export const sendMessageToUser = (senderId, content, recipientId) => {
  if (activeClient?.connected) {
    activeClient.publish({
      destination: "/app/sendToUser",
      body: JSON.stringify({ senderId, content, recipientId }),
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Attach token to messages
      },
    });
  } else {
    console.error("WebSocket is not connected.");
  }
};

export const getRecipientsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_CHAT}/recipients`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`, // Attach token to API requests
        },
        params: { userId },
        validateStatus: (status) => status === 200 || status === 404,
      }
    );

    return response.status === 200 ? response.data : [];
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return [];
  }
};
