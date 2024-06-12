import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the types for the context value
interface UserContextType {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  // data: any;
  // setData: Dispatch<SetStateAction<any>>;
  // subscription: any[];
  // setSubscription: Dispatch<SetStateAction<any[]>>;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  // const [data, setData] = useState<any>(null);
  // const [subscription, setSubscription] = useState<any[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
