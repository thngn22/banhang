import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import * as ChatService from "../../../services/ChatService";
import createAxiosInstance from "../../../services/createAxiosInstance";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ChatsManagementPage = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);

  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [newMessageFlags, setNewMessageFlags] = useState({});

  // Create a ref to the messages container
  const messagesEndRef = useRef(null);

  const { data: listChatUsers } = useQuery({
    queryKey: ["listChatUsers"],
    queryFn: () => ChatService.getListChatUsers(auth.accessToken, axiosJWT),
    enabled: Boolean(auth?.accessToken),
  });

  const { data: communication, refetch } = useQuery({
    queryKey: [selectedUser?.id, "communication"],
    queryFn: () => {
      if (selectedUser) {
        return ChatService.findChatMessages(
          {
            recipientId: selectedUser.id,
          },
          auth.accessToken,
          axiosJWT
        );
      }
      return { body: [] };
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    if (communication && selectedUser) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.id]: communication.body,
      }));
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
    if (stompClient && listChatUsers) {
      const newSubscriptions = listChatUsers.map((user) => {
        const topic = `/user/${user.id}/queue/messages`;
        return stompClient.subscribe(topic, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          showMessage(user.id, message);
          // Set flag for new message notification
          if (selectedUser?.id !== user.id) {
            setNewMessageFlags((prevFlags) => ({
              ...prevFlags,
              [user.id]: true,
            }));
          }
        });
      });

      return () => {
        newSubscriptions.forEach((sub) => sub.unsubscribe());
      };
    }
  }, [stompClient, listChatUsers, selectedUser]);

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showMessage = (userId, message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [userId]: [...(prevMessages[userId] || []), message],
    }));
  };

  const handleSend = () => {
    if (currentMessage.trim() && stompClient && selectedUser) {
      const message = {
        senderId: auth?.email.split("@")[0], // Sử dụng senderId là email split
        recipientId: selectedUser.id, // Sử dụng recipientId từ selectedUser
        content: currentMessage,
      };
      stompClient.send("/app/user", {}, JSON.stringify(message));
      setCurrentMessage("");
      refetch({ queryKey: ["communication"] });
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // Clear new message flag for selected user
    setNewMessageFlags((prevFlags) => ({
      ...prevFlags,
      [user.id]: false,
    }));
  };

  return (
    <div className="h-screen p-6">
      <div className="flex h-full bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-300 flex flex-col rounded-l-3xl">
          <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-center h-16 rounded-tl-3xl">
            <h2 className="text-xl font-bold">Nhắn tin</h2>
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
                    {newMessageFlags[user.id] &&
                      selectedUser?.id !== user.id && (
                        <span className="ml-2 bg-green-400 w-2 h-2 rounded-full inline-block" />
                      )}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col rounded-r-3xl">
          <div className="border-b border-gray-300 flex items-center p-4 h-16 rounded-tr-3xl">
            {!selectedUser ? (
              <p className="text-2xl font-semibold">Chọn cuộc hội thoại</p>
            ) : selectedUser?.avatar ? (
              <div className="flex gap-4">
                <img
                  src={selectedUser?.avatar}
                  alt="avatar"
                  className="rounded-full"
                />

                <p className="mt-1 text-2xl font-medium">
                  {selectedUser?.fullName}
                </p>
              </div>
            ) : (
              <div className="flex gap-4">
                <UserOutlined />
                <p className="mt-1 text-2xl font-medium">
                  {selectedUser?.fullName}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1 overflow-y-auto bg-gray-100">
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="space-y-1">
                {messages[selectedUser?.id]?.length > 0 &&
                  messages[selectedUser?.id]?.map((item, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        item.senderId === "admin1"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex items-end space-x-2 w-full">
                        {item.senderId !== "admin1" && (
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
                        )}
                        <div
                          className={`max-w-[60%] px-4 py-2 rounded-lg break-words ${
                            item.senderId === "admin1"
                              ? "ml-auto bg-blue-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {selectedUser && (
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
                  className="border rounded p-2 w-full mr-2 focus:resize-none"
                />
                <button
                  onClick={handleSend}
                  className="rounded-full p-4 hover:opacity-70 transition duration-200 transform hover:scale-105 active:scale-95"
                >
                  <SendOutlined className="text-blue-500 text-3xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsManagementPage;
