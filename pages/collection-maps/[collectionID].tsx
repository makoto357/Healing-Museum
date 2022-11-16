import styled from "@emotion/styled";
import Link from "next/link";
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
import ZoomModal from "../../components/ZoomModal";
import heart from "../../asset/heart.png";
import magnifyingGlass from "../../asset/magnifying-glass.png";
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
  flex-direction: column;
  display: flex;
  column-gap: 5px;
  margin-right: 20px;
`;
const TextWrapper = styled.section`
  margin: 24px auto 0;
  width: fit-content;
  max-width: 80vw;
`;

const TextHeader = styled.section`
  display: flex;
  padding-bottom: 10px;
`;

const IconGroup = styled.div`
  display: flex;
  column-gap: 20px;
  margin-left: 30px;
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

const CloseIcon = styled.button`
  background: #262626;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  opacity: 0.8;
  padding: 0;
  width: 35px;
  height: 35px;
  position: absolute;
  top: 1rem;
  right: 2rem;
  z-index: 200;
  &:hover {
    transition: border 0.3s;
    border: 1px solid white;
    // transform: translateY(calc(24px + 0.75vw)) scale(1);
  }
`;

const ZoomIcon = styled.button`
  background: #262626;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  width: 35px;
  height: 35px;
  position: absolute;
  left: 2rem;
  z-index: 500;
  &:hover {
    transition: border 0.3s;
    border: 1px solid white;
    // transform: translateY(calc(24px + 0.75vw)) scale(1);
  }
`;

const MagnifyingGlassWrapper = styled.div`
  position: absolute;
  bottom: -20px;
  right: 40px;
  border-radius: 50%;
  cursor: pointer;
  height: 40px;
  width: 40px;
  background: white;
  &:hover {
    transition: border 0.5s;
    border: 1px solid black;
  }
`;

const MagnifyingGlass = styled.div`
  margin: 8px auto 0;
  border-radius: 0px;
  width: 60%;
  height: 60%;
  z-index: 200;
  border: none;
  cursor: pointer;
  background: white;
`;
export default function ArtworkDetail() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

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
    () => import("../../components/Clipboard").then((mod) => mod.CopyClipboard),
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
            <div style={{ position: "relative" }}>
              <ArtworkImage alt={artwork.id} src={artwork.image} />
              <MagnifyingGlassWrapper onClick={() => setShowModal(true)}>
                <MagnifyingGlass
                  style={{
                    backgroundImage: `url(${magnifyingGlass.src})`,
                    backgroundSize: "cover",
                  }}
                />
              </MagnifyingGlassWrapper>
            </div>

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
                <li>
                  <strong>Collection: </strong>
                  {artwork.galleries}
                </li>
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
      {showModal && (
        <ZoomModal>
          {artwork &&
            artwork?.map((artwork, index) => (
              <TransformWrapper
                initialScale={1}
                key={`${index} + ${artwork.id}`}
              >
                {({ zoomIn, zoomOut, ...rest }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <SizeController>
                      <ZoomIcon onClick={() => zoomIn()} aria-label="Zoom in">
                        <svg
                          className="icon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5 8.086v18.875M8.088 17.5h18.813"
                            fill="none"
                            stroke="#fff"
                          ></path>
                        </svg>
                      </ZoomIcon>
                      <ZoomIcon
                        style={{ top: "3rem" }}
                        onClick={() => zoomOut()}
                        aria-label="Zoom out"
                      >
                        <svg
                          className="icon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="none"
                            stroke="#fff"
                            d="M8.088 17.5h18.813"
                          ></path>
                        </svg>
                      </ZoomIcon>
                    </SizeController>
                    <TransformComponent>
                      <img
                        style={{
                          height: "96vh",
                          objectFit: "contain",
                          marginBottom: "auto",
                        }}
                        alt={artwork.id}
                        src={artwork.image}
                      />
                    </TransformComponent>
                    <CloseIcon
                      onClick={() => setShowModal(false)}
                      aria-label="Close viewer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                      >
                        <path
                          d="M24.251 10.935L10.746 24.12m.194-13.344l13.143 13.462"
                          fill="none"
                          stroke="#fff"
                        ></path>
                      </svg>
                    </CloseIcon>
                  </div>
                )}
              </TransformWrapper>
            ))}
        </ZoomModal>
      )}
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
