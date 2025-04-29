import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { QRCodeCanvas } from "qrcode.react";
import PropTypes from "prop-types";

const CanvaModals = ({
  modalType,
  closeModals,
  formData,
  setFormData,
  currentCanva,
  handleSubmit,
  handleCopyLink,
  isSubmitting,
}) => {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = (e, type) => {
    e.preventDefault();
    if (type === "invite" && !isValidEmail(formData.email)) return;
    handleSubmit[type]();
  };

  return (
    <Dialog
      open={modalType !== null}
      onClose={closeModals}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {modalType === "create" && "Nuevo Proyecto"}
                {modalType === "edit" && "Editar Proyecto"}
                {modalType === "invite" && "Compartir Proyecto"}
              </DialogTitle>
              <button
                onClick={closeModals}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {modalType !== "invite" ? (
              <form onSubmit={(e) => handleFormSubmit(e, modalType)}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="canva-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre del proyecto
                    </label>
                    <input
                      id="canva-name"
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Ej: Diagrama de flujo"
                      required
                      minLength="3"
                      maxLength="50"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm text-white rounded-md flex items-center space-x-2 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-colors`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>
                            {modalType === "create"
                              ? "Creando..."
                              : "Guardando..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>
                            {modalType === "create" ? "Crear" : "Guardar"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center">
                  <QRCodeCanvas
                    value={`${window.location.origin}/canvas/${currentCanva?.id}`}
                    size={180}
                    level="H"
                    includeMargin={true}
                    fgColor="#4f46e5"
                  />
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Copiar enlace</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">
                      o
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="invite-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Invitar por correo
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="invite-email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`flex-1 px-3 py-2 text-sm border ${
                        formData.email && !isValidEmail(formData.email)
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                      autoFocus
                    />
                    <button
                      onClick={(e) => handleFormSubmit(e, "invite")}
                      disabled={isSubmitting || !isValidEmail(formData.email)}
                      className={`px-3 py-2 text-sm text-white rounded-md flex items-center space-x-1 ${
                        isSubmitting || !isValidEmail(formData.email)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-colors`}
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Invitar</span>
                    </button>
                  </div>
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="mt-1 text-xs text-red-500">
                      Ingresa un email válido
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

CanvaModals.propTypes = {
  modalType: PropTypes.oneOf(["create", "edit", "invite", null]),
  closeModals: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    description: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  currentCanva: PropTypes.object,
  handleSubmit: PropTypes.shape({
    create: PropTypes.func,
    edit: PropTypes.func,
    invite: PropTypes.func,
  }).isRequired,
  handleCopyLink: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default CanvaModals;
