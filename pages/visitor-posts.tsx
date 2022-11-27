import styled from "@emotion/styled";
import Link from "next/link";
import Masonry from "react-masonry-css";
import React from "react";
import { useState, useEffect, useRef } from "react";
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
import { db } from "../config/firebase";
import commentFilled from "../asset/comments-filled.png";
import commentUnfilled from "../asset/comments-unfilled.png";
import filledHeart from "../asset/black-heal.png";
import unfilledHeart from "../asset/white-heal.png";

import { useAuth } from "../context/AuthContext";
import home from "../asset/back-to-homepage.png";

const LinkToHomepage = styled(Link)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const HomeIcon = styled.div`
  background-image: url(${home.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  margin-left: auto;
  &:hover {
    width: 34px;
    height: 34px;
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
  margin-bottom: 80px;
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
const MainImage = styled.div`
  width: 270px;
  min-height: 70px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;
const CollectionButton = styled.div<{ $heart: string }>`
  background-image: url(${(props) => props.$heart});
  width: 20px;
  height: 20px;
  background-size: cover;
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

const breakpointColumnsObj = {
  default: 4,
  1400: 3,
  1200: 2,
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
      setFavorite(docs[0].favoriteArtworksID);
    };
    getArtist();

    const colRef = collection(db, "user-posts");
    const unSubscribe = onSnapshot(colRef, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({
          ...doc.data(),
        });
      });
      setPosts(posts);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const saveToFavorites = async (id) => {
    setFavorite((prev) => [...prev, id]);
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoritePostsID: arrayUnion(id),
    });
  };

  const deleteFromFavorites = async (id) => {
    const index = favorite.indexOf(id);
    favorite.splice(index, 1);
    console.log(favorite);
    setFavorite([...favorite]);
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoritePostsID: arrayRemove(id),
    });
  };

  const handleShowComments = (singlePost) => {
    setPostComments(singlePost);
    setShowComment(true);
  };

  const handleComment = async (singlePost) => {
    console.log(singlePost.comments);
    console.log(commentRef.current.value);
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
    console.log(newComments);
    newComments?.push({
      commentatorId: user.uid,
      commentTime: new Date(),
      content: commentRef.current.value,
    });
    console.log(newComments);
    newPostComments.comments = newComments;
    setPostComments(newPostComments);

    commentRef.current.value = "";
  };
  return (
    <div style={{ paddingTop: "80px" }}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        // className={styles.my - masonry - grid}
        // className={styles.hello}
        columnClassName="my-masonry-grid_column"
      >
        {" "}
        {posts.map((post) => (
          <CommentContainer key={post.id}>
            <MainImage>
              <img alt={post.title} src={post.uploadedImage} />
            </MainImage>
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
              <ButtonGroup>
                <CommentButton
                  $showComment={
                    showComment && postComments?.id === post?.id
                      ? commentFilled.src
                      : commentUnfilled.src
                  }
                  role="button"
                  onClick={() => handleShowComments(post)}
                ></CommentButton>
                <CollectionButton
                  $heart={
                    favorite?.includes(post.id)
                      ? `${filledHeart.src}`
                      : `${unfilledHeart.src}`
                  }
                  role="button"
                  onClick={() => {
                    if (!favorite.includes(post.id)) saveToFavorites(post.id);
                    else if (favorite.includes(post.id)) {
                      deleteFromFavorites(post.id);
                    }
                  }}
                ></CollectionButton>
              </ButtonGroup>
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
                    handleComment(post);
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
      <LinkToHomepage href="/theme-color">
        <HomeIcon />
        <div>
          <strong>Start again</strong>
        </div>
      </LinkToHomepage>
    </div>
  );
}
