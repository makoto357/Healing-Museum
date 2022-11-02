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
import Modal from "../components/modal";
export default function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const getModalInfo = (artwork) => {
    setShowModal(true);
    setModalInfo(artwork);
  };
  console.log(modalInfo);
  useEffect(() => {
    console.log("hello?");
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
        <style jsx>{`
          .painints-container {
            display: flex;
            overflow: x;
            height: 500px;
          }
        `}</style>
        {artworks &&
          artworks?.map((artwork) => (
            <div key={artwork.id} onClick={() => getModalInfo(artwork)}>
              <img alt={artwork.title} src={artwork.image} />
            </div>
          ))}
      </div>
      <div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            Hello from the modal!
            <p>{JSON.stringify(modalInfo)}</p>
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
