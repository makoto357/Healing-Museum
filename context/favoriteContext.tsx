import React, { createContext, useState, useEffect, useContext } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";
export const FavoriteContext = createContext<any>({});
export const useFavorite = () => useContext(FavoriteContext);

// export const useAuth = () => useContext(FavoriteContext);
export const FavoriteContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  console.log(user?.uid);

  const saveToFavorites = async (artworkID: string) => {
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksID: arrayUnion(),
    });
  };

  return (
    <FavoriteContext.Provider value={{ saveToFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};
