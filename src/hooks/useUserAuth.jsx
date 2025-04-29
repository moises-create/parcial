import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 loading inicial
  const [error, setError] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("Auth error:", err);
        setError(err.message || "Error de autenticación");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [auth]);

  return { user, loading, error };
};

export default useUserAuth;
