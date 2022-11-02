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
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>
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
            <div key={artwork.id} onClick={() => setShowModal(true)}>
              <img alt={artwork.title} src={artwork.image} />
            </div>
          ))}
      </div>
      <div>
        <button onClick={() => setShowModal(true)}>Open Modal</button>
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          Hello from the modal!
        </Modal>
      </div>
    </>
  );
}
