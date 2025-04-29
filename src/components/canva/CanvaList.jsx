import React from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const CanvaList = ({ canvas = [], onEdit, onDelete, onInvite }) => {
  if (canvas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
          <SparklesIcon className="h-12 w-12 text-purple-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          ¡Tu espacio creativo está vacío!
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Comienza dando vida a tus ideas con un nuevo proyecto visual.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {canvas.map((canva) => (
        <div
          key={canva.id}
          className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-100"
        >
          {/* Color accent based on project name hash */}
          <div
            className={`h-2 w-full ${
              (canva.description?.length || 0) % 3 === 0
                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                : (canva.description?.length || 0) % 3 === 1
                ? "bg-gradient-to-r from-blue-500 to-teal-400"
                : "bg-gradient-to-r from-pink-500 to-rose-500"
            }`}
          ></div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                  {canva.description || "Nuevo Proyecto"}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-white-400 mr-2"></span>
                  <p className="text-xs font-medium text-gray-500">
                    {canva.createdAt
                      ? new Date(
                          canva.createdAt?.toDate?.()
                        ).toLocaleDateString()
                      : "Fecha no disponible"}
                  </p>
                </div>
              </div>

              {canva.isHost && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(canva);
                    }}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-purple-500 rounded-lg transition-all"
                    aria-label="Editar proyecto"
                    title="Editar proyecto"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(canva.id);
                    }}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                    aria-label="Eliminar proyecto"
                    title="Eliminar proyecto"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                  {canva.ownerName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {canva.ownerName || "Usuario"}
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/canvas/${canva.id}`}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all flex items-center"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Abrir
                </Link>

                {canva.isHost && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInvite?.(canva);
                    }}
                    className="p-1.5 text-purple-500 hover:text-white hover:bg-purple-500 rounded-lg border border-purple-200 hover:border-transparent transition-all"
                    aria-label="Invitar colaboradores"
                    title="Invitar colaboradores"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CanvaList);
