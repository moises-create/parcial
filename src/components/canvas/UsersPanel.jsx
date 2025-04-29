// UsersPanel.js - Rediseño futurista
import React from "react";
import { User, Circle } from "react-feather";

const UsersPanel = ({ collaborators = [], currentUser }) => {
  return (
    <div className="flex items-center gap-3">
      {collaborators.map((email) => (
        <div
          key={email}
          className={`relative flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            email === currentUser
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
              : "bg-gray-900 text-gray-100 shadow-md"
          } transition-all hover:scale-105`}
        >
          <div className="absolute -top-1 -right-1">
            <div
              className={`h-3 w-3 rounded-full ${
                email === currentUser ? "bg-white" : "bg-green-400"
              } shadow-sm`}
            />
          </div>
          <User size={16} className="mr-2" />
          {email.split("@")[0]}
        </div>
      ))}
    </div>
  );
};

export default React.memo(UsersPanel);
