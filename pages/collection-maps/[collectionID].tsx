import styled from "@emotion/styled";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

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
import heart from "../../asset/heart.png";
import plus from "../../asset/plus.png";
import minus from "../../asset/minus.png";

import {
  TransformComponent,
  TransformWrapper,
} from "@pronestor/react-zoom-pan-pinch";
const ArtworkWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ArtworkImage = styled.img`
  height: 60vh;
`;

const SizeController = styled.div`
  margin: 5px 0;
  display: flex;
  column-gap: 5px;
  justify-content: flex-end;
  max-width: 60vw;
  width: 100%;
`;
const ZoomIn = styled.div`
  background-image: url(${plus.src});
  width: 25px;
  height: 25px;
  background-size: cover;
  margin-bottom: 5px;
`;

const ZoomOut = styled.div`
  background-image: url(${minus.src});
  width: 25px;
  height: 25px;
  background-size: cover;
`;
const TextWrapper = styled.section`
  margin: 24px auto 0;
  max-width: 60vw;
  width: 100%;
`;

const TextHeader = styled.section`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const IconGroup = styled.div`
  display: flex;
  column-gap: 20px;
`;

const LikeButton = styled.div`
  background-image: url(${heart.src});
  width: 25px;
  height: 25px;
  background-size: cover;
`;

const DescriptionList = styled.div`
  list-style: none;
  padding: 10px 0;
`;
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

  const CC = dynamic(
    () =>
      import("../../components/copy-clipboard").then(
        (mod) => mod.CopyClipboard
      ),
    { ssr: false }
  );

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
      {artwork &&
        artwork?.map((artwork, index) => (
          <ArtworkWrapper key={index}>
            <TransformWrapper initialScale={1}>
              {({ zoomIn, zoomOut, ...rest }) => (
                <>
                  <TransformComponent>
                    <ArtworkImage alt={artwork.id} src={artwork.image} />
                  </TransformComponent>
                  <SizeController className="tools">
                    <ZoomIn role="button" onClick={() => zoomIn()} />
                    <ZoomOut role="button" onClick={() => zoomOut()} />
                  </SizeController>
                </>
              )}
            </TransformWrapper>

            <TextWrapper>
              <TextHeader>
                <div>
                  <h1>
                    <strong>{artwork.title}</strong>
                    <strong></strong>
                  </h1>
                  <h2>
                    <span>{artwork.artistName}, </span>
                    <span>{artwork.completitionYear}</span>
                  </h2>
                </div>
                <IconGroup>
                  <LikeButton
                    role="button"
                    onClick={saveToFavorites}
                  ></LikeButton>
                  <div style={{ width: "20px", height: "20px" }}>
                    <CC content={window.location.href} />
                  </div>
                </IconGroup>
              </TextHeader>
              <p>{artwork.description}</p>
              <DescriptionList>
                <li>
                  {" "}
                  <strong>Genres: </strong>
                  {artwork.genres}
                </li>
                <li>
                  <strong>Styles: </strong>
                  {artwork.styles}
                </li>
                <li>
                  <strong>Medium: </strong>

                  {artwork?.media?.map((medium, index) => (
                    <span key={index}>{medium}, </span>
                  ))}
                </li>
                <li>
                  <strong>Dimensions: </strong>
                  {artwork.sizeX} X {artwork.sizeY} cm
                </li>
                <li>Collection of the {artwork.galleries}</li>
                <li>
                  {artwork?.tags?.map((tag, index) => (
                    <span key={index}>
                      {" "}
                      <strong>#</strong>
                      {tag}{" "}
                    </span>
                  ))}
                </li>
              </DescriptionList>
            </TextWrapper>
          </ArtworkWrapper>
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
    </>
  );
}
