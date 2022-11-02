import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useContext, use } from "react";
import api from "../utils/api";
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
export default function Artworks() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const getArtist = async () => {
      const q = query(
        collection(db, "vincent-van-gogh"),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      console.log(docs);
      setArtworks(docs);
    };
    getArtist();
  }, []);

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
          artworks.map((artwork) => (
            <Image alt={artwork.title} key={artwork.id} src={artwork.image} />
          ))}
      </div>
    </>
  );
}
