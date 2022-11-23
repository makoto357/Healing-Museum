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
import quotes from "../public/visitorJourney.json";
import SignpostButton from "../components/Button";

const FinalWords = styled.section`
  width: 90vw;
  margin: 0 auto;
  text-align: left;
  display: flex;
  flex-direction: row;
`;

const Opening = styled.h1`
  font-size: 1.25rem;
`;

const ColorStripe = styled.div<{ $colorCode: string }>`
  background: ${(props) => props.$colorCode};
  width: 18vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 12vw;
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
  console.log(artwork);

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

    getProfile();
  }, []);
  return (
    <div style={{ paddingTop: "104px" }}>
      <FinalWords>
        <div style={{ width: "10vw" }}></div>
        <div
          style={{
            width: "200px",
            position: "absolute",
            top: "33vh",
            left: "19vw",
            zIndex: "3",
          }}
        >
          <p style={{ fontSize: "1.25rem" }}>
            <strong>
              {`"${quote}"`}
              <br />-{artwork.artistName}
            </strong>
          </p>
        </div>
        <ColorStripe
          $colorCode={themeColor ? `${themeColor.secondary}` : "#BBB6AC"}
        ></ColorStripe>
        <div
          style={{
            backgroundImage: `url(${artwork.image})`,
            minWidth: "500px",
            height: "60vh",
            backgroundSize: "cover",
            marginLeft: "310px",
          }}
        />

        <div style={{ width: "350px", padding: "0 40px" }}>
          <Opening>
            <strong>
              Thank you, {profile?.name}, <br />
              for your visit to the Healing Museum.
            </strong>
          </Opening>
          <p>
            I hope you had a nice time and some understandings of the artist
            whose life perspectives resonate with your own.
          </p>
          <p>
            <strong>
              <i>{artwork.title}</i>
            </strong>{" "}
            by {artwork.artistName} is the last painting you saved as favorite
            during your journey, <br />
            We hope this painting gives you strength, <br />
            for knowing there is someone who shares your feelings.
          </p>

          <span>{artwork.completionYear}</span>
        </div>
      </FinalWords>
      <SignpostButton href="/visitor-posts">
        Read about how other visitors feel
      </SignpostButton>
    </div>
  );
}
