import styled from "@emotion/styled";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import {
  IArtwork,
  IArtworks,
  addFavoriteArtworks,
  IFavoriteArtwork,
  deleteFavoriteArtworks,
  getUserInfo,
} from "../../utils/firebaseFuncs";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import magnifyingGlass from "../../asset/magnifying-glass.png";
import "react-toastify/dist/ReactToastify.css";
import SignpostButton from "../../components/Button";
import map from "../../asset/world.png";
import filledHeart from "../../asset/black-heal.png";
import unfilledHeart from "../../asset/white-heal.png";

const Wrapper = styled.div`
  padding-top: 40px;
`;
const ArtworkWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 800px) {
    margin-bottom: 40px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const ArtworkImage = styled.img`
  height: 60vh;
  @media screen and (max-width: 800px) {
    height: auto;
    width: 80vw;
  }
`;

const TextWrapper = styled.section`
  margin: 35px auto 0;
  width: 60vw;
  @media screen and (max-width: 800px) {
    width: 80vw;
    max-width: 80vw;
  }
`;

const TextHeader = styled.section`
  display: flex;
  padding-bottom: 10px;
`;

const ArtistName = styled.h1`
  font-size: 1.5rem;
`;
const ArtworkTitle = styled.h2`
  font-size: 1.25rem;
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
const ClipboardButton = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const DescriptionList = styled.div`
  list-style: none;
  padding: 10px 0;
`;

const ArtTagGroup = styled.li`
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
`;
const ArtTag = styled.div`
  background: #e1ddd6;
  border-radius: 5px;
  padding: 5px;
  width: fit-content;
  margin: 5px 5px 5px 0px;
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
    border: 1px solid #e1ddd6;
    height: 42px;
    width: 42px;
  }
`;

const MagnifyingGlass = styled.div<{ $bgImage: string }>`
  margin: 8px auto 0;
  border-radius: 0px;
  width: 60%;
  height: 60%;
  z-index: 200;
  cursor: pointer;
  background: #e1ddd6;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
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
const SignpostButtonWrapper = styled.div`
  padding-bottom: 60px;
`;
export default function ArtworkDetail() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [favorite, setFavorite] = useState<IFavoriteArtwork[]>([]);
  const router = useRouter();
  const collectionID = router.query.collectionID;
  const [artwork, setArtwork] = useState<IArtworks>([]);
  const CC = dynamic(
    () =>
      import("./components/ClipboardComponent").then(
        (mod) => mod.CopyClipboard
      ),
    { ssr: false }
  );

  const DynamicZoomModal = dynamic(() =>
    import("./components/ModalComponent").then((mod) => mod.ZoomModal)
  );

  useEffect(() => {
    const getHighlightedArtworks = async () => {
      const artworkRef = query(
        collection(db, "artworks"),
        where("id", "==", collectionID)
      );
      const querySnapshot = await getDocs(artworkRef);
      const docs: IArtworks = querySnapshot.docs?.map((doc) =>
        doc.data()
      ) as IArtworks;
      setArtwork(docs);
    };

    if (user) {
      getHighlightedArtworks();
      const getUserData = async () => {
        const { favoriteArtworks } = await getUserInfo(user?.uid);

        setFavorite(favoriteArtworks);
      };
      getUserData();
    }
  }, [user, collectionID]);

  const saveToFavorites = async (artwork: IArtwork) => {
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

  const deleteFromFavorites = async (artwork: IArtwork) => {
    const index = favorite?.indexOf(artwork);
    favorite?.splice(index, 1);
    const favoriteArtwork: IFavoriteArtwork = {
      id: artwork.id,
      title: artwork.title,
      year: artwork.completitionYear,
      artistName: artwork.artistName,
      image: artwork.image,
    };
    setFavorite([...favorite]);
    deleteFavoriteArtworks(favoriteArtwork, user?.uid);
  };

  const collectArtworks = (artwork: IArtwork) => {
    if (!favorite?.map((fav) => fav.id).includes(artwork.id))
      saveToFavorites(artwork);
    else if (favorite?.map((fav) => fav.id).includes(artwork.id)) {
      deleteFromFavorites(artwork);
    }
  };
  return (
    <Wrapper>
      {artwork &&
        artwork?.map((artwork) => {
          const {
            id,
            image,
            artistName,
            title,
            completitionYear,
            description,
            genres,
            styles,
            media,
            sizeX,
            sizeY,
            galleries,
            tags,
          } = artwork;
          return (
            <ArtworkWrapper key={id}>
              <ImageWrapper>
                <ArtworkImage alt={id} src={image} />
                <MagnifyingGlassWrapper onClick={() => setShowModal(true)}>
                  <MagnifyingGlass $bgImage={magnifyingGlass.src} />
                </MagnifyingGlassWrapper>
              </ImageWrapper>

              <TextWrapper>
                <TextHeader>
                  <div>
                    <ArtistName>{artistName}</ArtistName>
                    <ArtworkTitle>
                      <span>
                        <strong>
                          <i>{title} </i>
                        </strong>
                      </span>
                      <span>{completitionYear}</span>
                    </ArtworkTitle>
                  </div>
                  <IconGroup>
                    <LikeButton
                      $heart={
                        favorite?.map((fav) => fav.id).includes(id)
                          ? `${filledHeart.src}`
                          : `${unfilledHeart.src}`
                      }
                      role="button"
                      onClick={() => collectArtworks(artwork)}
                    ></LikeButton>

                    <ClipboardButton
                      onClick={() =>
                        toast("Copied to clipboard.", {
                          position: "bottom-right",
                          autoClose: 1000,
                        })
                      }
                    >
                      <CC content={window.location.href} />
                    </ClipboardButton>
                  </IconGroup>
                </TextHeader>
                <p>{description}</p>
                <DescriptionList>
                  <li>
                    <strong>Genres: </strong>
                    {genres}
                  </li>
                  <li>
                    <strong>Styles: </strong>
                    {styles}
                  </li>
                  <li>
                    <strong>Medium: </strong>

                    {media?.map((medium) => (
                      <span key={medium}>{medium}, </span>
                    ))}
                  </li>
                  <li>
                    <strong>Dimensions: </strong>
                    {sizeX} X {sizeY} cm
                  </li>
                  <li>
                    <strong>Collection: </strong>
                    {galleries}
                  </li>
                </DescriptionList>

                <ArtTagGroup>
                  {tags?.map((tag) => (
                    <ArtTag key={tag}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.wikiart.org/en/Search/${tag}`}
                      >
                        <strong>#</strong>
                        {tag}
                      </a>
                    </ArtTag>
                  ))}
                </ArtTagGroup>
              </TextWrapper>
            </ArtworkWrapper>
          );
        })}
      {showModal && (
        <DynamicZoomModal artwork={artwork} setShowModal={setShowModal} />
      )}
      <LinkToMap href="/collection-maps">
        <MapIcon />
        <div>
          <strong>Back to map</strong>
        </div>
      </LinkToMap>

      <SignpostButtonWrapper>
        <SignpostButton href="/artworks">Explore more artworks</SignpostButton>
      </SignpostButtonWrapper>
    </Wrapper>
  );
}
