// [type="radio"] {
//   position: absolute;
//   opacity: 0;
//   width: 0;
//   height: 0;
// }

// [type="radio"] + img {
//   cursor: pointer;
// }

// [type="radio"]:checked + img {
//   outline: 2px solid #f00;
// }
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";

import like from "../asset/download-smiling-face-with-tightly-closed-eyes-icon-smiling-emoji-11562881831tykcocazrv.png";
export default function Form() {
  const [themeColor] = useContext(ThemeColorContext);
  const timeStamp = new Date();

  const emojis = ["like", "love", "sad", "surprise"];

  const [formData, setFormData] = useState({
    emoji: "",
    title: "",
    content: "",
    date: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    sendForm();
    uploadImage();
    console.log("handleForm");
  };

  const sendForm = () => {
    async function sendData() {
      try {
        const docRef = await addDoc(collection(db, "user-posts"), {
          emoji: formData.emoji,
          date: formData.date,
          title: formData.title,
          content: formData.content,
          created_time: timeStamp,
        });
        console.log("Document written with ID: ", docRef.id);
        const IDRef = doc(db, "user-posts", docRef.id);
        await updateDoc(IDRef, {
          id: docRef.id,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    sendData();
  };

  const uploadImage = async () => {
    if (uploadedImage === null) return;

    const imageRef = ref(storage, `images/${uploadedImage.name + timeStamp}`);
    //      const imageRef = ref(storage, `image/`); storage = our bucket, `folderName/photoName` = add `` to give images random names
    const res = await uploadBytes(imageRef, uploadedImage); //uploadBytes(whereToUpload, imageToBeUploaded)
    console.log(res);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="main-form">
        <style jsx>{`
          .main-form {
            width: 500px;
            margin: auto;
          }
        `}</style>

        <fieldset>
          <legend>
            Having been on this short trip to the inner world of {"Van Gogh"},
            you feel...
          </legend>
          {emojis.map((emoji) => (
            <label key={emoji} htmlFor="feeling">
              <input
                id="feeling"
                type="radio"
                name="feeling"
                value="emoji"
                checked={formData.emoji === emoji}
                onChange={(e) => {
                  if (e.target.checked)
                    setFormData({ ...formData, emoji: emoji });
                }}
              />
              <Image src={like} alt={emoji} width={30} height={30} />
            </label>
          ))}
        </fieldset>
        <fieldset>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            placeholder="enter date..."
            required
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
            }}
          ></input>
        </fieldset>
        <fieldset>
          <label htmlFor="title">Title of your story</label>
          <input
            id="title"
            name="title"
            placeholder="enter title..."
            required
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          ></input>
        </fieldset>
        <fieldset>
          <label htmlFor="resonance">
            Does the life story of this artist echos with your personal
            experiences?
          </label>
          <textarea
            id="resonance"
            name="resonance"
            placeholder="leave your words..."
            required
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
            }}
          ></textarea>
        </fieldset>
        <fieldset>
          <div>
            {/* <Image alt="" /> */}
            <div></div>
            <p></p>
            <div></div>

            <input
              type="file"
              name="image"
              onChange={(e) => {
                setUploadedImage(e.target.files[0]);
              }}
            ></input>
          </div>
          <ul className="info-list">
            <li></li>
            <li>Please use only your own original photos</li>
          </ul>
        </fieldset>

        <button type="submit">Submit</button>
      </form>
      <div style={{ textAlign: "right" }}>
        <Link href="/user-profile">
          <p>here is a souvenir for you at the end of your journey</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
