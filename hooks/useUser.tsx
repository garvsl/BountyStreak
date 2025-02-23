import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserContext = React.createContext<any>({});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<any>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
