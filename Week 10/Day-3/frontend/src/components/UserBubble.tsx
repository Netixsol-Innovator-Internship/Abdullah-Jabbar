import React from "react";

interface UserBubbleProps {
  message: string;
}

const UserBubble: React.FC<UserBubbleProps> = ({ message }) => (
  <div className="flex justify-end mb-2">
    <div className="max-w-[85%] rounded-t-xl rounded-bl-xl rounded-br-sm bg-indigo-600 p-3 text-white shadow-sm">
      {message}
    </div>
  </div>
);

export default UserBubble;
