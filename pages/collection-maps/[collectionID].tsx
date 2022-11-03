import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useRef, useState, useContext, useEffect } from "react";
import { ThemeColorContext } from "../../context/ProfileContext";

export default function ArtworkDetail() {
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
  const [themeColor] = useContext(ThemeColorContext);
  console.log(themeColor);
  return (
    <>
      {artwork &&
        artwork?.map((artwork, index) => (
          <div key={index}>
            <div style={{ width: "500px" }}>
              <img alt={artwork.id} src={artwork.image} />
            </div>
            <div>
              <h1>{artwork.title}</h1>
              <h2>
                <span>{artwork.artistName}</span>
                <span>{artwork.completitionYear}</span>
              </h2>
            </div>
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
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
      <div style={{ textAlign: "right" }}>
        <Link href="/artworks">
          <p>Explore more artworks!</p>
        </Link>
      </div>
    </>
  );
}
