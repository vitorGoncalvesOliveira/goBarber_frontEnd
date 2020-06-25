import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SignInCredetials {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: UserData;
}

interface AuthContextData {
  user: UserData;
  signIn(credentials: SignInCredetials): Promise<void>;
  signOut(): void;
  updateUser(user: UserData): void;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:Token');
    const user = localStorage.getItem('@GoBarber:User');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        token,
        user: JSON.parse(user),
      };
    }
    return {} as AuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:Token');
    localStorage.removeItem('@GoBarber:User');
    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredetials) => {
    const response = await api.post('session', {
      email,
      password,
    });
    const { token, user } = response.data;
    api.defaults.headers.authorization = `Bearer ${token}`;
    localStorage.setItem('@GoBarber:Token', token);
    localStorage.setItem('@GoBarber:User', JSON.stringify(user));
    setData({ token, user });
  }, []);

  const updateUser = useCallback(
    (user: UserData) => {
      localStorage.setItem('@GoBarber:User', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used Within an AuthProvider');
  return context;
}

export { useAuth, AuthProvider };
