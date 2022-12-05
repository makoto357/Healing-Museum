import styled from "@emotion/styled";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ZoomModal from "../../components/ZoomModal";
import magnifyingGlass from "../../asset/magnifying-glass.png";
import {
  TransformComponent,
  TransformWrapper,
} from "@pronestor/react-zoom-pan-pinch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignpostButton from "../../components/Button";
import map from "../../asset/world.png";
import filledHeart from "../../asset/black-heal.png";
import unfilledHeart from "../../asset/white-heal.png";

const ArtworkWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 800px) {
    margin-bottom: 40px;
  }
`;

const ArtworkImage = styled.img`
  height: 60vh;
  @media screen and (max-width: 800px) {
    height: auto;
    width: 80vw;
  }
`;

const SizeController = styled.div`
  flex-direction: column;
  display: flex;
  column-gap: 5px;
  margin-right: 20px;
`;
const TextWrapper = styled.section`
  margin: 35px auto 0;
  width: 50vw;
  max-width: 60vw;
  @media screen and (max-width: 800px) {
    width: 80vw;
    max-width: 80vw;
  }
`;

const TextHeader = styled.section`
  display: flex;
  padding-bottom: 10px;
`;

const IconGroup = styled.div`
  display: flex;
  column-gap: 20px;
  margin: 5px 0 0 30px;
`;

const LikeButton = styled.div<{ $heart: string }>`
  background-image: url(${(props) => props.$heart});
  width: 25px;
  height: 25px;
  background-size: cover;
`;

const DescriptionList = styled.div`
  list-style: none;
  padding: 10px 0;
`;

const CloseIcon = styled.button`
  background: white;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  opacity: 0.8;
  padding: 0;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 600;
  padding-left: 6px;
  &:hover {
    transition: border 0.5s;
    border: 1px solid white;
    height: 48px;
    width: 48px;
  }
`;

const ZoomIcon = styled.div`
  padding-top: 7px;
  padding-left: 6px;
  background: white;
  border-radius: 50px;
  border: none;
  opacity: 0.8;
  width: 50px;
  height: 50px;
  position: absolute;
  left: 2rem;
  cursor: pointer;
  z-index: 500;
  &:hover {
    transition: border 0.5s;
    border: 1px solid white;
    height: 48px;
    width: 48px;
  }
`;

const MagnifyingGlassWrapper = styled.div`
  position: absolute;
  bottom: -20px;
  right: 20px;
  border-radius: 50%;
  cursor: pointer;
  height: 40px;
  width: 40px;
  background: #e1ddd6;
  &:hover {
    transition: border 0.5s;
    border: 1px solid #e1ddd6;
    height: 38px;
    width: 38px;
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
  background: #e1ddd6;
`;

const LinkToMap = styled(Link)`
  position: fixed;
  bottom: 10px;
  left: 24px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 800px) {
    position: absolute;
  }
`;
const MapIcon = styled.div`
  background-image: url(${map.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  margin-right: auto;
  cursor: pointer;
  &:hover {
    height: 34px;
    width: 34px;
  }
`;
export default function ArtworkDetail() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [favorite, setFavorite] = useState([]);
  console.log(favorite);
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
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      setFavorite(docs[0].favoriteArtworksId);
    };
    getArtist();
  }, [collectionID, user.uid]);

  const saveToFavorites = async (artwork) => {
    setFavorite((prev) => [
      ...prev,
      {
        id: artwork.id,
        title: artwork.title,
        year: artwork.completitionYear,
        artistName: artwork.artistName,
        image: artwork.image,
      },
    ]);
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksId: arrayUnion({
        id: artwork.id,
        title: artwork.title,
        year: artwork.completitionYear,
        artistName: artwork.artistName,
        image: artwork.image,
      }),
    });
  };

  const deleteFromFavorites = async (artwork) => {
    const index = favorite?.indexOf(artwork);
    favorite?.splice(index, 1);
    console.log(favorite);
    setFavorite([...favorite]);
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksId: arrayRemove({
        id: artwork.id,
        title: artwork.title,
        year: artwork.completitionYear,
        artistName: artwork.artistName,
        image: artwork.image,
      }),
    });
  };

  return (
    <div style={{ paddingTop: "40px" }}>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
                  <h1 style={{ fontSize: "1.5rem" }}>{artwork.artistName}</h1>
                  <h2 style={{ fontSize: "1.25rem" }}>
                    <span>
                      <strong>
                        <i>{artwork.title} </i>
                      </strong>
                    </span>
                    <span>{artwork.completitionYear}</span>
                  </h2>
                </div>
                <IconGroup>
                  <LikeButton
                    $heart={
                      favorite?.map((f) => f.id).includes(artwork.id)
                        ? `${filledHeart.src}`
                        : `${unfilledHeart.src}`
                    }
                    role="button"
                    onClick={() => {
                      if (!favorite?.map((f) => f.id).includes(artwork.id))
                        saveToFavorites(artwork);
                      else if (
                        favorite?.map((f) => f.id).includes(artwork.id)
                      ) {
                        deleteFromFavorites(artwork);
                      }
                    }}
                  ></LikeButton>
                  <div
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={() =>
                      toast("Copied to clipboard.", {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      })
                    }
                  >
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
              </DescriptionList>
              <li
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: "10px",
                }}
              >
                {artwork?.tags?.map((tag, index) => (
                  <div
                    style={{
                      background: "#e1ddd6",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "fit-content",
                      margin: "5px 10px 5px 0px",
                    }}
                    key={index}
                  >
                    {" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.wikiart.org/en/Search/${tag}`}
                    >
                      <strong>#</strong>
                      {tag}{" "}
                    </a>
                  </div>
                ))}
              </li>
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
                          style={{ cursor: "pointer" }}
                          className="icon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5 8.086v18.875M8.088 17.5h18.813"
                            fill="none"
                            stroke="black"
                          ></path>
                        </svg>
                      </ZoomIcon>
                      <ZoomIcon
                        style={{ top: "4rem" }}
                        onClick={() => zoomOut()}
                        aria-label="Zoom out"
                      >
                        <svg
                          style={{ cursor: "pointer" }}
                          className="icon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="none"
                            stroke="black"
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
                        style={{ cursor: "pointer" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                      >
                        <path
                          d="M24.251 10.935L10.746 24.12m.194-13.344l13.143 13.462"
                          fill="none"
                          stroke="black"
                        ></path>
                      </svg>
                    </CloseIcon>
                  </div>
                )}
              </TransformWrapper>
            ))}
        </ZoomModal>
      )}

      <LinkToMap href="/collection-maps">
        <MapIcon />
        <div>
          <strong>Back to map</strong>
        </div>
      </LinkToMap>
      <div style={{ paddingBottom: "60px" }}>
        <SignpostButton href="/artworks">Explore more artworks</SignpostButton>
      </div>
    </div>
  );
}
