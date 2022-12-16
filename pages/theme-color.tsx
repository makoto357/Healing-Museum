import styled from "@emotion/styled";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import SignpostButton from "../components/Button";

interface Prop {
  $colorCode?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  text-align: left;
  margin: 0 auto 20px;
  width: 80vw;
`;

const ColorPicker = styled.div`
  display: flex;
  margin: auto;
  width: 80vw;
  height: 60vh;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const ColorOption = styled.div`
  width: 12vw;
  border-radius: 10px;
  margin-right: 10px;
  height: 100%;
  background-color: ${(props: Prop) => props.$colorCode};
  transition: width 0.5s;

  &:hover {
    transition: width 0.5s;
    width: 24vw;
  }
  @media screen and (max-width: 600px) {
    width: 80vw;
    height: 12vh;
    margin-bottom: 10px;
    transition: height 0.5s;

    &:hover {
      transition: width none;
      width: 80vw;
      transition: height 0.5s;
      height: 24vh;
    }
  }
`;

export default function ThemeColor() {
  const themeColors = [
    { primary: "#a13b34", secondary: "#d39a72" },
    { primary: "#E77136", secondary: "#ffc87c" },
    { primary: "#F2C641", secondary: "#Ffe9a1" },
    { primary: "#8aa56e", secondary: "#B1C0A4" },
    { primary: "#49626B", secondary: "#A0BCB8" },
    { primary: "#595775", secondary: "#ABa6bf" },
  ];

  // eslint-disable-next-line no-unused-vars
  const { setThemeColor } = useContext(ThemeColorContext);

  return (
    <Wrapper>
      <Title>
        Welcome to the Healing Museum.
        <br /> <strong>Please select a color</strong> which best represents your
        mood today:
      </Title>
      <ColorPicker>
        {themeColors.map((themeColor) => (
          <ColorOption
            key={themeColor.primary}
            role="button"
            $colorCode={`${themeColor.primary}`}
            onClick={(e) => {
              e.preventDefault();
              setThemeColor(themeColor);
            }}
          ></ColorOption>
        ))}
      </ColorPicker>
      <SignpostButton href="/drawing-board">Go with this color</SignpostButton>
    </Wrapper>
  );
}
