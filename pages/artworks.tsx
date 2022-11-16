import styled from "@emotion/styled";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import heart from "../asset/heart.png";
import ArtworkModal from "../components/ArtworkModal";

const ArtworkGrid = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const CloseIcon = styled.div`
  position: fixed;
  top: 1rem;
  right: 2rem;
`;

const Content = styled.div`
  display: flex;
  height: 100%;
`;

const Text = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 36px;
`;

const Figure = styled.figure`
  height: 100%;
  width: 100%;
  display: flex;
  max-height: calc(100vh - 12rem);
`;

const FavoritesIcon = styled.div`
  background-image: url(${heart.src});
  width: 30px;
  height: 30px;
  background-size: cover;
`;

const ArtworkImage = styled.img`
  display: block;
  width: 100%;
  max-height: inherit;
  object-fit: contain;
  object-position: center;
  margin-bottom: auto;
`;
export default function Masonry() {
  const { user } = useAuth();
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
    console.log(artwork);
    setShowModal(true);
    setModalInfo(artwork);
  };
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      console.log(
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist
      );

      getArtworks(
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist
      );
    };
    getArtist();

    const getArtworks = async (artist) => {
      console.log(artist);
      const q = query(
        collection(db, "artists"),
        where("artistUrl", "==", artist),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs?.map((doc) => doc.data());
      console.log(docs);
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
    getArtist();
  }, [user.uid]);
  const saveToFavorites = async (id) => {
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksID: arrayUnion(modalInfo.id),
    });
  };

  return (
    <>
      <h1>Click to see the artwork details:</h1>
      <ArtworkGrid>
        {artworks &&
          artworks?.map((setOfartwork, index) => (
            <ul key={index} className="grid">
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[0]);
                }}
              >
                <figure>
                  <img
                    width="640"
                    height="1138"
                    src={setOfartwork[0]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[1]);
                }}
              >
                <figure>
                  <img
                    width="640"
                    height="427"
                    src={setOfartwork[1]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[2]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[2]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[3]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[3]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[4]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[4]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[5]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[5]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[6]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[6]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[7]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[7]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[8]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[8]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[9]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[9]?.image}
                    alt=""
                  />
                </figure>
              </div>
              <div
                onClick={() => {
                  getModalInfo(setOfartwork[10]);
                }}
              >
                <figure>
                  <img
                    width="320"
                    height="427"
                    src={setOfartwork[10]?.image}
                    alt=""
                  />
                </figure>
              </div>
            </ul>
          ))}
      </ArtworkGrid>
      <div>
        {showModal && (
          <ArtworkModal>
            <CloseIcon role="button" onClick={() => setShowModal(false)}>
              X
            </CloseIcon>
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
                  role="button"
                  onClick={saveToFavorites}
                ></FavoritesIcon>
              </Text>

              <Figure>
                <ArtworkImage alt={modalInfo.title} src={modalInfo.image} />
              </Figure>
            </Content>
          </ArtworkModal>
        )}
      </div>
      <div style={{ textAlign: "right" }}>
        <Link href="/artist-video">
          <p>See some videos!</p>
        </Link>
      </div>
    </>
  );
}
