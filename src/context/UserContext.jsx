import React from "react";
import { createContext, useState } from "react";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged in user
  const [profile, setProfile] = useState(null); // Current profile (can be self or other)
  const [otherUsers, setOtherUsers] = useState([]); // Users for "Who to follow"

  return (
    <UserContext.Provider
      value={{ user, setUser, profile, setProfile, otherUsers, setOtherUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};
