import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { DragDropContext } from "react-beautiful-dnd";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import visitorJourney from "../public/artist-info/visitorJourney.json";
import CollectionColumn from "../components/DragNDrop";
import "react-toastify/dist/ReactToastify.css";
const Wrapper = styled.div`
  padding-top: 15px;
`;
const Opening = styled.h1`
  font-size: 1.25rem;
  text-align: left;
`;
const FavoriteButton = styled.div`
  display: flex;
`;

const TextWrapper = styled.div`
  width: 500px;
  padding: 0 50px;
  margin: 20px auto 20px 0;
  @media screen and (max-width: 950px) {
    width: 80vw;
    margin: 20px auto;
    padding: 0;
  }
`;

const ArtworkWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 40vh;
  margin: 0 auto;
  justify-content: flex-start;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  @media screen and (max-width: 950px) {
    flex-direction: column;
  }
`;

const ArtworkImage = styled.div<{ $bgImage: string }>`
  width: 50vw;
  background-size: cover;
  background-position: center;
  border-right: 1px solid black;
  background-image: url(${(props) => props.$bgImage});

  @media screen and (max-width: 950px) {
    height: 50vh;
    width: 100vw;
  }
  @media screen and (max-width: 600px) {
    height: 40vh;
  }
  @media screen and (max-width: 600px) {
    height: 30vh;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 80vw;
  justify-content: space-between;
  margin: 20px 0 20px 5vw;
  column-gap: 20px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 90vw;
  }
`;
const HalfButton = styled.button<{ $textColor: string; $bgColor: string }>`
  height: fit-content;
  font-size: 1.25rem;
  padding: 10px 20px;
  width: fit-content;
  border: 1px solid black;
  margin: 4px 0;
  cursor: pointer;
  color: ${(props) => props.$textColor};
  background-color: ${(props) => props.$bgColor};
  &:hover {
    color: white;
    background-color: #2c2b2c;
  }
`;

const SaveUpdates = styled.div`
  height: fit-content;
  font-size: 1rem;
  width: fit-content;
  margin: auto 20px 4px 20px;
  border-bottom: 0.5px solid black;
  cursor: pointer;
`;

interface IUser {
  email: string | undefined;
  favoriteArtworksId: string[] | undefined;
  favoritePostsId: string[] | undefined;
  id: string | undefined;
  last_changed: Timestamp | undefined;
  name: string | undefined;
  visitorJourney: EnumJourneyItems | undefined;
}

interface EnumJourneyItem {
  recommendedArtist: string;
  quizPoints: number;
  quizDate: Timestamp;
}

interface IArtwork {
  artistName: string | undefined;
  year: number | undefined;
  title: string | undefined;
  id: string | undefined;
  image: string | undefined;
}
interface IArtworks extends Array<IArtwork> {}
interface EnumJourneyItems extends Array<EnumJourneyItem> {}

export default function UserProfile() {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [showText, setShowText] = useState(null);
  const router = useRouter();
  const [showFavoriteArtworks, setShowFavoriteArtworks] = useState(true);
  const { user } = useAuth();

  const [profile, setProfile] = useState<IUser>({
    email: undefined,
    favoriteArtworksId: undefined,
    favoritePostsId: undefined,
    id: undefined,
    last_changed: undefined,
    name: undefined,
    visitorJourney: undefined,
  });

  const [artwork, setArtwork] = useState<IArtworks>([]);
  const [quote, setQuote] = useState(
    visitorJourney[0].quotes[
      Math.floor(Math.random() * visitorJourney[0].quotes?.length)
    ]
  );
  useEffect(() => {
    const getProfile = async () => {
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const IUser = doc.data() as IUser;
        setProfile(IUser);
        const artworkID = IUser.favoriteArtworksId;
        setFavoritePosts(IUser?.favoritePostsId);
        if (artworkID) {
          getFavoriteArtwork(artworkID);
        }
      });
    };
    const getFavoriteArtwork = async (id) => {
      setArtwork(id);
      const artistQuotes = visitorJourney?.filter(
        (j) => j?.artistName == id[id?.length - 1]?.artistName
      )[0]?.quotes;
      if (artistQuotes) {
        setQuote(
          artistQuotes[Math.floor(Math.random() * artistQuotes?.length)]
        );
      }
    };

    getProfile();
  }, [user?.uid]);

  const reorderArtworks = (destination, source) => {
    const newArtworkOrder = [...artwork];
    const [remove] = newArtworkOrder.splice(source.index, 1);
    newArtworkOrder.splice(destination.index, 0, remove);
    setArtwork(newArtworkOrder);
  };

  const reorderPosts = (destination, source) => {
    const newPostOrder = [...favoritePosts];
    const [remove] = newPostOrder.splice(source.index, 1);
    newPostOrder.splice(destination.index, 0, remove);
    setFavoritePosts(newPostOrder);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (showFavoriteArtworks) {
      reorderArtworks(destination, source);
      return;
    }
    reorderPosts(destination, source);
  };

  const updateOrder = async () => {
    if (favoritePosts.length === 0 && artwork.length === 0) return;
    notify("Successfully saved the current progress!");
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksId: artwork,
      favoritePostsId: favoritePosts,
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
    });
  return (
    <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
      {/* add event listener */}
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
      <Wrapper>
        <ArtworkWrapper>
          <ArtworkImage $bgImage={artwork[artwork.length - 1]?.image} />
          <TextWrapper>
            <Opening>
              <strong>
                Thank you, <span>{profile?.name},</span> for your visit to the
                Healing Museum.
              </strong>
            </Opening>
            <br />
            {artwork.length == 0 && (
              <p>
                You haven&apos;t collected any artworks yet, start exploring!
              </p>
            )}
            {artwork.length > 0 && (
              <>
                <p>
                  <strong>
                    <i>{artwork[artwork.length - 1]?.title}</i>
                  </strong>{" "}
                  by {artwork[artwork.length - 1]?.artistName} is the last
                  painting you saved as favorite during your journey. <br />
                  We hope this painting gives you strength, for knowing there is
                  someone who shares your feelings.
                </p>
                <br />
                <p>
                  <strong>
                    {`"${quote}"`}
                    <br />-{artwork[artwork.length - 1]?.artistName}
                  </strong>
                </p>
              </>
            )}
          </TextWrapper>
        </ArtworkWrapper>
        <ButtonGroup>
          <FavoriteButton>
            <HalfButton
              onClick={() => setShowFavoriteArtworks(true)}
              $textColor={showFavoriteArtworks ? "white" : "black"}
              $bgColor={showFavoriteArtworks ? "#2c2b2c" : "transparent"}
            >
              Favorite Artworks
            </HalfButton>
            <HalfButton
              onClick={() => setShowFavoriteArtworks(false)}
              $textColor={showFavoriteArtworks ? "black" : "white"}
              $bgColor={showFavoriteArtworks ? "transparent" : "#2c2b2c"}
            >
              Favorite Posts
            </HalfButton>
            <SaveUpdates onClick={updateOrder}>Save this order</SaveUpdates>
          </FavoriteButton>

          <HalfButton
            $textColor="white"
            $bgColor="#2c2b2c"
            onClick={() => router.push("/theme-color")}
          >
            Start a new journey
          </HalfButton>
        </ButtonGroup>
        <CollectionColumn
          showFavoriteArtworks={showFavoriteArtworks}
          artwork={artwork}
          setShowText={setShowText}
          showText={showText}
          favoritePosts={favoritePosts}
        />
      </Wrapper>
    </DragDropContext>
  );
}
