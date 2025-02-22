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
  const [quests, setQuests] = useState<any>(0);
  const [localQuests, setLocalQuests] = useState([]);

  return (
    <UserContext.Provider
      value={{ user, setUser, quests, setQuests, localQuests, setLocalQuests }}
    >
      {children}
    </UserContext.Provider>
  );
}
