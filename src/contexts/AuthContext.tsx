import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/hooks";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/apiClient";

type AuthProviderProps = {
  children: ReactNode;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "@authapp:token");
  destroyCookie(undefined, "@authapp:refreshToken");

  authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { "@authapp:token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;
          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", { email, password });
      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, "@authapp:token", token, {
        maxAge: 60 * 60 * 24 * 30, //3days
        path: "/",
      });

      setCookie(undefined, "@authapp:refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //3days
        path: "/",
      });

      setUser({ email, permissions, roles });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (err) {}
    // console.log({ email, password });
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
