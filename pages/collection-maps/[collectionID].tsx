import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useRef, useState, useEffect, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { ThemeColorContext } from "../../context/ColorContext";
import heart from "../../asset/17d0747c12d59dd8fd244e90d91956b9.png";

export default function ArtworkDetail() {
  const { user } = useAuth();

  const router = useRouter();
  const collectionID = router.query.collectionID;
  const [artwork, setArtwork] = useState<IArtworks>([
    {
      id: undefined,
      title: undefined,
      url: undefined,
      artistUrl: undefined,
      artistName: undefined,
      artistId: undefined,
      completitionYear: undefined,
      dictionaries: undefined,
      location: undefined,
      period: null,
      serie: null,
      genres: undefined,
      styles: undefined,
      media: undefined,
      sizeX: undefined,
      sizeY: undefined,
      diameter: undefined,
      galleries: undefined,
      geometry: undefined,
      tags: undefined,
      description: undefined,
      width: undefined,
      image: undefined,
      height: undefined,
    },
  ]);

  interface IArtwork {
    id: string | undefined;
    title: string | undefined;
    url: string | undefined;
    artistUrl: string | undefined;
    artistName: string | undefined;
    artistId: string | undefined;
    completitionYear: number | undefined;
    dictionaries: string[] | undefined;
    location: string | undefined;
    period: {} | null;
    serie: {} | null;
    genres: string[] | undefined;
    styles: string[] | undefined;
    media: string[] | undefined;
    sizeX: number | undefined;
    sizeY: number | undefined;
    diameter: string[] | undefined; /////>>>????
    galleries: string[] | undefined;
    geometry: { lat: number; lng: number } | undefined;
    tags: string[] | undefined;
    description: string | undefined;
    width: number | undefined;
    image: string | undefined;
    height: number | undefined;
  }
  interface IArtworks extends Array<IArtwork> {}

  useEffect(() => {
    const getArtworks = async () => {
      const q = query(
        collection(db, "artworks"),
        where("id", "==", collectionID)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs?.map((doc) => doc.data());
      console.log(docs);
      const IArtworks = docs as IArtworks;
      setArtwork(IArtworks);
    };
    getArtworks();
  }, [collectionID]);

  const saveToFavorites = async (id) => {
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksID: arrayUnion(collectionID),
    });
  };

  const [themeColor] = useContext(ThemeColorContext);
  console.log(themeColor);
  return (
    <>
      <style jsx>
        {`
          section {
            text-align: center;
          }
          .imageBox {
            box-shadow: 12px 12px 2px 1px ${themeColor};
            display: inline-block;
          }
        `}
      </style>
      <section>
        {artwork &&
          artwork?.map((artwork, index) => (
            <div key={index}>
              <div className="imageBox">
                <img alt={artwork.id} src={artwork.image} />
              </div>
              <div>
                <h1>{artwork.title}</h1>
                <h2>
                  <span>{artwork.artistName}</span>
                  <span>{artwork.completitionYear}</span>
                </h2>
              </div>
              <div
                role="button"
                style={{
                  margin: "auto",
                  backgroundImage: `url(${heart.src})`,
                  width: "30px",
                  height: "30px",
                  backgroundSize: "cover",
                }}
                onClick={saveToFavorites}
              ></div>
              <section>
                <div>
                  <p>{artwork.description}</p>
                </div>
              </section>
              <section>
                <div>
                  <ul>
                    <li>
                      <span>{artwork.genres}</span>
                    </li>
                    <li>
                      <span>{artwork.styles}</span>
                    </li>
                    <li>
                      {artwork?.media?.map((medium, index) => (
                        <span key={index}>{medium},</span>
                      ))}
                    </li>
                    <li>
                      <p>
                        {artwork.sizeX} X {artwork.sizeY} cm
                      </p>
                    </li>
                    <li>Collection of the {artwork.galleries}</li>
                    {artwork?.tags?.map((tag, index) => (
                      <span key={index}>#{tag} </span>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          ))}
        <div style={{ textAlign: "left" }}>
          <Link href="/collection-maps">
            <p>back to map page</p>
          </Link>
        </div>

        <div style={{ textAlign: "right" }}>
          <Link href="/artworks">
            <p>Explore more artworks!</p>
          </Link>
        </div>
      </section>
    </>
  );
}
