import React, { useState, useEffect } from "react";
import { Input, List, Avatar, Typography } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const { TextArea } = Input;
const { Text } = Typography;

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:7586/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzVG9rZW4iLCJyb2xlIjpbIlJPTEVfQURNSU5JU1RSQVRPUiJdLCJpZCI6Miwic3ViIjoiYWRtaW4xQGdtYWlsLmNvbSIsImlhdCI6MTcxNzA4NjIyOCwiZXhwIjoxNzE3MTcyNjI4fQ.Zrq1-eYxrAQFrkOzXgWDvwLFta8Q1t3axQJs5i1Lm2I"
    }, () => {
      setStompClient(stompClient);
      console.log(stompClient);
      stompClient.subscribe("/user/topic", (messageOutput) => {
        showMessage(JSON.parse(messageOutput.body));
      });
    }, (error) => {
      console.error('Connection error', error);
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSend = () => {
    if (currentMessage.trim() && stompClient) {
      const message = {
        senderId: "me",
        recipientId: "admin1", // Update with actual recipientId
        content: currentMessage,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));
      setCurrentMessage("");
    }
  };

  const users = [
    { key: "1", name: "User 1" },
    { key: "2", name: "User 2" },
    { key: "3", name: "User 3" },
    { key: "4", name: "User 4" },
    { key: "5", name: "User 5" },
    { key: "6", name: "User 6" },
    { key: "7", name: "User 7" },
    { key: "8", name: "User 8" },
  ];

  return (
    <div className="h-screen flex">
      <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-center h-16">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>

        <div className="overflow-y-auto flex-1">
          <ul>
            {users.map((user) => (
              <li
                key={user.key}
                className="flex items-center p-4 border-b border-gray-200"
              >
                <UserOutlined className="mr-2" />
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex items-center h-16">
          <Avatar icon={<UserOutlined />} className="mr-2" />
          <h2 className="text-xl font-bold">User 1</h2>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto mb-4">
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item
                  className={`flex ${
                    item.senderId === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <List.Item.Meta
                    avatar={
                      item.senderId !== "me" && (
                        <Avatar icon={<UserOutlined />} />
                      )
                    }
                    title={
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          item.senderId === "me"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {item.content}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          <div className="mt-auto">
            <TextArea
              rows={2}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                handleSend();
              }}
              placeholder="Type a message..."
              className="border rounded p-2 mb-4"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSend}
            >
              <SendOutlined className="mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
