import styled from "@emotion/styled";
import { useRouter } from "next/router";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import SignpostButton from "../components/Button";
import imageupload from "../asset/imageupload.svg";
import backToPrevious from "../asset/back-to-previous.svg";
import image from "../asset/canvas.png";
import heartFilled from "../asset/filled-heal.png";
import heartUnfilled from "../asset/white-heal.png";
import relateFilled from "../asset/relate-filled.png";
import relateUnfilled from "../asset/relate-unfilled.png";
import togetherFilled from "../asset/together-filled.png";
import togetherUnfilled from "../asset/together-unfilled.png";
import hopeUnfilled from "../asset/hopeful-unfilled.png";
import hopeFilled from "../asset/hopeful-filled.png";
const MainForm = styled.form`
  width: 90vw;
  max-width: 700px;
  margin: 0 auto;
  background: white;
`;

const EmojiInput = styled.div`
  position: relative;
  height: 40px;
  width: 40px;
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
  margin-bottom: 10px;
`;

const FormInput = styled.input`
  border-bottom: 1.75px solid #c2c2c2;
  padding: 5px 0 10px;
  &:focus {
    outline: none;
    border-bottom: 1.75px solid black;
  }
`;

const FileUpload = styled.div`
  display: block;
  width: 100%;
  font-weight: 500;
  text-align: center;
  padding: 60px 0;
  cursor: pointer;
  border: 2px dashed #c2c2c2;
  border-radius: 2px;
  text-align: center;
`;

const UploadedImage = styled.div<{
  $uploadedImage: string;
}>`
  background-image: url(${(props) => props.$uploadedImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const TextArea = styled.textarea`
  resize: none;
  border-bottom: 1.75px solid #c2c2c2;
  padding: 5px;
  height: 60px;
  &:focus {
    outline: none;
    border-bottom: 1.75px solid black;
  }
`;
const SubmitButton = styled.button`
  padding: 15px;
  width: 100%;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #c2c2c2;
  cursor: pointer;
  font-weight: 700;
`;

const FormWrapper = styled.div`
  padding: 25px 85px 65px;
  @media screen and (max-width: 600px) {
    padding: 25px 45px 65px;
  }
`;

const BackToPrevious = styled.span<{ $hideOption: string }>`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-image: url(${backToPrevious.src});
  float: left;
  margin-left: -24px;
  background-repeat: no-repeat;
  background-position: 50%;
  display: ${(props) => props.$hideOption};
`;

const EmojiLabel = styled.div<{ $showLabel: string }>`
  width: fit-content;
  white-space: nowrap;
  border-radius: 20px;
  background: #2c2b2c;
  color: white;
  padding: 5px 10px;
  font-weight: 500;
  margin-top: 10px;
  display: ${(props) => props.$showLabel};
`;
const EmojiWrapper = styled.div`
  display: flex;
  margin: 25px auto 0px;
  justify-content: space-between;
  column-gap: 100px;
  text-align: center;
  @media screen and (max-width: 800px) {
    column-gap: 12vw;
  }
  @media screen and (max-width: 600px) {
    column-gap: 3vw;
  }
