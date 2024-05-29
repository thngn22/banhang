import React, { useState } from "react";
import {
  MessageOutlined,
  MinusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { sender: "user", text: currentMessage }]);
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
        style={{ backgroundColor: "rgba(30, 144, 255, 0.8)" }} // Custom blue color
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
        <div className="rounded-tr-lg">
          <div className="h-56 bg-gray-100 overflow-y-auto p-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-block bg-gray-200 rounded px-2 py-1">
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center bg-white items-center gap-2 p-2 border-t">
            <Input
              type="text"
              className="flex-1 border-none rounded-l p-2 focus:outline-none"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              style={{ backgroundColor: "rgba(245, 245, 245, 1)" }} // Light gray background for input
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
