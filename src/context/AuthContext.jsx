import {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setUser({ email: savedEmail });
    }
  }, []);

  const login = (email) => {
    localStorage.setItem("email", email);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
