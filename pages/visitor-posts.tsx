import styled from "@emotion/styled";
import Masonry from "react-masonry-css";
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import SignpostButton from "../components/Button";
import upArrow from "../asset/arrow-up.png";
import { db } from "../config/firebase";
import commentFilled from "../asset/comments-filled.png";
import commentUnfilled from "../asset/comments-unfilled.png";
import filledHeart from "../asset/black-heal.png";
import unfilledHeart from "../asset/white-heal.png";
import {
  getFavoritePosts,
  IFavoritePost,
  addFavoritePosts,
  deleteFavoritePosts,
  IPost,
} from "../utils/firebaseFuncs";
import { useAuth } from "../context/AuthContext";
const Wrapper = styled.div`
  padding-top: 40px;
  .my-masonry-grid {
    display: flex;
    max-width: 1200px;
    width: 80vw;
    margin: auto;
    @media screen and (max-width: 500px) {
      margin: 0 auto;
    }
  }
  .my-masonry-grid_column > div {
    background: grey;
  }
`;
const CommentContainer = styled.section`
  width: 270px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: all 0.5s ease;
  filter: grayscale(100%);
  margin: 0 auto 80px;
  &:before {
    z-index: -1;
    background: white;
    position: absolute;
    content: "";
    height: calc(100% - 40px);
    width: 100%;
    bottom: -40px;
    left: 0;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: skewY(-4deg);
    -ms-transform: skewY(-4deg);
    transform: skewY(-4deg);
  }
  &:hover {
    filter: grayscale(0%);
    box-shadow: 5px 5px 20px #888888;
    &:before {
      z-index: -1;
      background: white;
      position: absolute;
      content: "";
      height: 100%;
      width: 100%;
      bottom: -40px;
      left: 0;
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: skewY(-4deg);
      -ms-transform: skewY(-4deg);
      transform: skewY(-4deg);
    }
  }
`;

const Post = styled.section`
  margin: 20px 20px 0px;
`;
const MainImageWrapper = styled.div`
  width: 270px;
  min-height: 70px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const ButtonGroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;
const CollectionButton = styled.div<{ $heart: string }>`
  background-image: url(${(props) => props.$heart});
  width: 20px;
  height: 20px;
  background-size: cover;
  margin-left: 5px;
`;

const CommentButton = styled.div<{ $showComment: string }>`
  background-image: url(${(props) => props.$showComment});
  width: 20px;
  height: 20px;
  background-size: cover;
`;

const TextArea = styled.textarea`
  border: 1px solid #2c2b2c;
  padding: 5px;
  width: 100%;
  resize: none;
  &:focus {
    outline: none;
  }
`;

const Split = styled.div`
  border-bottom: 1px solid #2c2b2c;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  padding: 1px 3px;
  border: 1px solid black;
  margin-left: 175px;
  background: #2c2b2c;
  color: white;
`;

const SortButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 80vw;
  margin: auto;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
const SortButton = styled.button<{ $textColor: string; $bgColor: string }>`
  height: fit-content;
  font-size: 1.25rem;
  padding: 10px 20px;
  width: fit-content;
  border: 1px solid black;
  margin: 20px 0 26px 0;
  cursor: pointer;
  color: ${(props) => props.$textColor};
  background-color: ${(props) => props.$bgColor};
  &:hover {
    color: white;
    background-color: #2c2b2c;
  }
  @media screen and (max-width: 800px) {
    margin: 20px 0;
  }
`;

const SortButtonSmScreen = styled.div`
  @media screen and (max-width: 800px) {
    display: flex;
    margin: auto;
  }
`;
const AllPosts = styled.div`
  height: fit-content;
  font-size: 1.5rem;
  padding: 0px 20px;
  width: fit-content;
  margin: 50px 0 26px 0;
  color: black;
  @media screen and (max-width: 800px) {
    margin: 20px auto 0 auto;
  }
`;
const ToTopIconWrapper = styled.div`
  position: fixed;
  bottom: 60px;
  right: 3vw;
  text-align: center;
  z-index: 2;
  @media screen and (max-width: 800px) {
    bottom: 24px;
  }
