import { useRouter } from "next/router";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AlertBox from "../../components/AlertBox";
import { db, storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../utils/firebaseFuncs";
import SignpostButton from "../../components/Button";
import imageupload from "../../asset/imageupload.svg";

import heartFilled from "../../asset/filled-heal.png";
import heartUnfilled from "../../asset/white-heal.png";
import relateFilled from "../../asset/relate-filled.png";
import relateUnfilled from "../../asset/relate-unfilled.png";
import togetherFilled from "../../asset/together-filled.png";
import togetherUnfilled from "../../asset/together-unfilled.png";
import hopeUnfilled from "../../asset/hopeful-unfilled.png";
import hopeFilled from "../../asset/hopeful-filled.png";
import {
  Wrapper,
  MainForm,
  EmojiInput,
  Emoticon,
  RadioInput,
  FormFieldset,
  FormLable,
  FormInput,
  FileUpload,
  UploadedImage,
  TextArea,
  SubmitButton,
  FormWrapper,
  FormHeader,
  BackToPrevious,
  EmojiLabel,
  EmojiWrapper,
  FileImage,
  InstructionText,
  FileInput,
  PreloadBackgroundImg,
  Img,
} from "./form.styles";

export function PreloadImages() {
  return (
    <PreloadBackgroundImg>
      <Img src={heartFilled.src} />
      <Img src={heartUnfilled.src} />
      <Img src={relateFilled.src} />
      <Img src={relateFilled.src} />
      <Img src={togetherFilled.src} />
      <Img src={togetherUnfilled.src} />
      <Img src={hopeUnfilled.src} />
      <Img src={hopeFilled.src} />
    </PreloadBackgroundImg>
  );
}
interface ILabel {
  value: string | null;
  filled: string | null;
  unfilled: string | null;
}
export default function Form() {
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [nextPage, setNextPage] = useState(false);
  const [showLabel, setShowLabel] = useState<ILabel>({
    value: " ",
    filled: " ",
    unfilled: " ",
  });
  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.files !== null) {
      setFile(URL.createObjectURL(target.files[0]));
      setUploadedImage(target.files[0]);
    }
  };
  const handleClick = () => {
    if (hiddenFileInput.current === null) return;
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

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    emoji: "",
    title: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (user) {
      const setUserForm = async () => {
        const { recommendedArtist, userName, drawingForFeedbackForm } =
          await getUserInfo(user?.uid);
        const artistRecommendation = recommendedArtist
          ?.split("-")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        if (!artistRecommendation) {
          toast(() => <AlertBox />, {
            closeOnClick: false,
          });
          return;
        }
        setArtist(artistRecommendation);
        setUsername(userName);
        setFile(drawingForFeedbackForm);
      };
      setUserForm();
    }
    router.prefetch("/visitor-posts");
  }, [user, artist, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.title || !formData.content) {
      return;
    }
    if (uploadedImage === null) {
      await sendForm(file !== undefined ? file : "");
      setFormData({
        emoji: "",
        title: "",
        content: "",
        date: "",
      });
      setFile("");
    } else if (uploadedImage !== null) {
      await uploadImage();
      setUploadedImage(null);
      setFile("");
      setFormData({
        emoji: "",
        title: "",
        content: "",
        date: "",
      });
    }
    router.push("/visitor-posts");
  };

  const sendForm = async (url: any) => {
    const docRef = await addDoc(collection(db, "user-posts"), {
      emoji: formData.emoji,
      date: formData.date,
      title: formData.title,
      textContent: formData.content,
      postTime: new Date(),
      userId: user?.uid,
      comments: [],
      numberOfLikes: [],
    });
    const IDRef = doc(db, "user-posts", docRef.id);
    await updateDoc(IDRef, {
      id: docRef.id,
      uploadedImage: url,
      artistForThisVisit: artist,
      postMadeBy: username,
    });
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
    await sendForm(newRes);
  };
  const checkFormData = () => {
    if (!formData.emoji) return;

    setNextPage(true);
  };

  return (
    <Wrapper>
      <MainForm onSubmit={handleSubmit}>
        <FormHeader>
          <BackToPrevious
            $hideOption={nextPage ? "initial" : "none"}
            onClick={() => setNextPage(false)}
          ></BackToPrevious>
          <strong>Share your story</strong>
        </FormHeader>
        {!nextPage ? (
          <FormWrapper>
            <FormFieldset>
              <FormLable htmlFor="feeling">
                <strong>
                  Having been on this journey through the inner world of&nbsp;
                  {artist}, you feel...
                </strong>
              </FormLable>
              <EmojiWrapper>
                {emojis.map((emoji) => (
                  <EmojiInput
                    key={emoji.value}
                    onPointerEnter={() => {
                      setShowLabel(emoji);
                    }}
                    onPointerLeave={() =>
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
                      onChange={() => {
                        setFormData({ ...formData, emoji: emoji.value });
                      }}
                    />
                    <div>
                      <Emoticon
                        $bgImage={
                          formData.emoji == emoji.value
                            ? emoji.filled
                            : emoji.unfilled
                        }
                        $bgImageHover={
                          showLabel.value == emoji.value ? emoji.filled : ""
                        }
                      />
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
              <FormLable htmlFor="title">
                {file && (
                  <strong>
                    Share the last drawing you made during your visits, or click
                    to upload another image:
                  </strong>
                )}
              </FormLable>
              <UploadedImage $uploadedImage={file ? file : ""}>
                <FileUpload onClick={handleClick}>
                  {!file && (
                    <>
                      <FileImage alt="uploaded image" src={imageupload.src} />

                      <InstructionText>
                        <strong>
                          Click here to attach a photo of your beloved artwork,
                          or anything related to your experience!
                        </strong>
                      </InstructionText>
                      <p>(max 50MB)</p>
                    </>
                  )}

                  <FileInput
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    required
                  />
                </FileUpload>
              </UploadedImage>
            </FormFieldset>

            <SubmitButton onClick={checkFormData}>Continue</SubmitButton>
          </FormWrapper>
        ) : (
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
                max="2120-01-01"
                placeholder="Select date..."
                value={formData.date}
                required
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                }}
              ></FormInput>
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
                  setFormData({ ...formData, content: e.target.value });
                }}
              ></TextArea>
            </FormFieldset>

            <SubmitButton>Submit</SubmitButton>
          </FormWrapper>
        )}
      </MainForm>
      <SignpostButton href="/visitor-posts">Skip this step...</SignpostButton>
    </Wrapper>
  );
}
