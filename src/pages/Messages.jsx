import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  Send,
  UserCircle2,
  MessageCircle,
  Search
} from "lucide-react";
import { connect, sendMessageToUser, subscribeToPrivateMessages, getRecipientsByUserId } from "../service/ChatService";
import { useUser } from "../context/UserContext";
import { fetchUserList, fetchUserData } from "../service/UserService";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

function Messages() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [recipientData, setRecipientData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, recipientId, scrollToBottom]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const [users, chatHistory] = await Promise.all([
          fetchUserList(),
          getRecipientsByUserId(userId)
        ]);

        setUserList(users);
        setChatHistoryList(chatHistory);

        if (location.state?.recipientId) {
          setRecipientId(location.state.recipientId);
        }
      } catch (error) {
        toast.error("Failed to initialize chat");
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) initializeChat();
  }, [userId, location.state]);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (recipientId) {
        try {
          const data = await fetchUserData(recipientId);
          setRecipientData(data);
        } catch (error) {
          console.error("Fetch recipient data error:", error);
        }
      }
    };

    fetchRecipient();
  }, [recipientId]);


  // WebSocket management
  useEffect(() => {
    let isMounted = true;
    let clientInstance;

    const setupWebSocket = async () => {
      try {
        const client = await connect();
        if (!isMounted) return;

        setStompClient(client);
        clientInstance = client;
      } catch (error) {
        console.error("Connection error:", error);
      }
    };

    setupWebSocket();

    return () => {
      isMounted = false;
      if (clientInstance) {
        clientInstance.deactivate();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!stompClient || !stompClient.connected || !userId || !recipientId) return;

    const subscription = stompClient.subscribe(`/topic/private.${userId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      console.log('Received message:', newMessage);

      // Check if the message is part of the current chat
      const isCurrentChatMessage =
        (newMessage.senderId === recipientId && newMessage.recipientId === userId) ||
        (newMessage.senderId === userId && newMessage.recipientId === recipientId);

      if (isCurrentChatMessage) {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (!exists) {
            return [...prev, newMessage];
          }
          return prev;
        });
        scrollToBottom();
      }
      fetchChatHistory();
    });

    return () => subscription.unsubscribe();
  }, [stompClient, userId, recipientId, scrollToBottom]);


  // Send message
  const handleSendMessage = () => {
    if (!input.trim() || !stompClient?.connected) return;
  
    // Optimistic update with a temporary ID
    const tempMessage = {
      tempId: Date.now(),
      content: input,
      senderId: userId,
      recipientId,
      timestamp: new Date().toISOString(),
    };
  
    setMessages(prev => [...prev, tempMessage]);
    setInput("");
  
    // Send via WebSocket
    stompClient.publish({
      destination: "/app/sendToUser",
      body: JSON.stringify({
        senderId: userId,
        recipientId,
        content: input,
      }),
    });
  
    scrollToBottom();
  };

  const fetchChatHistory = useCallback(async () => {
    if (!userId || !recipientId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/chat/history?senderId=${userId}&recipientId=${recipientId}&page=0&size=100`
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      const sortedMessages = data.content.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setMessages(sortedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Chat history error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, recipientId, scrollToBottom]);

  useEffect(() => {
    if (recipientId) {
      fetchChatHistory();
    }
  }, [fetchChatHistory, recipientId]);


  // Send message handler
  // const handleSendMessage = () => {
  //   if (!input.trim() || !stompClient?.connected) return;

  //   const newMessage = {
  //     senderId: userId,
  //     content: input,
  //     recipientId,
  //     timestamp: new Date().toISOString()
  //   };

  //   setMessages(prev => [...prev, newMessage]);
  //   setInput("");

  //   sendMessageToUser(userId, input, recipientId);

  //   // Scroll to bottom after sending
  //   setTimeout(scrollToBottom, 100);
  // };

  const filteredUsers = chatHistoryList.filter(user =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full border-t-4 border-purple-900 border-solid h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-79px)] bg-gray-100">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="mx-auto mb-4" size={48} />
              <p>No chat history found</p>
            </div>
          ) : (
            filteredUsers.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => {
                  setRecipientId(chatUser.id);
                  setTimeout(scrollToBottom, 100);
                }}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors cursor-pointer
                  ${recipientId === chatUser.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <UserCircle2 className="text-gray-400" size={40} />
                  <div className="text-left">
                    <p className="font-medium">{chatUser.firstname}</p>
                    <p className="text-sm text-gray-500">{chatUser.email}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {recipientId ? (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center">
            <UserCircle2 className="mr-4 text-gray-400" size={40} />
            <div>
              <h2 className="text-lg font-semibold">
                {chatHistoryList.find(u => u.id === recipientId)?.firstname || "Chat"}
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <MessageCircle className="mr-2" size={32} />
            Select a chat to start messaging
          </div>
        )}

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        >
          {messages.map((msg, index) => {
            const isSender = msg.senderId === userId;
            return (
              <div
                key={index}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-md p-3 rounded-2xl shadow-sm 
                    ${isSender
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'}
                  `}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Invisible div to enable scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {recipientId && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;