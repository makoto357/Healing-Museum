import styled from "@emotion/styled";
import upArrow from "../../asset/arrow-up.png";



export const Wrapper = styled.div`
  padding-top: 40px;
  .my-masonry-grid {
    display: flex;
    max-width: 1200px;
    width: 80vw;
    margin: auto;
    @media screen and (max-width: 500px) {
      margin: 0 auto;
    }
  }
  .my-masonry-grid_column > div {
    background: grey;
  }
`;

export const CommentContainer = styled.section`
  width: 270px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: all 0.5s ease;
  filter: grayscale(100%);
  margin: 0 auto 80px;
  &:before {
    z-index: -1;
    background: white;
    position: absolute;
    content: "";
    height: calc(100% - 40px);
    width: 100%;
    bottom: -40px;
    left: 0;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: skewY(-4deg);
    -ms-transform: skewY(-4deg);
    transform: skewY(-4deg);
  }
  &:hover {
    filter: grayscale(0%);
    box-shadow: 5px 5px 20px #888888;
    &:before {
      z-index: -1;
      background: white;
      position: absolute;
      content: "";
      height: 100%;
      width: 100%;
      bottom: -40px;
      left: 0;
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: skewY(-4deg);
      -ms-transform: skewY(-4deg);
      transform: skewY(-4deg);
    }
  }
`;

export const Post = styled.section`
  margin: 20px 20px 0px;
`;

export const MainImageWrapper = styled.div`
  width: 270px;
  min-height: 70px;
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

export const ButtonGroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;

export const CollectionButton = styled.div<{ $heart: string }>`
  background-image: url(${(props) => props.$heart});
  width: 20px;
  height: 20px;
  background-size: cover;
  margin-left: 5px;
`;

export const CommentButton = styled.div<{ $showComment: string }>`
  background-image: url(${(props) => props.$showComment});
  width: 20px;
  height: 20px;
  background-size: cover;
`;

export const TextArea = styled.textarea`
  border: 1px solid #2c2b2c;
  padding: 5px;
  width: 100%;
  resize: none;
  &:focus {
    outline: none;
  }
`;

export const Split = styled.div`
  border-bottom: 1px solid #2c2b2c;
  margin-bottom: 20px;
`;

export const SubmitButton = styled.button`
  padding: 1px 3px;
  border: 1px solid black;
  margin-left: 175px;
  background: #2c2b2c;
  color: white;
`;


export const SortButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 80vw;
  margin: auto;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
export const SortButton = styled.button<{
  $textColor: string;
  $bgColor: string;
}>`
  height: fit-content;
  font-size: 1.25rem;
  padding: 10px 20px;
  width: fit-content;
  border: 1px solid black;
  margin: 20px 0 26px 0;
  cursor: pointer;
  color: ${(props) => props.$textColor};
  background-color: ${(props) => props.$bgColor};
  &:hover {
    color: white;
    background-color: #2c2b2c;
  }
  @media screen and (max-width: 800px) {
    margin: 20px 0;
  }
`;



export const SortButtonSmScreen = styled.div`
  @media screen and (max-width: 800px) {
    display: flex;
    margin: auto;
  }
`;
export const AllPosts = styled.div`
  height: fit-content;
  font-size: 1.5rem;
  padding: 0px 20px;
  width: fit-content;
  margin: 50px 0 26px 0;
  color: black;
  @media screen and (max-width: 800px) {
    margin: 20px auto 0 auto;
  }
`;

export const ToTopIconWrapper = styled.div`
  position: fixed;
  bottom: 60px;
  right: 3vw;
  text-align: center;
  z-index: 2;
  @media screen and (max-width: 800px) {
    bottom: 24px;
  }
`;



export const ToTopIcon = styled.div`
  cursor: pointer;
  background-image: url(${upArrow.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  margin: auto;
`;


export const ToTopText = styled.div`
  cursor: pointer;
`;

export const MainImage = styled.img`
  width: 100%;
`;
export const ButtonGroup = styled.div`
  display: flex;
`;
export const LikeNumber = styled.p`
  margin-bottom: 2px;
`;

export const ReadmoreButton = styled.span`
  color: #a3a3a3;
  cursor: pointer;
`;