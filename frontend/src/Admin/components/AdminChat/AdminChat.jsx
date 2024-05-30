import React, { useState, useEffect } from "react";
import { Input, List, Avatar, Typography } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { Stomp } from "@stomp/stompjs";
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

    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);
      setStompClient(stompClient);

      stompClient.subscribe("/user/topic", (messageOutput) => {
        showMessage(JSON.parse(messageOutput.body));
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSend = () => {
    if (currentMessage.trim()) {
      const message = { text: currentMessage, sender: "me" };
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
                    item.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <List.Item.Meta
                    avatar={
                      item.sender !== "me" && <Avatar icon={<UserOutlined />} />
                    }
                    description={<Text>{item.text}</Text>}
                  />
                </List.Item>
              )}
            />
          </div>

          <div className="flex items-center">
            <TextArea
              rows={2}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onPressEnter={handleSend}
              className="flex-1 mr-4"
            />
            <SendOutlined
              onClick={handleSend}
              className="text-2xl cursor-pointer text-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