`;
interface ILabel {
  value: string | undefined;
  filled: string | undefined;
  unfilled: string | undefined;
}
export default function Form() {
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [artist, setArtist] = useState("");
  const [username, setUsername] = useState("");
  const timeStamp = new Date();
  const hiddenFileInput = useRef(null);
  const [nextPage, setNextPage] = useState(false);
  const [showLabel, setShowLabel] = useState<ILabel>({
    value: " ",
    filled: " ",
    unfilled: " ",
  });
  const handleChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setUploadedImage(e.target.files[0]);
  };
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const emojis = [
    {
      value: "I feel seen",
      filled: heartFilled.src,
      unfilled: heartUnfilled.src,
    },
    {
      value: "I can relate to the artist",
      filled: relateFilled.src,
      unfilled: relateUnfilled.src,
    },
    {
      value: "I feel supported",
      filled: togetherFilled.src,
      unfilled: togetherUnfilled.src,
    },
    {
      value: "I feel hopeful",
      filled: hopeFilled.src,
      unfilled: hopeUnfilled.src,
    },
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
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const artistRecommendation = docs[0].visitorJourney[
        docs[0].visitorJourney.length - 1
      ]?.recommendedArtist
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setArtist(artistRecommendation);
      setUsername(docs[0].name);
    };
    if (user) {
      getUserJourney();
    }
  }, [user, nextPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadImage();
    setUploadedImage(null);
    setFile(null);
    setFormData({
      emoji: "",
      title: "",
      content: "",
      date: "",
    });
  };

  const sendForm = (url) => {
    async function sendData() {
      const docRef = await addDoc(collection(db, "user-posts"), {
        emoji: formData.emoji,
        date: formData.date,
        title: formData.title,
        textContent: formData.content,
        postTime: timeStamp,
        userId: user?.uid,
        comments: [],
      });
      const IDRef = doc(db, "user-posts", docRef.id);
      await updateDoc(IDRef, {
        id: docRef.id,
        uploadedImage: url,
        artistForThisVisit: artist,
        postMadeBy: username,
      });
    }
    sendData();
  };

  const uploadImage = async () => {
    if (uploadedImage === null) return;
    const sendImage = () => {
      return new Promise((resolve) => {
        const imageRef = ref(storage, `${user?.uid}/${uploadedImage.name}`);
        const uploadTask = uploadBytesResumable(imageRef, uploadedImage);

        uploadTask.on(
          "state_changed",
          () => {},
          () => {},
          async () => {
            const res = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(res);
          }
        );
      });
    };
    const newRes = await sendImage();
    sendForm(newRes);
  };

  return (
    <div style={{ paddingTop: "30px", margin: "auto" }}>
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <MainForm onSubmit={handleSubmit}>
        <div
          style={{
            height: "70px",
            padding: "22px 45px",
            fontSize: "1.25rem",
            textAlign: "center",
            borderBottom: "1px solid #c2c2c2",
          }}
        >
          <BackToPrevious
            $hideOption={nextPage ? "initial" : "none"}
            onClick={() => setNextPage(false)}
          ></BackToPrevious>
          <strong>Share your story</strong>
        </div>
        {!nextPage && (
          <FormWrapper>
            <FormFieldset>
              <FormLable htmlFor="feeling">
                <strong>
                  Having been on this journey through the inner world of{" "}
                  {artist}, you feel...
                </strong>
              </FormLable>
              <EmojiWrapper>
                {emojis.map((emoji, index) => (
                  <EmojiInput
                    key={emoji.value}
                    onMouseEnter={() => {
                      setShowLabel(emoji);
                    }}
                    onMouseLeave={() =>
                      setShowLabel({
                        value: " ",
                        filled: " ",
                        unfilled: " ",
                      })
                    }
                  >
                    <RadioInput
                      type="radio"
                      name="feeling"
                      value="emoji.value"
                      required
                      checked={formData.emoji === emoji.value}
                      onChange={(e) => {
                        setFormData({ ...formData, emoji: emoji.value });
                      }}
                    />
                    <div>
                      <Emoticon>
                        <img
                          alt={emoji.value}
                          src={
                            formData.emoji == emoji.value
                              ? emoji.filled
                              : emoji.unfilled
                          }
                          style={{ width: "40px", height: "40px" }}
                        />
                      </Emoticon>
                      <EmojiLabel
                        $showLabel={
                          showLabel.value == emoji.value ? "inherit" : "none"
                        }
                      >
                        {emoji.value}
                      </EmojiLabel>
                    </div>
                  </EmojiInput>
                ))}
              </EmojiWrapper>
            </FormFieldset>

            <FormFieldset>
              <FormLable htmlFor="resonance">
                <strong>
                  It would be great to hear about your experiences or a painting
                  you thought of, while going through this experience.
                </strong>
              </FormLable>
              <TextArea
                id="resonance"
                name="resonance"
                placeholder="Tell us about your story..."
                value={formData.content}
                required
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value.trim() });
                }}
              ></TextArea>
            </FormFieldset>
            <SubmitButton
              onClick={() => {
                if (!formData.emoji || !formData.content) {
                  return;
                }
                setNextPage(true);
              }}
            >
              Continue
            </SubmitButton>
          </FormWrapper>
        )}
        {nextPage && (
          <FormWrapper>
            <FormFieldset>
              <FormLable htmlFor="title">
                <strong>Would you like to give this story a title:</strong>
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
                <strong>Date when your story takes place:</strong>
              </FormLable>
              <FormInput
                id="date"
                type="date"
                lang="en"
                name="date"
                min="1900-01-01"
                max="3000-01-01"
                placeholder="Select date..."
                value={formData.date}
                required
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                }}
              ></FormInput>
            </FormFieldset>

            <FormFieldset>
              <UploadedImage $uploadedImage={file ? file : ""}>
                <FileUpload onClick={handleClick}>
                  <img
                    alt="uploaded image"
                    style={{ margin: "auto" }}
                    src={imageupload.src}
                  />
                  <div style={{ maxWidth: "250px", margin: "0 auto" }}>
                    <strong>
                      Click here to attach a photo of your beloved artwork, or
                      anything related to your experience!
                    </strong>
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
              </UploadedImage>
              <ul style={{ margin: "10px 0" }}>
                <li>
                  <strong>Please use only your own original materials.</strong>
                </li>
              </ul>
            </FormFieldset>
            <SubmitButton
              onClick={() => {
                if (!formData.date || !formData.title) {
                  return;
                } else if (!uploadedImage) {
                  toast("Please upload an image related to your experience.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    icon: ({ theme, type }) => <img src={image.src} />,
                  });
                  return;
                }
                router.push("/user-profile");
              }}
            >
              Submit
            </SubmitButton>
          </FormWrapper>
        )}
      </MainForm>
      <SignpostButton href="/visitor-posts">Skip this step...</SignpostButton>
    </div>
  );
}
