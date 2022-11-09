import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
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

interface IComment {
  commentTime: Timestamp | undefined;
  commentatorId: string | undefined;
  content: string | undefined;
}

interface IComments extends Array<IComment> {}

export default function VisitorPosts() {
  const [posts, setPosts] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState<IComments>([
    {
      commentTime: undefined,
      commentatorId: undefined,
      content: undefined,
    },
  ]);
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
      // console.log(posts);
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

  const handleComments = (singlePost) => {
    setComments(singlePost);
    setShowComment(true);
  };
  console.log(showComment);
  console.log(comments);
  return (
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
              onClick={() => handleComments(post.comments)}
            ></div>
          </div>
          {showComment &&
            comments?.map((comment) => (
              <div key={comment?.commentatorId}>{comment?.content}</div>
            ))}
          <form></form>
        </section>
      ))}
    </section>
  );
}
