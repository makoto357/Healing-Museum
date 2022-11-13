import styled from "@emotion/styled";
import Link from "next/link";
import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ThemeColorContext } from "../context/ColorContext";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageupload from "../asset/imageupload.svg";
import like from "../asset/download-smiling-face-with-tightly-closed-eyes-icon-smiling-emoji-11562881831tykcocazrv.png";
import hope from "../asset/sun.png";
import love from "../asset/love.png";

const MainForm = styled.form`
  max-width: 900px;
  width: 60vw;
  margin: 0 auto;
  background: white;
  padding: 25px 85px;
`;

const FormLegend = styled.legend`
  font-size: 26px;
`;

const EmojiInput = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
  margin: 0.5rem;
`;

const Emoticon = styled.div`
  width: 100%;
  height: 100%;
`;

const RadioInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  cursor: pointer;
`;

const FormFieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  margin-bottom: 35px;
`;

const FormLable = styled.label`
  font-size: 22px;
  margin-bottom: 10px;
`;

const FormInput = styled.input`
  border: 0.5px solid #2c2b2c;
  padding: 5px;
`;

const FileUpload = styled.div`
  display: block;
  width: 100%;
  font-weight: 500;
  text-align: center;
  padding: 60px 0;
  cursor: pointer;
  border: 2px dashed #2b2c2b;
  border-radius: 2px;
  text-align: center;
`;
const TextArea = styled.textarea`
  border: 0.5px solid #2c2b2c;
  padding: 5px;
  height: 150px;
`;
const SubmitButton = styled.button`
  padding: 15px;
  width: 100%;
  margin: 20px 0;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #2c2b2c;
  cursor: pointer;
  font-weight: 700;
`;

export default function Form() {
  const [themeColor] = useContext(ThemeColorContext);
  const { user } = useAuth();
  const [artist, setArtist] = useState("");
  const [username, setUsername] = useState("");
  const timeStamp = new Date();
  const hiddenFileInput = useRef(null);
  const handleChange = (e) => setUploadedImage(e.target.files[0]);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const emojis = [
    {
      value: "like",
      src: like.src,
    },
    {
      value: "love",
      src: love.src,
    },
    { value: "hope", src: hope.src },
  ];

  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    emoji: "",
    title: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    const getUserJourney = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const artistRecommendation = docs[0].visitorJourney[
        docs[0].visitorJourney.length - 1
      ].recommendedArtist
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setArtist(artistRecommendation);
      setUsername(docs[0].name);
    };
    getUserJourney();
  }, [user.uid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadImage();
    console.log("handleForm");
    setUploadedImage(null);
    setFormData({
      emoji: "",
      title: "",
      content: "",
      date: "",
    });
  };

  const sendForm = (url) => {
    async function sendData() {
      try {
        const docRef = await addDoc(collection(db, "user-posts"), {
          emoji: formData.emoji,
          date: formData.date,
          title: formData.title,
          textContent: formData.content,
          postTime: timeStamp,
          userId: user.uid,
        });
        console.log("Document written with ID: ", docRef.id);
        const IDRef = doc(db, "user-posts", docRef.id);
        await updateDoc(IDRef, {
          id: docRef.id,
          uploadedImage: url,
          artistForThisVisit: artist,
          postMadeBy: username,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    sendData();
  };

  const uploadImage = async () => {
    if (uploadedImage === null) return;
    const sendImage = () => {
      try {
        return new Promise((resolve) => {
          const imageRef = ref(storage, `${user.uid}/${uploadedImage.name}`);
          const uploadTask = uploadBytesResumable(imageRef, uploadedImage);

          uploadTask.on(
            "state_changed",
            () => {},
            () => {},
            async () => {
              try {
                const res = await getDownloadURL(uploadTask.snapshot.ref);
                console.log(res);

                resolve(res);
              } catch (e) {
                console.error("Error of promise: ", e);
              }
            }
          );
        });
      } catch (e) {
        console.error("Error sending document: ", e);
      }
    };
    const newRes = await sendImage();
    sendForm(newRes);
  };

  return (
    <>
      <MainForm onSubmit={handleSubmit}>
        <FormFieldset>
          <FormLegend>
            Having been on this journey through the inner world of {artist}, you
            feel...
          </FormLegend>
          <div style={{ display: "flex" }}>
            {emojis.map((emoji) => (
              <EmojiInput key={emoji.value}>
                <RadioInput
                  type="radio"
                  name="feeling"
                  value="emoji.value"
                  required
                  checked={formData.emoji === emoji.value}
                  onChange={(e) => {
                    if (e.target.checked) console.log(emoji.value);
                    setFormData({ ...formData, emoji: emoji.value });
                  }}
                />
                <Emoticon>
                  <img
                    alt={emoji.value}
                    src={emoji.src}
                    style={{ width: "40px", height: "40px" }}
                  />
                </Emoticon>
              </EmojiInput>
            ))}
          </div>
        </FormFieldset>

        <FormFieldset>
          <FormLable htmlFor="resonance">
            It would be great to hear about your experiences or a painting you
            thought of, while going through this experience.
          </FormLable>
          <TextArea
            id="resonance"
            name="resonance"
            placeholder="Tell us about your story..."
            value={formData.content}
            required
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
            }}
          ></TextArea>
        </FormFieldset>
        <FormFieldset>
          <FormLable htmlFor="title">
            Would you like to give this story a title:
          </FormLable>
          <FormInput
            id="title"
            name="title"
            placeholder="Enter title..."
            value={formData.title}
            required
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          ></FormInput>
        </FormFieldset>
        <FormFieldset>
          <FormLable htmlFor="date">
            Date when your story takes place:
          </FormLable>
          <FormInput
            id="date"
            type="date"
            name="date"
            placeholder="Select date..."
            value={formData.date}
            required
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
            }}
          ></FormInput>
        </FormFieldset>

        <FormFieldset>
          <FileUpload onClick={handleClick}>
            <img style={{ margin: "auto" }} src={imageupload.src} />
            <div>
              Click here to attach a photo of your beloved artwork, or anything
              related to your experience!
            </div>
            <p>(max 50MB)</p>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
              required
            />
          </FileUpload>
          <ul>
            <li>Please use only your own original materials.</li>
          </ul>
        </FormFieldset>
        <SubmitButton type="submit">Submit</SubmitButton>
      </MainForm>
      <div>
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
