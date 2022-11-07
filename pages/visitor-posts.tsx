import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import saveToColleciton from "../asset/bookmark-save-favorite-ribbon-512.webp";
import { useAuth } from "../context/AuthContext";

export default function VisitorPosts() {
  const [posts, setPosts] = useState([]);
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
      console.log(posts);
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
  return (
    <section style={{ width: "80vw", display: "flex", flexWrap: "wrap" }}>
      {posts.map((post) => (
        <section key={post.id}>
          <div>
            <img src={post.uploadedImage} style={{ width: "100px" }} />
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
          </div>

          <form></form>
        </section>
      ))}
    </section>
  );
}
