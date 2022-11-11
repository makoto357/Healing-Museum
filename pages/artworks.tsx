import styled from "@emotion/styled";

import Link from "next/link";
import { useEffect, useRef, useState, useContext, use } from "react";
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
import { ThemeColorContext } from "../context/ColorContext";

import heart from "../asset/17d0747c12d59dd8fd244e90d91956b9.png";
import Modal from "../components/Modal";
export default function Artworks() {
  const { user } = useAuth();
  const [themeColor] = useContext(ThemeColorContext);

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
      setArtworks(docs);
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
      <div className="painints-container">
        <h1>Click to see the artwork details:</h1>
        <style jsx>{`
          .painints-container {
            display: flex;
            flex-wrap: wrap;
            row-gap: 50px;
            column-gap: 20px;
          }
          .imageBox {
            box-shadow: 12px 12px 2px 1px ${themeColor};
            display: inline-block;
            width: 250px;
          }
        `}</style>
        {artworks &&
          artworks?.map((artwork) => (
            <div
              className="imageBox"
              key={artwork.id}
              onClick={(e) => {
                console.log(e.target);
                getModalInfo(artwork);
              }}
            >
              <img alt={artwork.title} src={artwork.image} />
            </div>
          ))}
      </div>
      <div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <img
              alt={modalInfo.title}
              src={modalInfo.image}
              style={{ width: "250px" }}
            />
            <h1>{modalInfo.title}</h1>
            <p>{modalInfo.artistName}</p>
            <span>{modalInfo.completitionYear}</span>
            <p>
              {modalInfo.width} X {modalInfo.height} cm
            </p>
            <div
              role="button"
              style={{
                backgroundImage: `url(${heart.src})`,
                width: "30px",
                height: "30px",
                backgroundSize: "cover",
              }}
              onClick={saveToFavorites}
            ></div>
          </Modal>
        )}
      </div>
      <div style={{ textAlign: "right" }}>
        <Link href="/artist-video">
          <p>See some videos!</p>
        </Link>
      </div>
    </>
  );
}
