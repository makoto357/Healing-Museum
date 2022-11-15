import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";

const Title = styled.h1`
  font-size: 2rem;
  text-align: left;
  margin: 0 auto 10px;
  width: 1200px;
`;

const ColorPicker = styled.div`
  display: flex;
  margin: auto;
  width: 1200px;
  height: 65vh;
`;

const Event = styled.button`
  width: 200px;
  border-radius: 10px;
  margin-right: 10px;
  height: 100%;
  &:hover {
    transition: width 0.5s;
    width: 600px;
  }
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
    <>
      <Title>
        Welcome to the Healing Museum.
        <br /> Please select a color which best represents your mood today:
      </Title>
      <ColorPicker>
        {themeColors.map((themeColor) => (
          <Event
            key={themeColor.primary}
            style={{
              background: themeColor.primary,
            }}
            value={themeColor.secondary}
            onClick={(e) => {
              const target = e.target as HTMLButtonElement;
              setThemeColor(target.value);
              router.push("/quiz");
            }}
          ></Event>
        ))}
      </ColorPicker>
    </>
  );
}
