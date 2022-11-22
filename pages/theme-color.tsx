import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";

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
              const target = e.target as HTMLButtonElement;
              setThemeColor(themeColor);
            }}
          ></Event>
        ))}
      </ColorPicker>
      <button
        style={{ paddingBottom: "20px" }}
        onClick={() => router.push("/quiz")}
      >
        I like this color!
      </button>
    </div>
  );
}
