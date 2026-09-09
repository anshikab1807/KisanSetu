/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ receiver: userId, content: newMessage }));
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && conversationMessages.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8">
      <Link
        to="/messages"
        className="flex items-center text-green-900 hover:text-green-700 mb-6 font-semibold"
      >
        <FaArrowLeft className="mr-2" />
        Back to Messages
      </Link>

      <div className="max-w-3xl mx-auto bg-green-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-yellow-100 px-6 py-4 rounded-t-3xl shadow-md">
          <h2 className="text-2xl font-bold">
            {conversationMessages.length > 0
              ? conversationMessages[0].sender._id === user._id
                ? conversationMessages[0].receiver.name
                : conversationMessages[0].sender.name
              : "Conversation"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-green-50">
          {conversationMessages.length > 0 ? (
            <div className="space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl p-3 shadow-md ${
                      message.sender._id === user._id
                        ? "bg-green-600 text-yellow-100 rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <p
                      className={`text-xs ${
                        message.sender._id === user._id ? "text-yellow-200" : "text-gray-500"
                      } text-right`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-green-700">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-green-100 border-t border-green-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow rounded-full border-2 border-yellow-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className={`bg-yellow-400 text-green-900 p-3 rounded-full hover:bg-yellow-300 transition-all ${
                newMessage.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={newMessage.trim() === ""}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
