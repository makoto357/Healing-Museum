import styled from "@emotion/styled";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import SignpostButton from "../components/Button";
import select from "../asset/selection-box.png";

import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import ArtworkModal from "../components/ArtworkModal";
import filledHeart from "../asset/black-heal.png";
import unfilledHeart from "../asset/white-heal.png";
import close from "../asset/cancel.png";
import artistStyle from "../public/artist-info/visitorJourney.json";
import upArrow from "../asset/arrow-up.png";
const ArtworkImage = styled.img`
  cursor: zoom-in;
`;

const ArtworkGrid = styled.section`
  margin: 0 auto;
  padding-bottom: 60px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  .grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 30vw;
    list-style: none;
    width: 80vw;
    margin: auto;
  }

  .grid div {
    background: #bbb6ac;
  }

  .grid div:nth-child(9) {
    grid-column: 1 / -1;
    grid-row: span 2;
  }

  .grid img {
    width: 100%;
    height: 100%;
    transition: 0.5s;
  }

  .grid img:hover {
    transform: scale(1.1);
  }

  .grid img {
    object-fit: cover;
  }

  @media (min-width: 850px) {
    .grid {
      grid-gap: 24px;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: 12vw;
    }

    .grid div:nth-child(1) {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .grid div:nth-child(2) {
      grid-column: 2 / span 2;
      grid-row: 1 / span 2;
    }

    .grid div:nth-child(3) {
      grid-column: 4;
      grid-row: 1;
    }

    .grid div:nth-child(4) {
      grid-column: 5;
      grid-row: 1;
    }

    .grid div:nth-child(5) {
      grid-column: 4;
      grid-row: 2;
    }

    .grid div:nth-child(6) {
      grid-column: 5;
      grid-row: 2 / span 2;
    }

    .grid div:nth-child(7) {
      grid-column: 2;
      grid-row: 3;
    }

    .grid div:nth-child(8) {
      grid-column: 1;
      grid-row: 3;
    }

    .grid div:nth-child(9) {
      grid-column: 3 / span 2;
      grid-row: 3 / span 2;
    }

    .grid div:nth-child(10) {
      grid-column: 1 / span 2;
      grid-row: 4;
    }

    .grid div:nth-child(11) {
      grid-column: 5;
      grid-row: 4;
    }
  }
`;

const CloseIcon = styled.div`
  background-image: url(${close.src});
  background-size: cover;
  width: 25px;
  height: 25px;
  position: fixed;
  top: 4rem;
  right: 1.5rem;
  @media screen and (max-width: 1050px) {
    right: 0.5rem;
  }
  @media screen and (max-width: 650px) {
    top: 3px;
    right: 3px;
    width: 12px;
    height: 12px;
  }
`;

const Content = styled.div`
  display: flex;
  height: 100%;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Text = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 36px;
  @media screen and (max-width: 600px) {
    row-gap: 0px;
  }
`;

const Figure = styled.figure`
  height: 100%;
  width: 100%;
  display: flex;
  max-height: calc(100vh - 12rem);
  @media screen and (max-width: 600px) {
    height: 80%;
    width: 80%;
    margin: auto;
  }
`;

const FavoritesIcon = styled.div<{ $heart: string }>`
  background-image: url(${(props) => props.$heart});
  width: 30px;
  height: 30px;
  background-size: cover;
`;

const ToTop = styled.div`
  position: fixed;
  bottom: 60px;
  right: 3vw;
  text-align: center;
  @media screen and (max-width: 800px) {
    bottom: 24px;
  }
`;

const InstructionText = styled.div`
  width: 80vw;
  margin: 0 auto;
  padding: 40px 0 0px;
`;

const ToTopText = styled.div`
  cursor: pointer;
`;

const BackToTop = styled.div`
  cursor: pointer;

  background-image: url(${upArrow.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  margin: auto;
`;

const ModalImage = styled.img`
  display: block;
  width: 100%;
  max-height: inherit;
  object-fit: contain;
  object-position: center;
  margin-bottom: auto;
`;

