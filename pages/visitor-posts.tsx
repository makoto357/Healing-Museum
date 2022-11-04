import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import like from "../asset/download-smiling-face-with-tightly-closed-eyes-icon-smiling-emoji-11562881831tykcocazrv.png";

export default function VisitorPosts() {
  const [posts, setPosts] = useState([]);

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

  return (
    <section style={{ width: "80vw", display: "flex", flexWrap: "wrap" }}>
      {posts.map((post) => (
        <>
          <div key={post.id}>
            <img src={post.uploadedImage} style={{ width: "100px" }} />
            <h1>Post title: {post.title}</h1>
            <p>Date: {post.date}</p>
            <p>Content: {post.textContent}</p>
          </div>
        </>
      ))}
    </section>
  );
}
