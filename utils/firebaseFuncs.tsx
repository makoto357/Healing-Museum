import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface IUser {
  email?: string;
  favoriteArtworksId?: IFavoriteArtwork[];
  favoritePostsId?: IFavoritePost[];
  id?: string;
  last_changed?: Timestamp;
  name?: string;
  visitorJourney?: visitorJourney[];
  drawings?: string[];
}

export type visitorJourney = {
  recommendedArtist?: string;
  quizPoints?: string[];
  quizDate?: Timestamp;
};

export const getUserInfo = async (userId: string) => {
  const userRef = query(collection(db, "users"), where("id", "==", userId));
  const querySnapshot = await getDocs(userRef);
  const docs = querySnapshot.docs.map((doc) => doc.data());
  const recommendedArtist = docs[0]?.visitorJourney?.at(-1)?.recommendedArtist;
  const favoriteArtworks = docs[0]?.favoriteArtworksId;
  const userName = docs[0]?.name;
  const drawingForFeedbackForm = docs[0]?.drawings?.at(-1);
  const userProfile = docs[0];
  const favoritePosts = docs[0]?.favoritePostsId;
  return {
    recommendedArtist,
    favoriteArtworks,
    favoritePosts,
    userName,
    drawingForFeedbackForm,
    userProfile,
  };
};

export const getHighlightedArtworks = async (artist: string) => {
  const artworkRef = query(
    collection(db, "artworks"),
    where("artistUrl", "==", artist),
    orderBy("completitionYear", "desc")
  );
  const querySnapshot = await getDocs(artworkRef);
  const highlightedArtworks = querySnapshot.docs.map((doc) =>
    doc.data()
  ) as IArtworks;
  return { highlightedArtworks };
};

export const getArtworks = async (artist: string) => {
  const artistRef = query(
    collection(db, "artists"),
    where("artistUrl", "==", artist),
    orderBy("completitionYear", "desc")
  );
  const querySnapshot = await getDocs(artistRef);
  const artworks = querySnapshot.docs?.map((doc) => doc.data());
  return { artworks };
};

export interface IGeneralArtwork {
  artistId?: string;
  artistName?: string;
  artistUrl?: string;
  completitionYear?: number;
  height?: number;
  id?: string;
  image?: string;
  title?: string;
  url?: string;
  width?: number;
}
export interface IGeneralArtworks extends Array<IGeneralArtwork> {}

export interface IArtwork {
  id?: string;
  title?: string;
  url?: string;
  artistUrl?: string;
  artistName?: string;
  artistId?: string;
  completitionYear?: number;
  dictionaries?: string[];
  location?: string;
  period?: {};
  serie?: {};
  genres?: string[];
  styles?: string[];
  media?: string[];
  sizeX?: number;
  sizeY?: number;
  diameter?: string[];
  galleries?: string[];
  geometry: { lat: number; lng: number };
  tags?: string[];
  description?: string;
  width?: number;
  image?: string;
  height?: number;
}
export interface IArtworks extends Array<IArtwork> {}
export interface IFavoriteArtwork {
  id?: string;
  title?: string;
  year?: number;
  artistName?: string;
  image?: string;
}

export const addFavoriteArtworks = async (
  favoriteArtwork: IFavoriteArtwork,
  userId: string
) => {
  const artworkRef = doc(db, "users", userId);
  await updateDoc(artworkRef, {
    favoriteArtworksId: arrayUnion(favoriteArtwork),
  });
};

export const deleteFavoriteArtworks = async (
  favoriteArtwork: IFavoriteArtwork,
  userId: string
) => {
  const artworkRef = doc(db, "users", userId);
  await updateDoc(artworkRef, {
    favoriteArtworksId: arrayRemove(favoriteArtwork),
  });
};

export type CommentType = {
  commentatorId?: string;
  content?: string;
};

export interface IPost {
  artistForThisVisit?: string;
  comments?: CommentType[];
  date?: string;
  emoji?: string;
  id?: string;
  numberOfLikes?: string[];
  postMadeBy?: string;
  postTime?: Timestamp;
  textContent?: string;
  title?: string;
  uploadedImage?: string;
  userId?: string;
}

export interface IFavoritePost {
  date?: string;
  title?: string;
  artistForThisVisit?: string;
  postMadeBy?: string;
  id?: string;
}

export const getFavoritePosts = async (uid: string) => {
  const postsData: IFavoritePost[] = [];
  const q = query(collection(db, "users"), where("id", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs.map((doc) => doc.data());
  userDoc[0].favoritePostsId.map((favoritePost: IFavoritePost) =>
    postsData.push(favoritePost)
  );

  return { postsData };
};

export const addFavoritePosts = async (
  favoritePost: IFavoritePost,
  postId: string,
  userId: string
) => {
  const postRef = doc(db, "user-posts", postId);
  await updateDoc(postRef, {
    numberOfLikes: arrayUnion(userId),
  });

  const requestRef = doc(db, "users", userId);
  await updateDoc(requestRef, {
    favoritePostsId: arrayUnion(favoritePost),
  });
};

export const deleteFavoritePosts = async (
  favoritePost: IFavoritePost,
  postId: string,
  userId: string
) => {
  const postRef = doc(db, "user-posts", postId);
  await updateDoc(postRef, {
    numberOfLikes: arrayRemove(userId),
  });
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favoritePostsId: arrayRemove(favoritePost),
  });
};