const Frame = styled.figure<{ $highlightedBorder: string }>`
  border: ${(props) => props.$highlightedBorder};
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

function ArtWork({
  onClick,
  imgSrc,
  width = "320",
  height = "427",
  favorite,
  artworkInfo,
}) {
  return (
    <div onClick={onClick}>
      <Frame
        $highlightedBorder={
          favorite?.map((f) => f.id).includes(artworkInfo?.id)
            ? "8px solid #bbb6ac"
            : "none"
        }
      >
        <ArtworkImage width={width} height={height} src={imgSrc} alt="" />
      </Frame>
    </div>
  );
}

const ARTWORK_STYLE = {
  0: { width: "640", height: "1138" },
  1: { width: "640", height: "427" },
  2: { width: "320", height: "427" },
};

export default function Masonry() {
  const { user } = useAuth();
  const router = useRouter();
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
  const [favorite, setFavorite] = useState([]);
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
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const recommendedArtist =
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          ?.recommendedArtist;
      const favoriteArtworks = docs[0].favoriteArtworksId;
      if (!recommendedArtist || !favoriteArtworks) {
        toast(() => (
          <div>
            <p>Take the art quiz to get your artist recommendation!</p>
            <div style={{ width: "100%" }}>
              <button
                style={{
                  marginTop: "5px",
                  padding: "3px 10px",
                  background: "black",
                  color: "white",
                }}
                onClick={() => router.push("/quiz")}
              >
                Take a quiz
              </button>
            </div>
          </div>
        ));

        return;
      } else {
        getArtworks(recommendedArtist);
        setFavorite(favoriteArtworks);
      }
    };

    const getArtworks = async (artist) => {
      const q = query(
        collection(db, "artists"),
        where("artistUrl", "==", artist),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs?.map((doc) => doc.data());
      const setsOfartworks = sdivceIntoChunks(docs, 11);
      setArtworks(setsOfartworks);

      function sdivceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
        }
        return res;
      }
    };
    if (user) {
      getArtist();
    }
  }, [user, router]);
  const saveToFavorites = async (id) => {
    console.log(id);
    setFavorite((prev) => {
      console.log([...prev]);
      return [
        ...prev,
        {
          id: id.id,
          title: id.title,
          year: id.completitionYear,
          artistName: id.artistName,
          image: id.image,
        },
      ];
    });
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksId: arrayUnion({
        id: modalInfo.id,
        title: modalInfo.title,
        year: modalInfo.completitionYear,
        artistName: modalInfo.artistName,
        image: modalInfo.image,
      }),
    });
  };

  const deleteFromFavorites = async (id) => {
    const index = favorite?.indexOf(id);
    favorite?.splice(index, 1);
    setFavorite([...favorite]);
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksId: arrayRemove({
        id: id.id,
        title: id.title,
        year: id.completitionYear,
        artistName: id.artistName,
        image: id.image,
      }),
    });
  };

  const notify = (message) =>
    toast(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      icon: () => <img src={select.src} />,
    });

  const toNextPage = () => {
    if (favorite.length == 0) {
      notify(
        "Please save at least 1 artwork to your favorites, before leaving this gallery."
      );
    } else {
      router.push("/artist-video");
    }
  };
  return (
    <>
      <InstructionText>
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />
        <h1>
          <strong>
            Save your favorite artworks by clicking on the images, before
            leaving for the next gallery.
          </strong>
        </h1>
        <br />
        <p>
          {artworks &&
            artistStyle?.filter(
              (location) => location?.artistUrl === artworks[0]?.[0].artistUrl
            )[0]?.artistStyle}
        </p>
      </InstructionText>
      <div onClick={toNextPage}>
        <SignpostButton href="">Hear about the artist</SignpostButton>
      </div>
      <ToTop
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <BackToTop />
        <ToTopText>
          <strong>
            To
            <br /> Top
          </strong>
        </ToTopText>
      </ToTop>
      <ArtworkGrid>
        {artworks?.map((setOfartwork, i) => (
          <ul key={i} className="grid">
            {setOfartwork.map((artWork, index) => {
              const { width, height } = ARTWORK_STYLE[index] ?? {}; //fallback to no value oif there's no image
              return (
                <ArtWork
                  favorite={favorite}
                  artworkInfo={artWork}
                  key={artWork.image}
                  onClick={() => {
                    getModalInfo(artWork);
                  }}
                  width={width}
                  height={height}
                  imgSrc={artWork.image}
                />
              );
            })}
          </ul>
        ))}
      </ArtworkGrid>
      <div onClick={toNextPage}>
        <SignpostButton href="">Hear about the artist</SignpostButton>
      </div>
      <div>
        {showModal && (
          <ArtworkModal>
            <CloseIcon role="button" onClick={() => setShowModal(false)} />
            <Content>
              <Text>
                <h1>
                  <strong>{modalInfo.title}</strong>
                </h1>
                <p>
                  {modalInfo.artistName}, {modalInfo.completitionYear}
                  <br />
                  {modalInfo.width} X {modalInfo.height} cm
                </p>
                <FavoritesIcon
                  $heart={
                    favorite?.map((f) => f.id).includes(modalInfo.id)
                      ? `${filledHeart.src}`
                      : `${unfilledHeart.src}`
                  }
                  role="button"
                  onClick={() => {
                    if (!favorite?.map((f) => f.id).includes(modalInfo.id))
                      saveToFavorites(modalInfo);
                    else if (
                      favorite?.map((f) => f.id).includes(modalInfo.id)
                    ) {
                      deleteFromFavorites(modalInfo);
                    }
                  }}
                ></FavoritesIcon>
              </Text>

              <Figure>
                <ModalImage alt={modalInfo.title} src={modalInfo.image} />
              </Figure>
            </Content>
          </ArtworkModal>
        )}
      </div>
    </>
  );
}
