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
} from "firebase/firestore";

import { db } from "../config/firebase";
import Modal from "../components/Modal";
export default function Artworks() {
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
    setShowModal(true);
    setModalInfo(artwork);
  };
  useEffect(() => {
    const getArtist = async () => {
      const q = query(
        collection(db, "artists"),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs?.map((doc) => doc.data());
      console.log(docs);
      setArtworks(docs);
    };
    getArtist();
  }, []);
  console.log(artworks);
  return (
    <>
      <div className="painints-container">
        <h1>Click to see the artwork details:</h1>
        <style jsx>{`
          .painints-container {
            display: flex;
            overflow: x;
            height: 500px;
          }
        `}</style>
        {artworks &&
          artworks?.map((artwork) => (
            <div key={artwork.id} onClick={(artwork) => getModalInfo(artwork)}>
              <img
                alt={artwork.title}
                src={artwork.image}
                style={{ width: "250px" }}
              />
            </div>
          ))}
      </div>
      <div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <img src={modalInfo.image} style={{ width: "250px" }} />
            <h1>{modalInfo.title}</h1>
            <p>{modalInfo.artistName}</p>
            <span>{modalInfo.completitionYear}</span>
            <p>
              {modalInfo.width} X {modalInfo.height} cm
            </p>
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
