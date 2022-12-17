import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  addFavoriteArtworks,
  IFavoriteArtwork,
  deleteFavoriteArtworks,
  getUserInfo,
  getArtworks,
  IGeneralArtwork,
  IGeneralArtworks,
} from "../utils/firebaseFuncs";
import AlertBox from "../components/AlertBox";
import SignpostButton from "../components/Button";
import select from "../asset/selection-box.png";
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

  .grid div:nth-of-type(9) {
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

    .grid div:nth-of-type(1) {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .grid div:nth-of-type(2) {
      grid-column: 2 / span 2;
      grid-row: 1 / span 2;
    }

    .grid div:nth-of-type(3) {
      grid-column: 4;
      grid-row: 1;
    }

    .grid div:nth-of-type(4) {
      grid-column: 5;
      grid-row: 1;
    }

    .grid div:nth-of-type(5) {
      grid-column: 4;
      grid-row: 2;
    }

    .grid div:nth-of-type(6) {
      grid-column: 5;
      grid-row: 2 / span 2;
    }

    .grid div:nth-of-type(7) {
      grid-column: 2;
      grid-row: 3;
    }

    .grid div:nth-of-type(8) {
      grid-column: 1;
      grid-row: 3;
    }

    .grid div:nth-of-type(9) {
      grid-column: 3 / span 2;
      grid-row: 3 / span 2;
    }

    .grid div:nth-of-type(10) {
      grid-column: 1 / span 2;
      grid-row: 4;
    }

    .grid div:nth-of-type(11) {
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
}: {
  onClick: React.PointerEventHandler<HTMLDivElement>;
  imgSrc: string;
  width: string;
  height: string;
  favorite: IFavoriteArtwork[];
  artworkInfo: IGeneralArtwork;
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

const ARTWORK_STYLE: any = {
  0: { width: "640", height: "1138" },
  1: { width: "640", height: "427" },
  2: { width: "320", height: "427" },
};

interface IModalInfo {
  id?: string;
  title?: string;
  url?: string;
  artistUrl?: string;
  artistName?: string;
  artistId?: string;
  completitionYear?: number;
  width?: number;
  height?: number;
  image?: string;
}

function RenderArtworkModal({
  setShowModal,
  modalInfo,
  favorite,
  setFavorite,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalInfo: IModalInfo;
  favorite: IFavoriteArtwork[];
  setFavorite: React.Dispatch<React.SetStateAction<IFavoriteArtwork[]>>;
}) {
  const { user } = useAuth();
  const saveToFavorites = async (artwork: IGeneralArtwork) => {
    const favoriteArtwork = {
      id: artwork.id,
      title: artwork.title,
      year: artwork.completitionYear,
      artistName: artwork.artistName,
      image: artwork.image,
    };
    setFavorite((prev) => [...prev, favoriteArtwork]);
    addFavoriteArtworks(favoriteArtwork, user?.uid);
  };

  const deleteFromFavorites = async (artwork: IGeneralArtwork) => {
    const index = favorite?.indexOf(artwork);
    favorite?.splice(index, 1);
    const favoriteArtwork = {
      id: artwork.id,
      title: artwork.title,
      year: artwork.completitionYear,
      artistName: artwork.artistName,
      image: artwork.image,
    };
    setFavorite([...favorite]);
    deleteFavoriteArtworks(favoriteArtwork, user?.uid);
  };
  const collectArtworks = (modalInfo: IModalInfo) => {
    if (!favorite?.map((fav) => fav.id).includes(modalInfo.id))
      saveToFavorites(modalInfo);
    else if (favorite?.map((fav) => fav.id).includes(modalInfo.id)) {
      deleteFromFavorites(modalInfo);
    }
  };
  const { title, artistName, completitionYear, width, height, id, image } =
    modalInfo;
  return (
    <ArtworkModal>
      <CloseIcon role="button" onClick={() => setShowModal(false)} />
      <Content>
        <Text>
          <h1>
            <strong>{title}</strong>
          </h1>
          <p>
            {artistName}, {completitionYear}
            <br />
            {width} X {height} cm
          </p>
          <FavoritesIcon
            $heart={
              favorite?.map((fav) => fav.id).includes(id)
                ? `${filledHeart.src}`
                : `${unfilledHeart.src}`
            }
            role="button"
            onClick={() => collectArtworks(modalInfo)}
          ></FavoritesIcon>
        </Text>

        <Figure>
          <ModalImage alt={title} src={image} />
        </Figure>
      </Content>
    </ArtworkModal>
  );
}

export default function Masonry() {
  const { user } = useAuth();
  const router = useRouter();
  const [artworks, setArtworks] = useState<IGeneralArtworks[]>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<IModalInfo>({});
  const [favorite, setFavorite] = useState<IFavoriteArtwork[]>([]);

  const getModalInfo = (artwork: IGeneralArtwork) => {
    setShowModal(true);
    setModalInfo(artwork);
  };

  useEffect(() => {
    const getArtist = async () => {
      getUserInfo(user.uid).then(({ recommendedArtist, favoriteArtworks }) => {
        if (!recommendedArtist || !favoriteArtworks) {
          toast(() => <AlertBox />, {
            closeOnClick: false,
          });
          return;
        } else {
          getArtistWorks(recommendedArtist);
          setFavorite(favoriteArtworks);
        }
      });
    };

    const getArtistWorks = async (artist: string) => {
      getArtworks(artist).then(({ artworks }) => {
        const setsOfartworks = sliceIntoChunks(artworks, 11);
        setArtworks(setsOfartworks);
      });

      function sliceIntoChunks(arr: IGeneralArtworks, chunkSize: number) {
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

  const notify = (message: string) =>
    toast(message, {
      hideProgressBar: false,
      autoClose: 3000,
      icon: () => <Image alt="brand" width={30} height={30} src={select.src} />,
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

  const artistStyleText =
    artworks &&
    artistStyle?.filter(
      (location) => location?.artistUrl === artworks[0]?.[0].artistUrl
    )[0]?.artistStyle;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <InstructionText>
        <h1>
          <strong>
            Save your favorite artworks by clicking on the images, before
            leaving for the next gallery.
          </strong>
        </h1>
        <br />
        <p>{artistStyleText}</p>
      </InstructionText>
      <div onClick={toNextPage}>
        <SignpostButton href="">Hear about the artist</SignpostButton>
      </div>
      <ToTop onClick={scrollToTop}>
        <BackToTop />
        <ToTopText>
          <strong>
            To
            <br /> Top
          </strong>
        </ToTopText>
      </ToTop>
      <ArtworkGrid>
        {artworks?.map((setOfArtwork, index) => (
          <ul key={index} className="grid">
            {setOfArtwork.map((artWork, index: number) => {
              const { width, height } = ARTWORK_STYLE[index] ?? {};
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
                  imgSrc={artWork.image !== undefined ? artWork.image : ""}
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
          <RenderArtworkModal
            setShowModal={setShowModal}
            modalInfo={modalInfo}
            favorite={favorite}
            setFavorite={setFavorite}
          />
        )}
      </div>
    </>
  );
}
