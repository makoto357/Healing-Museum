import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import SignpostButton from "../components/Button";

interface Prop {
  $colorCode?: string;
}

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: left;
  margin: 0 auto;
  width: 80vw;
`;

const ColorPicker = styled.div`
  display: flex;
  margin: auto;
  width: 80vw;
  height: 60vh;
`;

const Event = styled.button`
  width: 12vw;
  border-radius: 10px;
  margin-right: 10px;
  height: 100%;
  background-color: ${(props: Prop) => props.$colorCode};

  &:hover {
    transition: width 0.5s;
    width: 24vw;
  }
`;

const Button = styled.button`
  padding: 15px;
  width: 200px;
  margin: 20px auto;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #2c2b2c;
  cursor: pointer;
  border-radius: 0px;
`;

export default function ThemeColor() {
  const router = useRouter();
  const themeColors = [
    { primary: "#a13b34", secondary: "#d39a72" },
    { primary: "#E77136", secondary: "#ffc87c" },
    { primary: "#F2C641", secondary: "#Ffe9a1" },
    { primary: "#8aa56e", secondary: "#B1C0A4" },
    { primary: "#49626B", secondary: "#A0BCB8" },
    { primary: "#595775", secondary: "#ABa6bf" },
  ];

  const [themeColor, setThemeColor] = useContext(ThemeColorContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingTop: "104px",
      }}
    >
      <Title>
        Welcome to the Healing Museum.
        <br /> Please select a color which best represents your mood today:
      </Title>
      <ColorPicker>
        {themeColors.map((themeColor) => (
          <Event
            key={themeColor.primary}
            $colorCode={`${themeColor.primary}`}
            value={themeColor.secondary}
            onClick={(e) => {
              setThemeColor(themeColor);
            }}
          ></Event>
        ))}
      </ColorPicker>
      <SignpostButton href="/quiz">Go with this color</SignpostButton>
    </div>
  );
}
