import styled from "@emotion/styled";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AlertBox from "../components/AlertBox";
import { db, storage } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { getUserInfo } from "../utils/firebaseFuncs";
import SignpostButton from "../components/Button";
import imageupload from "../asset/imageupload.svg";
import backToPrevious from "../asset/back-to-previous.svg";
import heartFilled from "../asset/filled-heal.png";
import heartUnfilled from "../asset/white-heal.png";
import relateFilled from "../asset/relate-filled.png";
import relateUnfilled from "../asset/relate-unfilled.png";
import togetherFilled from "../asset/together-filled.png";
import togetherUnfilled from "../asset/together-unfilled.png";
import hopeUnfilled from "../asset/hopeful-unfilled.png";
import hopeFilled from "../asset/hopeful-filled.png";

const Wrapper = styled.div`
  padding-top: 40px;
  margin: auto;
`;
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

const Emoticon = styled.div<{ $bgImage: string; $bgImageHover: string }>`
  width: 40px;
  height: 40px;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  cursor: pointer;
  &:hover {
    background-image: url(${(props) => props.$bgImageHover});
  }
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
  height: 280px;
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
  height: 100px;
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
const FormHeader = styled.div`
  height: 70px;
  padding: 22px 45px;
  font-size: 1.25rem;
  text-align: center;
  border-bottom: 1px solid #c2c2c2;
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
const FileImage = styled.img`
  margin: auto;
`;
const InstructionText = styled.div`
  max-width: 250px;
  margin: 0 auto;
`;

const FileInput = styled.input`
  display: none;
`;

const PreloadBackgroundImg = styled.div`
  display: none;
`;
const Img = styled.img``;
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
  value: string | undefined;
  filled: string | undefined;
  unfilled: string | undefined;
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
      getUserInfo(user?.uid).then(
        ({ recommendedArtist, userName, drawingForFeedbackForm }) => {
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
        }
      );
    }
  }, [user, artist]);

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
      <SignpostButton href="">Skip this step...</SignpostButton>
    </Wrapper>
  );
}
