import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-confing/Firebase";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import CanvaList from "../components/canva/CanvaList";
import CanvaModals from "../components/canva/BoardModals";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import { LightBulbIcon, PlusIcon } from "@heroicons/react/24/outline";

const CanvaListPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [canvas, setCanvas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCanva, setCurrentCanva] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ description: "", email: "" });

  // Obtener tableros del usuario
  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const canvasQuery = query(
          collection(db, "canvas"),
          where("participants", "array-contains", user.email)
        );

        const snapshot = await getDocs(canvasQuery);
        const canvasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isHost: doc.data().ownerId === user.uid,
        }));

        setCanvas(canvasData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching canvas:", err);
        setError("Error al cargar los proyectos");
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchCanvas();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const refreshCanvas = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const canvasQuery = query(
        collection(db, "canvas"),
        where("participants", "array-contains", user.email)
      );

      const snapshot = await getDocs(canvasQuery);
      const canvasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isHost: doc.data().ownerId === user.uid,
      }));

      setCanvas(canvasData);
    } catch (err) {
      console.error("Error refreshing canvas:", err);
      setError("Error al actualizar los proyectos");
    }
  }, [auth]);

  const handleCreateCanva = async () => {
    setIsSubmitting(true);
    try {
      const newCanva = {
        description: formData.description,
        ownerId: user.uid,
        ownerName: user.displayName || user.email.split("@")[0],
        participants: [user.email],
        pages: [
          {
            id: "main",
            title: "Principal",
            nodes: [],
            edges: [],
          },
        ],
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      await addDoc(collection(db, "canvas"), newCanva);
      await refreshCanvas();

      Swal.fire({
        icon: "success",
        title: "¡Proyecto creado!",
        text: `"${formData.description}" está listo para usar`,
        timer: 2000,
        background: "#f8fafc",
        showConfirmButton: false,
      });

      closeModals();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: "No se pudo crear el proyecto",
        background: "#f8fafc",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCanva = async () => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "canvas", currentCanva.id), {
        description: formData.description,
        lastUpdated: new Date(),
      });

      setCanvas((prev) =>
        prev.map((b) =>
          b.id === currentCanva.id
            ? { ...b, description: formData.description }
            : b
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Cambios guardados!",
        showConfirmButton: false,
        timer: 1500,
        background: "#f8fafc",
      });

      closeModals();
    } catch (error) {
      console.error("Error updating canva:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo modificar el proyecto",
        background: "#f8fafc",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCanva = async (canvaId) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar proyecto?",
        text: "Esta acción no se puede deshacer",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        background: "#f8fafc",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "canvas", canvaId));
        setCanvas((prev) => prev.filter((b) => b.id !== canvaId));

        Swal.fire({
          title: "¡Eliminado!",
          showConfirmButton: false,
          timer: 1500,
          background: "#f8fafc",
        });
      }
    } catch (error) {
      console.error("Error deleting canva:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        background: "#f8fafc",
      });
    }
  };

  const handleInviteUser = async () => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "canvas", currentCanva.id), {
        participants: arrayUnion(formData.email),
        lastUpdated: new Date(),
      });

      Swal.fire({
        title: "¡Invitación enviada!",
        showConfirmButton: false,
        timer: 1500,
        background: "#f8fafc",
      });

      closeModals();
    } catch (error) {
      console.error("Error al invitar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al invitar",
        background: "#f8fafc",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setModalType(null);
    setCurrentCanva(null);
    setFormData({ description: "", email: "" });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/canvas/${currentCanva?.id}`
    );
    Swal.fire({
      icon: "success",
      title: "Enlace copiado",
      showConfirmButton: false,
      timer: 1500,
      background: "#f8fafc",
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="pt-24 px-4 md:px-8 bg-slate-50 min-h-screen">
      {/* Sección Principal */}
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <LightBulbIcon className="w-8 h-8 text-indigo-500" />
              Mis Proyectos
            </h1>
            <p className="text-slate-500 mt-2">
              {canvas.length} {canvas.length === 1 ? "proyecto" : "proyectos"}{" "}
              en total
            </p>
          </div>

          <button
            onClick={() => setModalType("create")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Nuevo Proyecto</span>
          </button>
        </header>

        {/* Lista de Canvas */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <CanvaList
            canvas={canvas}
            onEdit={(canva) => {
              setCurrentCanva(canva);
              setFormData({ description: canva.description });
              setModalType("edit");
            }}
            onDelete={handleDeleteCanva}
            onInvite={(canva) => {
              setCurrentCanva(canva);
              setModalType("invite");
            }}
          />
        </section>

        {/* Modales */}
        <CanvaModals
          modalType={modalType}
          closeModals={closeModals}
          formData={formData}
          setFormData={setFormData}
          currentCanva={currentCanva}
          handleSubmit={{
            create: handleCreateCanva,
            edit: handleUpdateCanva,
            invite: handleInviteUser,
          }}
          handleCopyLink={handleCopyLink}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CanvaListPage;
