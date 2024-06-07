import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import * as ChatService from "../../../services/ChatService";
import createAxiosInstance from "../../../services/createAxiosInstance";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const AdminChat = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  // Create a ref to the messages container
  const messagesEndRef = useRef(null);

  const { data: listChatUsers } = useQuery({
    queryKey: "listChatUsers",
    queryFn: () => ChatService.getListChatUsers(auth.accessToken, axiosJWT),
    enabled: Boolean(auth?.accessToken),
  });

  const { data: communication } = useQuery({
    queryKey: [selectedUser],
    queryFn: () => {
      if (selectedUser) {
        return ChatService.findChatMessages(
          {
            recipientId: selectedUser?.id,
          },
          auth.accessToken,
          axiosJWT
        );
      }
      return { body: [] };
    },
    enabled: Boolean(auth?.accessToken && selectedUser),
  });

  useEffect(() => {
    if (communication && selectedUser) {
      setMessages(communication.body);
    }
  }, [communication, selectedUser]);

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
    if (selectedUser && stompClient) {
      const topic = `/user/trungkhangsteve/queue/messages`;
      stompClient.subscribe(topic, (messageOutput) => {
        showMessage(JSON.parse(messageOutput.body));
      });
    }
  }, [selectedUser, stompClient]);

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showMessage = (message) => {
    console.log("vao dc");
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSend = () => {
    if (currentMessage.trim() && stompClient) {
      const message = {
        senderId: "admin1",
        recipientId: selectedUser?.id,
        content: currentMessage,
      };
      stompClient.send("/app/user", {}, JSON.stringify(message));
      setCurrentMessage("");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="h-screen flex">
      <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-center h-16">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>

        <div className="overflow-y-auto flex-1">
          <ul>
            {listChatUsers &&
              listChatUsers.map((user) => (
                <li
                  key={user?.id}
                  className={`flex items-center p-4 border-b border-gray-200 cursor-pointer ${
                    selectedUser?.id === user.id ? "bg-blue-100" : ""
                  } hover:bg-blue-50`}
                  onClick={() => handleUserClick(user)}
                >
                  <UserOutlined className="mr-2" />
                  {user.fullName}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex items-center h-16">
          <div className="mr-2 w-8 h-8">
            {selectedUser?.avatar ? (
              <img
                src={selectedUser?.avatar}
                alt="avatar"
                className="rounded-full"
              />
            ) : (
              <UserOutlined />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {selectedUser ? `${selectedUser?.id}` : "Chọn cuộc hội thoại"}
          </h2>
        </div>

        <div className="p-6 flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-1">
              {messages.length > 0 &&
                messages?.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      item.senderId === "admin1"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {item.senderId !== "admin1" ? (
                      <div className="flex items-end space-x-2 w-full">
                        <div className="w-8 h-8">
                          {selectedUser?.avatar ? (
                            <img
                              src={selectedUser?.avatar}
                              alt="avatar"
                              className="rounded-full"
                            />
                          ) : (
                            <UserOutlined />
                          )}
                        </div>
                        <div className="max-w-[60%] bg-gray-200 text-black px-4 py-2 rounded-lg break-words">
                          {item.content}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[60%] bg-blue-500 text-white px-4 py-2 rounded-lg break-words">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-auto flex">
            <textarea
              rows={2}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="border rounded p-2 flex-1 mb-4"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              onClick={handleSend}
              disabled={!selectedUser}
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
