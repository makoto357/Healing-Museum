import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import saveToColleciton from "../asset/bookmark-save-favorite-ribbon-512.webp";
import commentIcon from "../asset/comments.svg";
import { useAuth } from "../context/AuthContext";

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

  console.log("");
  const { user } = useAuth();
  useEffect(() => {
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
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoritePostsID: arrayUnion(id),
    });
  };

  const handleShowComments = (singlePost) => {
    setPostComments(singlePost);
    setShowComment(true);
  };

  const handleComment = async (singlePost) => {
    console.log(singlePost.id);
    console.log(commentRef.current.value);
    const requestRef = doc(db, "user-posts", singlePost.id);
    await updateDoc(requestRef, {
      comments: arrayUnion({
        commentatorId: user.uid,
        commentTime: new Date(),
        content: commentRef.current.value,
      }),
    });
    commentRef.current.value = "";
  };
  return (
    <>
      <section style={{ width: "80vw", display: "flex", flexWrap: "wrap" }}>
        {posts.map((post) => (
          <section key={post.id}>
            <div>
              <img
                alt={post.title}
                src={post.uploadedImage}
                style={{ width: "100px" }}
              />
              <h1>Post title: {post.title}</h1>
              <p>Date: {post.date}</p>
              <p>Content: {post.textContent}</p>
              <p>Artist: {post.artistForThisVisit}</p>
              <p>Posted by: {post.postMadeBy}</p>
              <div
                role="button"
                style={{
                  backgroundImage: `url(${saveToColleciton.src})`,
                  width: "30px",
                  height: "30px",
                  backgroundSize: "cover",
                }}
                onClick={() => saveToFavorites(post.id)}
              ></div>
              <div
                role="button"
                style={{
                  backgroundImage: `url(${commentIcon.src})`,
                  width: "30px",
                  height: "30px",
                  backgroundSize: "cover",
                }}
                onClick={() => handleShowComments(post)}
              ></div>
            </div>
            {showComment && postComments?.id === post?.id && (
              <div>
                <textarea name="visitorComment" ref={commentRef} />
                <button
                  type="button"
                  style={{ border: "1px solid black" }}
                  onClick={() => handleComment(post)}
                >
                  submit
                </button>
              </div>
            )}
            {showComment &&
              postComments?.id === post.id &&
              postComments?.comments?.map((c) => (
                <div key={c.commentTime}>
                  <p>{c.commentatorName}</p>
                  <p>{c.content}</p>
                </div>
              ))}
            <form></form>
          </section>
        ))}
      </section>
    </>
  );
}
