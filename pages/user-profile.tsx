import styled from "@emotion/styled";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import quotes from "../public/quote.json";

const FinalWords = styled.section`
  width: 70vw;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const Opening = styled.h1`
  font-size: 22px;
`;

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
    visitorJourney: undefined,
  });
  const [artwork, setArtwork] = useState<IArtwork>({
    artistName: undefined,
    completionYear: undefined,
    title: undefined,
    id: undefined,
    image: undefined,
  });
  const [quote, setQuote] = useState("");
  console.log(artwork.artistName);

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
      const q = query(collection(db, "artists"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      setArtwork(docs[0]);
      const quoteNumber = quotes.filter(
        (q) => q.artistName == docs[0]?.artistName
      )[0].quotes.length;
      setQuote(
        quotes.filter((q) => q.artistName == docs[0]?.artistName)[0].quotes[
          Math.round(Math.random() * quoteNumber)
        ]
      );
    };
    if (user) {
      getProfile();
    }
  }, [user]);
  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Link href="/visitor-posts">
          <p>check posts of other visitors.</p>
        </Link>
      </div>
      <FinalWords>
        <Opening>
          <strong>
            Thank you, {profile?.name}, <br />
            for your visit to the Healing Museum.
          </strong>
        </Opening>
        <p>
          I hope you had a nice time and some understandings of{" "}
          {artwork.artistName} <br />
          whose life perspectives resonate with your own.
        </p>
        <p>
          The artwork below is the last one you saved as favorite during your
          journey, <br />
          does it remind you of a special moment?
        </p>
        <img src={artwork.image} alt={artwork.title} />
        <p>
          <strong>{artwork.title}</strong>
        </p>
        <span>{artwork.completionYear}</span>

        <p>
          No matter what you have encountered, we hope this painting gives you
          strength, <br />
          for knowing there is someone who shares your feelings.
        </p>
        <p>
          <strong>
            {`"${quote}"`}-{artwork.artistName}
          </strong>
        </p>
        <p>We feel, therefore we are.</p>
      </FinalWords>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
