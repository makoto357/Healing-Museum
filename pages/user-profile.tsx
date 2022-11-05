import Link from "next/link";
import { useState, useContext, useEffect, use } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
  orderBy,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

interface IUser {
  email: string | undefined;
  favoriteArtworksID: string[] | undefined;
  favoritePostsID: string[] | undefined;
  id: string | undefined;
  last_changed: Timestamp | undefined;
  name: string | undefined;
}

export default function UserProfile() {
  const [themeColor] = useContext(ThemeColorContext);
  const { user } = useAuth();
  const [profile, setProfile] = useState<IUser>({
    email: undefined,
    favoriteArtworksID: undefined,
    favoritePostsID: undefined,
    id: undefined,
    last_changed: undefined,
    name: undefined,
  });
  useEffect(() => {
    const getProfile = async () => {
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const IUser = doc.data() as IUser;
        setProfile(IUser);
      });
    };
    // const getArtworksOfSelectedArtist = async () => {
    //   const q = query(collection(db, "users"), where("id", "==", user?.uid));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     const IUser = doc.data() as IUser;
    //     setProfile(IUser);
    //   });
    // };
    if (user) {
      getProfile();
    }
  }, [user]);
  return (
    <>
      <div>profile</div>
      <div style={{ textAlign: "right" }}>
        <Link href="/visitor-posts">
          <p>check posts of other visitors.</p>
        </Link>
      </div>
      <section>
        <p>
          Thank you, {profile?.name}, for your visit to the Healing Museum
          today. I hope you had a nice time and some understandings of{" "}
          {"artist-name"} whose life perspectives resonate with your own.
        </p>
        {/* <img alt={profile.favoriteArtworksID[0]} src={profile} /> */}
        <p></p>
        <p>We feel, therefore we are.</p>
      </section>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