`;

const ToTopIcon = styled.div`
  cursor: pointer;
  background-image: url(${upArrow.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  margin: auto;
`;

const ToTopText = styled.div`
  cursor: pointer;
`;
const MainImage = styled.img`
  width: 100%;
`;
const ButtonGroup = styled.div`
  display: flex;
`;
const LikeNumber = styled.p`
  margin-bottom: 2px;
`;

const breakpointColumnsObj = {
  default: 4,
  1400: 3,
  1050: 2,
  750: 1,
};

export default function VisitorPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showComment, setShowComment] = useState<boolean>(false);
  const [sortPost, setSortPost] = useState<boolean>(true);
  const [postComments, setPostComments] = useState<IPost>({});
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [favorite, setFavorite] = useState<IFavoritePost[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      getFavoritePosts(user.uid).then(({ postsData }) => {
        setFavorite([...postsData]);
      });
    }

    const postsRef = collection(db, "user-posts");
    const unSubscribe = onSnapshot(postsRef, (snapshot) => {
      let posts: IPost[] = [];
      snapshot.docs.forEach((doc) => {
        posts.push({
          ...doc.data(),
        });
      });
      setPosts(posts.sort(sortByArtist));
    });
    return () => {
      unSubscribe();
    };
  }, [user]);

  const saveToFavorites = async (post: IFavoritePost) => {
    const favoritePost = {
      date: post.date,
      title: post.title,
      artistForThisVisit: post.artistForThisVisit,
      postMadeBy: post.postMadeBy,
      id: post.id,
    };
    setFavorite((prev) => [...prev, favoritePost]);
    addFavoritePosts(
      favoritePost,
      favoritePost.id !== undefined ? favoritePost.id : "",
      user?.uid
    );
  };

  const deleteFromFavorites = async (post: IFavoritePost) => {
    const index = favorite?.indexOf(post);
    favorite?.splice(index, 1);
    setFavorite([...favorite]);
    const favoritePost = {
      date: post.date,
      title: post.title,
      artistForThisVisit: post.artistForThisVisit,
      postMadeBy: post.postMadeBy,
      id: post.id,
    };
    deleteFavoritePosts(
      favoritePost,
      favoritePost.id !== undefined ? favoritePost.id : "",
      user.uid
    );
  };

  const handleShowComments = (singlePost: IPost) => {
    setPostComments(singlePost);
    setShowComment(true);
  };

  const handleComment = async (singlePost: IPost) => {
    const requestRef = doc(
      db,
      "user-posts",
      singlePost.id !== undefined ? singlePost.id : ""
    );
    if (commentRef.current !== null) {
      await updateDoc(requestRef, {
        comments: arrayUnion({
          commentatorId: user.uid,
          commentTime: new Date(),
          content: commentRef.current.value,
        }),
      });

      const newPostComments = { ...singlePost };

      const newComments =
        newPostComments.comments !== undefined &&
        newPostComments.comments.length !== 0
          ? [...newPostComments.comments]
          : [];
      newComments?.push({
        commentatorId: user.uid,
        content: commentRef.current.value,
      });
      newPostComments.comments = newComments;
      setPostComments(newPostComments);

      commentRef.current.value = "";
    }
  };

  function sortByArtist(a: IPost, b: IPost) {
    if (
      (a.artistForThisVisit !== undefined ? a.artistForThisVisit : "") <
      (b.artistForThisVisit !== undefined ? b.artistForThisVisit : "")
    ) {
      return -1;
    }
    if (
      (a.artistForThisVisit !== undefined ? a.artistForThisVisit : "") >
      (b.artistForThisVisit !== undefined ? b.artistForThisVisit : "")
    ) {
      return 1;
    }
    return 0;
  }

  function sortByDate(a: IPost, b: IPost) {
    if (
      (a.date !== undefined ? a.date : "") <
      (b.date !== undefined ? b.date : "")
    ) {
      return -1;
    }
    if (
      (a.date !== undefined ? a.date : "") >
      (b.date !== undefined ? b.date : "")
    ) {
      return 1;
    }
    return 0;
  }
  const sortPostsByArtist = () => {
    setSortPost(true);
    setPosts(() => [...posts.sort(sortByArtist)]);
  };

  const sortPostByDate = () => {
    setSortPost(false);
    setPosts(() => [...posts.sort(sortByDate)]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const collectPosts = (post: IPost) => {
    if (!favorite?.map((fav) => fav.id).includes(post.id))
      saveToFavorites(post);
    else if (favorite?.map((fav) => fav.id).includes(post.id)) {
      deleteFromFavorites(post);
    }
  };

  const submitComment = (post: IPost) => {
    if (commentRef.current !== null && commentRef.current.value.trim() !== "") {
      handleComment(post);
    }
  };

  return (
    <Wrapper>
      <SignpostButton href="/user-profile">
        A thank you note at the end
      </SignpostButton>
      <SortButtonGroup>
        <AllPosts>Everything ( {posts.length} )</AllPosts>

        <SortButtonSmScreen>
          <SortButton
            $textColor={sortPost ? "white" : "black"}
            $bgColor={sortPost ? "#2c2b2c" : "transparent"}
            onClick={sortPostsByArtist}
          >
            By Artists
          </SortButton>
          <SortButton
            $textColor={!sortPost ? "white" : "black"}
            $bgColor={!sortPost ? "#2c2b2c" : "transparent"}
            onClick={sortPostByDate}
          >
            By Date
          </SortButton>
        </SortButtonSmScreen>
      </SortButtonGroup>
      <ToTopIconWrapper onClick={scrollToTop}>
        <ToTopIcon />

        <ToTopText>
          <strong>
            To
            <br /> Top
          </strong>
        </ToTopText>
      </ToTopIconWrapper>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => {
          const {
            id,
            title,
            uploadedImage,
            date,
            textContent,
            postMadeBy,
            artistForThisVisit,
            numberOfLikes,
          } = post;
          return (
            <CommentContainer
              key={id}
              onMouseEnter={() => handleShowComments(post)}
            >
              <MainImageWrapper>
                <MainImage alt={title} src={uploadedImage} />
              </MainImageWrapper>
              <Post>
                <Text>
                  <div>
                    <h1>
                      <strong>{title}</strong>
                    </h1>
                    <p>{date}</p>
                  </div>
                  <p>{textContent}</p>
                  <div>
                    <p>
                      <strong>Posted by: </strong>
                      {postMadeBy}
                    </p>
                    <p>
                      <strong>Artist: </strong>
                      {artistForThisVisit}
                    </p>
                  </div>
                </Text>
                <ButtonGroupWrapper>
                  <CommentButton
                    $showComment={
                      showComment && postComments?.id === id
                        ? commentFilled.src
                        : commentUnfilled.src
                    }
                    role="button"
                    onClick={() => handleShowComments(post)}
                  ></CommentButton>

                  <ButtonGroup>
                    <LikeNumber>
                      {numberOfLikes !== undefined &&
                        numberOfLikes?.length > 0 &&
                        numberOfLikes?.length}
                    </LikeNumber>

                    <CollectionButton
                      $heart={
                        favorite?.map((f) => f.id).includes(post.id)
                          ? `${filledHeart.src}`
                          : `${unfilledHeart.src}`
                      }
                      role="button"
                      onClick={() => collectPosts(post)}
                    />
                  </ButtonGroup>
                </ButtonGroupWrapper>
              </Post>
              {showComment && postComments?.id === id && (
                <Post>
                  <Split></Split>
                  <TextArea
                    placeholder="After reading this post, I feel..."
                    name="visitorComment"
                    ref={commentRef}
                  />

                  <SubmitButton onClick={() => submitComment(post)}>
                    Submit
                  </SubmitButton>
                </Post>
              )}
              {showComment && postComments?.id === id && (
                <Post>
                  <strong>How Others Feel</strong>
                </Post>
              )}
              {showComment &&
                postComments?.id === id &&
                postComments?.comments?.map((postComment) => (
                  <Post key={postComment.content}>
                    <p>{postComment.content}</p>
                  </Post>
                ))}
            </CommentContainer>
          );
        })}
      </Masonry>
    </Wrapper>
  );
}
