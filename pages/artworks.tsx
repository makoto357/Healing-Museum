import styled from "@emotion/styled";
import Link from "next/link";
import React from "react";
import SignpostButton from "../components/Button";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import heart from "../asset/heart.png";
import ArtworkModal from "../components/ArtworkModal";
import close from "../asset/cancel.png";
import artistStyle from "../public/visitorJourney.json";

const ArtworkGrid = styled.section`
  margin: 0 auto;
  width: 90vw;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const CloseIcon = styled.div`
  background-image: url(${close.src});
  background-size: cover;
  width: 25px;
  height: 25px;
  position: fixed;
  top: 1rem;
  right: 1.5rem;
`;

const Content = styled.div`
  display: flex;
  height: 100%;
`;

const Text = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 36px;
`;

const Figure = styled.figure`
  height: 100%;
  width: 100%;
  display: flex;
  max-height: calc(100vh - 12rem);
`;

const FavoritesIcon = styled.div`
  background-image: url(${heart.src});
  width: 30px;
  height: 30px;
  background-size: cover;
`;

const ArtworkImage = styled.img`
  display: block;
  width: 100%;
  max-height: inherit;
  object-fit: contain;
  object-position: center;
  margin-bottom: auto;
`;

function ArtWork({ onClick, imgSrc, width = "320", height = "427" }) {
  return (
    <div onClick={onClick}>
      <figure>
        <img width={width} height={height} src={imgSrc} alt="" />
      </figure>
    </div>
  );
}

const ARTWORK_STYLE = {
  0: { width: "640", height: "1138" },
  1: { width: "640", height: "427" },
  2: { width: "320", height: "427" },
};

export default function Masonry() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState<IModalInfo>({
    id: undefined,
    title: undefined,
    url: undefined,
    artistUrl: undefined,
    artistName: undefined,
    artistId: undefined,
    completitionYear: undefined,
    width: undefined,
    height: undefined,
    image: undefined,
  });

  interface IModalInfo {
    id: string | undefined;
    title: string | undefined;
    url: string | undefined;
    artistUrl: string | undefined;
    artistName: string | undefined;
    artistId: string | undefined;
    completitionYear: number | undefined;
    width: number | undefined;
    height: number | undefined;
    image: string | undefined;
  }

  const getModalInfo = (artwork) => {
    console.log(artwork);
    setShowModal(true);
    setModalInfo(artwork);
  };
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      console.log(
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist
      );

      getArtworks(
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist
      );
    };
    getArtist();

    const getArtworks = async (artist) => {
      console.log(artist);
      const q = query(
        collection(db, "artists"),
        where("artistUrl", "==", artist),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs?.map((doc) => doc.data());
      console.log(docs);
      const setsOfartworks = sdivceIntoChunks(docs, 11);
      setArtworks(setsOfartworks);

      function sdivceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
        }
        return res;
      }
    };
    getArtist();
  }, [user.uid]);
  const saveToFavorites = async (id) => {
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksID: arrayUnion(modalInfo.id),
    });
  };
  return (
    <>
      <div
        style={{
          width: "80vw",
          margin: "0 auto",
          padding: "104px 0 20px",
          overflow: "hidden",
        }}
      >
        <h1>
          <strong>
            Save your favorite artwork by clicking on the heart icon, before you
            leave for the next gallery.
          </strong>
        </h1>
        <p>
          {artworks &&
            artistStyle?.filter(
              (location) => location?.artistUrl === artworks[0]?.[0].artistUrl
            )[0]?.artistStyle}
        </p>
      </div>
      <ArtworkGrid>
        {artworks?.map((setOfartwork, i) => (
          <ul key={i} className="grid">
            {setOfartwork.map((artWork, index) => {
              const { width, height } = ARTWORK_STYLE[index] ?? {}; //fallback to no value oif there's no image
              return (
                <ArtWork
                  key={artWork.image}
                  onClick={() => {
                    getModalInfo(artWork);
                  }}
                  width={width}
                  height={height}
                  imgSrc={artWork.image}
                />
              );
            })}
          </ul>
        ))}
      </ArtworkGrid>
      <div>
        {showModal && (
          <ArtworkModal>
            <CloseIcon role="button" onClick={() => setShowModal(false)} />
            <Content>
              <Text>
                <h1>
                  <strong>{modalInfo.title}</strong>
                </h1>
                <p>
                  {modalInfo.artistName}, {modalInfo.completitionYear}
                  <br />
                  {modalInfo.width} X {modalInfo.height} cm
                </p>
                <FavoritesIcon
                  role="button"
                  onClick={saveToFavorites}
                ></FavoritesIcon>
              </Text>

              <Figure>
                <ArtworkImage alt={modalInfo.title} src={modalInfo.image} />
              </Figure>
            </Content>
          </ArtworkModal>
        )}
      </div>

      <SignpostButton href="/artist-video">
        Hear about the artist
      </SignpostButton>
    </>
  );
}
