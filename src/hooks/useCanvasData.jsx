import { useState, useEffect, useCallback, useMemo } from "react";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-confing/Firebase";

/* ──────────────────────────────────────────────
   Hook: useCanvasData
   - Gestiona páginas (nodes/edges por página)
   - Maneja lista de colaboradores activos en tiempo real
   ────────────────────────────────────────────── */
const useCanvasData = (canvaId, userEmail) => {
  /* --------------- state --------------- */
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState("main");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);

  /* --------------- helpers --------------- */
  const currentPage = useMemo(
    () => pages.find((p) => p.id === activePage) || { nodes: [], edges: [] },
    [pages, activePage]
  );

  /* ---------------- save page ---------------- */
  const saveChanges = useCallback(
    async (nodes, edges) => {
      if (!canvaId || !userEmail) return;
      try {
        const ref = doc(db, "canvas", canvaId);
        await updateDoc(ref, {
          pages: pages.map((p) =>
            p.id === activePage ? { ...p, nodes, edges } : p
          ),
          lastUpdated: serverTimestamp(),
        });
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    },
    [canvaId, userEmail, pages, activePage]
  );

  /* ---------------- page CRUD ---------------- */
  const addPage = useCallback(
    async (title) => {
      if (!canvaId) return;
      const newPage = {
        id: `page-${Date.now()}`,
        title: title || `Página ${pages.length + 1}`,
        nodes: [],
        edges: [],
      };
      try {
        await updateDoc(doc(db, "canvas", canvaId), {
          pages: arrayUnion(newPage),
        });
        setActivePage(newPage.id);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    },
    [canvaId, pages.length]
  );

  const removePage = useCallback(
    async (id) => {
      if (pages.length <= 1 || !canvaId) return;
      const pageObj = pages.find((p) => p.id === id);
      try {
        await updateDoc(doc(db, "canvas", canvaId), {
          pages: arrayRemove(pageObj),
        });
        if (activePage === id) {
          setActivePage(pages.find((p) => p.id !== id)?.id || "main");
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    },
    [canvaId, pages, activePage]
  );

  /* --------------- firestore listeners --------------- */

  /* Canvas listener */
  useEffect(() => {
    if (!canvaId) return;
    setLoading(true);

    const unsub = onSnapshot(
      doc(db, "canvas", canvaId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setPages(data.pages || []);
          // corrige activePage si ya no existe
          setActivePage((prev) =>
            data.pages?.some((p) => p.id === prev)
              ? prev
              : data.pages?.[0]?.id || "main"
          );
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [canvaId]);

  /* Presence listener */
  useEffect(() => {
    if (!canvaId || !userEmail) return;

    // 1. Marca este usuario como activo
    const meRef = doc(db, "activeCanvaUsers", canvaId, "users", userEmail);
    setDoc(
      meRef,
      {
        active: true,
        lastSeen: serverTimestamp(),
        name: userEmail.split("@")[0],
      },
      { merge: true }
    );

    // 2. Suscribe a la lista de usuarios
    const collRef = collection(db, "activeCanvaUsers", canvaId, "users");
    const unsub = onSnapshot(collRef, (snap) => {
      const list = snap.docs.filter((d) => d.data().active).map((d) => d.id);
      setCollaborators(list);
    });

    // 3. Cleanup: marca inactivo y desuscribe
    return () => {
      updateDoc(meRef, { active: false, lastSeen: serverTimestamp() }).catch(
        console.error
      );
      unsub();
    };
  }, [canvaId, userEmail]);

  /* --------------- return API --------------- */
  return {
    /* data */
    pages,
    activePage,
    nodes: currentPage.nodes,
    edges: currentPage.edges,
    collaborators,
    /* setters / actions */
    setActivePage,
    saveChanges,
    addPage,
    removePage,
    /* ui */
    loading,
    error,
  };
};

export default useCanvasData;
