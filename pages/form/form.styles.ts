import styled from "@emotion/styled";
import backToPrevious from "../../asset/back-to-previous.svg";

export const Wrapper = styled.div`
  padding-top: 40px;
  margin: auto;
`;
export const MainForm = styled.form`
  width: 90vw;
  max-width: 700px;
  margin: 0 auto;
  background: white;
`;


export const EmojiInput = styled.div`
  position: relative;
  height: 40px;
  width: 40px;
`;


export const Emoticon = styled.div<{ $bgImage: string; $bgImageHover: string }>`
  width: 40px;
  height: 40px;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  cursor: pointer;
  &:hover {
    background-image: url(${(props) => props.$bgImageHover});
  }
`;


export const RadioInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  cursor: pointer;
`;


export const FormFieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  margin-bottom: 35px;
`;

 
export const FormLable = styled.label`
  margin-bottom: 10px;
`;


export const FormInput = styled.input`
  border-bottom: 1.75px solid #c2c2c2;
  padding: 5px 0 10px;
  &:focus {
    outline: none;
    border-bottom: 1.75px solid black;
  }
`;



export const FileUpload = styled.div`
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



export const UploadedImage = styled.div<{
  $uploadedImage: string;
}>`
  background-image: url(${(props) => props.$uploadedImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;


export const TextArea = styled.textarea`
  resize: none;
  border-bottom: 1.75px solid #c2c2c2;
  padding: 5px;
  height: 100px;
  &:focus {
    outline: none;
    border-bottom: 1.75px solid black;
  }
`;



export const SubmitButton = styled.button`
  padding: 15px;
  width: 100%;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #c2c2c2;
  cursor: pointer;
  font-weight: 700;
`;




export const FormWrapper = styled.div`
  padding: 25px 85px 65px;
  @media screen and (max-width: 600px) {
    padding: 25px 45px 65px;
  }
`;

export const FormHeader = styled.div`
  height: 70px;
  padding: 22px 45px;
  font-size: 1.25rem;
  text-align: center;
  border-bottom: 1px solid #c2c2c2;
`;





export const BackToPrevious = styled.span<{ $hideOption: string }>`
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




export const EmojiLabel = styled.div<{ $showLabel: string }>`
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



export const EmojiWrapper = styled.div`
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



export const FileImage = styled.img`
  margin: auto;
`;
export const InstructionText = styled.div`
  max-width: 250px;
  margin: 0 auto;
`;

export const FileInput = styled.input`
  display: none;
`;

export const PreloadBackgroundImg = styled.div`
  display: none;
`;
export const Img = styled.img``;