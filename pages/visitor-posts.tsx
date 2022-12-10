import styled from "@emotion/styled";
import Masonry from "react-masonry-css";
import React, { useState, useEffect, useRef } from "react";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  query,
  where,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import SignpostButton from "../components/Button";
import upArrow from "../asset/arrow-up.png";

import { db } from "../config/firebase";
import commentFilled from "../asset/comments-filled.png";
import commentUnfilled from "../asset/comments-unfilled.png";
import filledHeart from "../asset/black-heal.png";
import unfilledHeart from "../asset/white-heal.png";

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

let comments: Array<{
  commentTime: Timestamp;
  commentatorId: string;
  commentatorName: string;
  content: string;
}> = [];

interface IComment {
  id: string | undefined;
  comments;
}

export default function VisitorPosts() {
  const [posts, setPosts] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [sortPost, setSortPost] = useState(true);
  const [postComments, setPostComments] = useState<IComment>({
    id: undefined,
    comments,
  });
  const commentRef = useRef(null);
  const [favorite, setFavorite] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      setFavorite(docs[0].favoritePostsId);
    };
    getArtist();
    console.log("get posts again?");
    const colRef = collection(db, "user-posts");
    const unSubscribe = onSnapshot(colRef, (snapshot) => {
      let posts = [];
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
  }, [user.uid]);

  const saveToFavorites = async (post) => {
    setFavorite((prev) => [
      ...prev,
      {
        postTime: post.postTime,
        title: post.title,
        artist: post.artistForThisVisit,
        postBy: post.postMadeBy,
        id: post.id,
      },
    ]);

    const postRef = doc(db, "user-posts", post?.id);
    await updateDoc(postRef, {
      numberOfLikes: arrayUnion(user?.uid),
    });

    const requestRef = doc(db, "users", user?.uid);
    await updateDoc(requestRef, {
      favoritePostsId: arrayUnion({
        postTime: post.date,
        title: post.title,
        artist: post.artistForThisVisit,
        postBy: post.postMadeBy,
        id: post.id,
      }),
    });
  };

  const deleteFromFavorites = async (post) => {
    const index = favorite?.indexOf(post);
    favorite?.splice(index, 1);
    setFavorite([...favorite]);
    const requestRef = doc(db, "users", user?.uid);
    await updateDoc(requestRef, {
      favoritePostsId: arrayRemove({
        postTime: post.date,
        title: post.title,
        artist: post.artistForThisVisit,
        postBy: post.postMadeBy,
        id: post.id,
      }),
    });

    const postRef = doc(db, "user-posts", post?.id);
    await updateDoc(postRef, {
      numberOfLikes: arrayRemove(user?.uid),
    });
  };

  const handleShowComments = (singlePost) => {
    setPostComments(singlePost);
    setShowComment(true);
  };

  const handleComment = async (singlePost) => {
    const requestRef = doc(db, "user-posts", singlePost.id);
    await updateDoc(requestRef, {
      comments: arrayUnion({
        commentatorId: user.uid,
        commentTime: new Date(),
        content: commentRef.current.value,
      }),
    });

    const newPostComments = { ...singlePost };

    const newComments =
      newPostComments.comments.length !== 0
        ? [...newPostComments?.comments]
        : [];
    newComments?.push({
      commentatorId: user.uid,
      commentTime: new Date(),
      content: commentRef.current.value,
    });
    newPostComments.comments = newComments;
    setPostComments(newPostComments);

    commentRef.current.value = "";
  };

  function sortByArtist(a, b) {
    if (a.artistForThisVisit < b.artistForThisVisit) {
      return -1;
    }
    if (a.artistForThisVisit > b.artistForThisVisit) {
      return 1;
    }
    return 0;
  }

  function sortByDate(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

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
            onClick={() => {
              setSortPost(true);
              setPosts(() => [...posts.sort(sortByArtist)]);
            }}
          >
            By Artists
          </SortButton>
          <SortButton
            $textColor={!sortPost ? "white" : "black"}
            $bgColor={!sortPost ? "#2c2b2c" : "transparent"}
            onClick={() => {
              setSortPost(false);
              setPosts(() => [...posts.sort(sortByDate)]);
            }}
          >
            By Date
          </SortButton>
        </SortButtonSmScreen>
      </SortButtonGroup>
      <ToTopIconWrapper
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
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
        {" "}
        {posts.map((post) => (
          <CommentContainer
            key={post.id}
            onMouseEnter={() => handleShowComments(post)}
          >
            <MainImageWrapper>
              <MainImage alt={post.title} src={post.uploadedImage} />
            </MainImageWrapper>
            <Post>
              <Text>
                <div>
                  <h1>
                    <strong>{post.title}</strong>
                  </h1>
                  <p>{post.date}</p>
                </div>
                <p>{post.textContent}</p>
                <div>
                  <p>
                    <strong>Posted by: </strong>
                    {post.postMadeBy}
                  </p>
                  <p>
                    <strong>Artist: </strong>
                    {post.artistForThisVisit}
                  </p>
                </div>
              </Text>
              <ButtonGroupWrapper>
                <CommentButton
                  $showComment={
                    showComment && postComments?.id === post?.id
                      ? commentFilled.src
                      : commentUnfilled.src
                  }
                  role="button"
                  onClick={() => handleShowComments(post)}
                ></CommentButton>

                <ButtonGroup>
                  <LikeNumber>
                    {post.numberOfLikes?.length > 0 &&
                      post.numberOfLikes?.length}
                  </LikeNumber>

                  <CollectionButton
                    $heart={
                      favorite?.map((f) => f.id).includes(post.id)
                        ? `${filledHeart.src}`
                        : `${unfilledHeart.src}`
                    }
                    role="button"
                    onClick={() => {
                      if (!favorite?.map((f) => f.id).includes(post.id))
                        saveToFavorites(post);
                      else if (favorite?.map((f) => f.id).includes(post.id)) {
                        deleteFromFavorites(post);
                      }
                    }}
                  />
                </ButtonGroup>
              </ButtonGroupWrapper>
            </Post>
            {showComment && postComments?.id === post?.id && (
              <Post>
                <Split></Split>
                <TextArea
                  placeholder="After reading this post, I feel..."
                  name="visitorComment"
                  ref={commentRef}
                />

                <SubmitButton
                  onClick={() => {
                    if (commentRef.current.value.trim() !== "") {
                      handleComment(post);
                    }
                  }}
                >
                  Submit
                </SubmitButton>
              </Post>
            )}
            {showComment && postComments?.id === post.id && (
              <Post>
                <strong>How Others Feel</strong>
              </Post>
            )}
            {showComment &&
              postComments?.id === post.id &&
              postComments?.comments?.map((c) => (
                <>
                  <Post key={c.commentTime}>
                    <h1></h1>
                    <p>{c.commentatorName}</p>
                    <p>{c.content}</p>
                  </Post>
                </>
              ))}
          </CommentContainer>
        ))}
      </Masonry>
    </Wrapper>
  );
}
