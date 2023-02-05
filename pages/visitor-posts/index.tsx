import Masonry from "react-masonry-css";
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import SignpostButton from "../../components/Button";
import { db } from "../../config/firebase";

import commentFilled from "../../asset/comments-filled.png";
import commentUnfilled from "../../asset/comments-unfilled.png";
import filledHeart from "../../asset/black-heal.png";
import unfilledHeart from "../../asset/white-heal.png";
import {
  getFavoritePosts,
  IFavoritePost,
  addFavoritePosts,
  deleteFavoritePosts,
  IPost,
} from "../../utils/firebaseFuncs";
import { useAuth } from "../../context/AuthContext";
import {
  Wrapper,
  CommentContainer,
  Post,
  MainImageWrapper,
  Text,
  ButtonGroupWrapper,
  CollectionButton,
  CommentButton,
  TextArea,
  Split,
  SubmitButton,
  SortButtonGroup,
  SortButton,
  SortButtonSmScreen,
  AllPosts,
  ToTopIconWrapper,
  ToTopIcon,
  ToTopText,
  MainImage,
  ButtonGroup,
  LikeNumber,
  ReadmoreButton,
} from "./visitor-posts.styles";

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
      const getFavoritePost = async () => {
        const { postsData } = await getFavoritePosts(user.uid);
        setFavorite([...postsData]);
      };
      getFavoritePost();
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
      return 1;
    }
    if (
      (a.date !== undefined ? a.date : "") >
      (b.date !== undefined ? b.date : "")
    ) {
      return -1;
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
              onPointerEnter={() => handleShowComments(post)}
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
                    <time>{date}</time>
                  </div>
                  <p>
                    {textContent && textContent?.length > 60 ? (
                      <ReadMore
                        content={textContent}
                        id={id}
                        commentId={postComments.id}
                      />
                    ) : (
                      textContent
                    )}
                  </p>
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

function ReadMore({
  content,
  id,
  commentId,
}: {
  content: string;
  id?: string;
  commentId?: string;
}) {
  const text = content;

  const [isReadMore, setIsReadMore] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const handleReadMore = (id?: string) => {
    if (id === commentId) {
      setIsReadMore(!isReadMore);
    }
  };
  return (
    <>
      {isReadMore ? text.slice(0, 60) : text}
      <ReadmoreButton onClick={() => handleReadMore(id)}>
        {isReadMore ? "...read more" : " (show less)"}
      </ReadmoreButton>
    </>
  );
}
