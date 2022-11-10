import Link from "next/link";
import { useState, useContext, useEffect, use } from "react";
import { ThemeColorContext } from "../context/ColorContext";
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
import quote from "../public/quote.json";

interface IUser {
  email: string | undefined;
  favoriteArtworksID: string[] | undefined;
  favoritePostsID: string[] | undefined;
  id: string | undefined;
  last_changed: Timestamp | undefined;
  name: string | undefined;
  visitorJourney: EnumJourneyItems | undefined;
}

interface EnumJourneyItem {
  recommendedArtist: string;
  quizPoints: number;
  quizDate: Timestamp;
}

interface IArtwork {
  artistName: string | undefined;
  completionYear: number | undefined;
  title: string | undefined;
  id: string | undefined;
  image: string | undefined;
}

interface EnumJourneyItems extends Array<EnumJourneyItem> {}
// interface IQuote {
//   artistUrl: string | undefined;
//   artistName: string | undefined;
//   quotes: string[] | undefined;
// }

// interface IQuotes extends Array<IQuote> {}
export default function UserProfile() {
  // const [quote, setQuote] = useState<IQuotes>([
  //   {
  //     artistUrl: undefined,
  //     artistName: undefined,
  //     quotes: undefined,
  //   },
  // ]);
  const [themeColor] = useContext(ThemeColorContext);
  const { user } = useAuth();
  const [profile, setProfile] = useState<IUser>({
    email: undefined,
    favoriteArtworksID: undefined,
    favoritePostsID: undefined,
    id: undefined,
    last_changed: undefined,
    name: undefined,
    visitorJourney: undefined,
  });
  const [artwork, setArtwork] = useState<IArtwork>({
    artistName: undefined,
    completionYear: undefined,
    title: undefined,
    id: undefined,
    image: undefined,
  });

  console.log(artwork.artistName);
  const artistQuotes = quote.filter(
    (q) => q.artistName == artwork.artistName
  )[0].quotes;
  const selectedQuote =
    artistQuotes[Math.round(Math.random() * artistQuotes.length)];

  useEffect(() => {
    const getProfile = async () => {
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const IUser = doc.data() as IUser;
        setProfile(IUser);
        const artworkID =
          IUser.favoriteArtworksID[IUser.favoriteArtworksID.length - 1];
        getFavoriteArtwork(artworkID);
      });
    };
    const getFavoriteArtwork = async (id) => {
      console.log(id);
      const q = query(collection(db, "artists"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      setArtwork(docs[0]);
      console.log(docs[0].image);
    };
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
          {artwork.artistName} whose life perspectives resonate with your own.
        </p>
        <p>
          This artwork below is the last one you saved as favorite during your
          journey, does it remind you of a special moment in your life?
        </p>
        <p>
          No matter what you have encountered, we hope this painting gives you
          strength, for knowing you are not alone.
        </p>
        <img alt={artwork.id} src={artwork.image} />
        <p>
          {`"${selectedQuote}"`}-{artwork.artistName}
        </p>
        <p>We feel, therefore we are.</p>
      </section>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
