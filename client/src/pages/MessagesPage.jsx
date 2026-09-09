"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "../components/MessageItem";
import Loader from "../components/Loader";
import { FaComments } from "react-icons/fa";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-8 text-center drop-shadow-lg">
        My Messages
      </h1>

      {conversations.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {conversations.map((conversation) => (
            <MessageItem
              key={conversation.user._id}
              conversation={conversation}
              className="bg-green-50 hover:bg-green-100 shadow-lg rounded-2xl transition-all p-4"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 max-w-md mx-auto glass rounded-3xl p-8 shadow-2xl">
          <FaComments className="text-green-600 text-5xl mx-auto mb-4 drop-shadow-lg" />
          <h3 className="text-2xl font-semibold mb-2 text-green-800">
            No Messages Yet
          </h3>
          <p className="text-green-700 text-lg">
            You don't have any conversations yet. Start by messaging a farmer or
            responding to customer inquiries.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
