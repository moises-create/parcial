import { ArrowRightIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center max-w-2xl mx-4">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Bienvenido a un Figma Colaborativo
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Desata tu creatividad y crea la página web perfecta para compartir tus
          ideas.
        </p>
        <Link
          to="/canvas"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white text-lg font-semibold shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Empezar
          <ArrowRightIcon className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
