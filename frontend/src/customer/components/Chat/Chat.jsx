import React, { useEffect, useRef, useState } from "react";
import {
  MessageOutlined,
  MinusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import createAxiosInstance from "../../../services/createAxiosInstance";
import * as ChatService from "../../../services/ChatService";

const Chat = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const messagesEndRef = useRef(null);

  const { data: communication } = useQuery({
    queryFn: () => {
      return ChatService.findChatMessages(
        {
          recipientId: "admin1",
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    if (communication) {
      setMessages(communication.body);
    }
  }, [communication]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:7586/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
      () => {
        setStompClient(stompClient);
        console.log(stompClient);
      },
      (error) => {
        console.error("Connection error", error);
      }
    );

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [auth?.accessToken]);

  useEffect(() => {
    if (stompClient) {
      const topic = `/user/trungkhangsteve/queue/messages`;
      stompClient.subscribe(topic, (messageOutput) => {
        showMessage(JSON.parse(messageOutput.body));
      });
    }
  }, [stompClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  const showMessage = (message) => {
    console.log("vao dc");
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && stompClient) {
      const message = {
        senderId: `${auth?.email.split("@")[0]}`,
        recipientId: "admin1",
        content: currentMessage,
      };
      stompClient.send("/app/user", {}, JSON.stringify(message));
      setCurrentMessage("");
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 bg-white rounded-tr-lg shadow-lg z-50 transition-all duration-300 overflow-hidden`}
      style={{
        width: isOpen ? "18rem" : "5rem",
        height: isOpen ? "20rem" : "3rem",
        backgroundColor: "rgba(30, 144, 255, 1)",
      }}
    >
      <div
        className="flex items-center justify-between cursor-pointer p-2 rounded-tr-lg"
        onClick={toggleChat}
        style={{ backgroundColor: "rgba(30, 144, 255, 0.8)" }}
      >
        <div className="flex items-center text-white">
          <MessageOutlined className="text-xl" />
          <span className="ml-2">Chat</span>
        </div>
        {isOpen && (
          <MinusOutlined className="text-xl text-white" onClick={toggleChat} />
        )}
      </div>
      {isOpen && (
        <div className="rounded-tr-lg flex flex-col">
          <div className="h-56 bg-gray-100 overflow-y-auto p-2">
            {messages.length > 0 &&
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    message.senderId === `${auth?.email.split("@")[0]}`
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[60%] break-words px-4 py-2 rounded-lg ${
                      message.senderId === `${auth?.email.split("@")[0]}`
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex justify-center bg-white items-center gap-2 p-2 border-t">
            <Input
              type="text"
              className="flex-1 border-none rounded-l p-2 focus:outline-none"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
            />
            <Button
              type="primary"
              className="rounded-r"
              onClick={handleSendMessage}
              icon={<SendOutlined />}
              style={{
                backgroundColor: "rgba(30, 144, 255, 0.8)",
                borderColor: "rgba(30, 144, 255, 0.8)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseDown={(e) => (e.currentTarget.style.opacity = 0.8)}
              onMouseUp={(e) => (e.currentTarget.style.opacity = 0.9)}
            >
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
