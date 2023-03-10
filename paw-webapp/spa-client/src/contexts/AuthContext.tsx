import { useState } from "react";
import React from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

type CustomJwtPayload = JwtPayload & { roles: string; userUrl: string; exp: number };

export interface AuthContextValue {
  isAuthenticated: boolean;
  logout: () => void;
  login: (token: string, refreshToken?: string) => Promise<void>;
  jwt?: string | undefined;
  refreshToken?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
  userId?: number | undefined;
  profileImg: string;
  updateProfileImg: (img: string) => void;
  setJwt: React.Dispatch<React.SetStateAction<string | undefined>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  profileImg: "",
  updateProfileImg: () => { },
  logout: () => { },
  login: async () => { },
  setJwt: () => { },
  setRefreshToken: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const jwtInLocalStorage = localStorage.getItem("jwt") != null;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    jwtInLocalStorage
  );

  const token = localStorage.getItem("jwt") as string;
  const [jwt, setJwt] = useState<string | undefined>(token);
  const refresh_Token = localStorage.getItem("refresh") as string;
  const [refreshToken, setRefreshToken] = useState<string | undefined>(refresh_Token)

  const [email, setEmail] = useState<string | undefined>(() => {
    try {
      return jwtDecode<CustomJwtPayload>(jwt as string).sub as string
    } catch (error) {
      if (isAuthenticated)
        console.error(error);
    }
  }
  );
  const [role, setRole] = useState<string | undefined>(() => {
    try {
      return jwtDecode<CustomJwtPayload>(jwt as string).roles as string
    } catch (error) {
      if (isAuthenticated)
        console.error(error);
    }
  }

  );
  const [userId, setUserId] = useState<number | undefined>(() => {
    try {
      return parseInt(jwtDecode<CustomJwtPayload>(jwt as string)
        .userUrl.split("/")
        .pop() as string)
    } catch (error) {
      if (isAuthenticated)
        console.error(error);
    }
  }

  );
  const login = async (token: string, refreshToken?: string) => {
    try {
      setJwt(token);
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);
      setEmail(jwtDecode<CustomJwtPayload>(token).sub);
      setRole(jwtDecode<CustomJwtPayload>(token as string).roles);
      const id = jwtDecode<CustomJwtPayload>(token)
        .userUrl.split("/")
        .pop();
      if (id) setUserId(parseInt(id));
      localStorage.setItem("jwt", token);
      if(refreshToken)
        localStorage.setItem("refresh", refreshToken);

    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setJwt(undefined);
    setRefreshToken(undefined);
    setEmail(undefined);
    setRole(undefined);
    setUserId(undefined);
  };

  const [profileImg, updateProfileImg] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, logout, login, jwt, email, role, userId, refreshToken, setJwt, setRefreshToken, profileImg, updateProfileImg }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;
