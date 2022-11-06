import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
export default function ThemeColor() {
  const router = useRouter();
  const themeColors = ["red", "orange", "yellow", "green", "blue", "purple"];
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  return (
    <>
      <h1>
        Welcome to the Healing Museum. Please choose a color echoing with your
        mood today:
      </h1>
      {themeColors.map((themeColor) => (
        <button
          key={themeColor}
          style={{ background: themeColor, height: "100px", width: "100px" }}
          value={themeColor}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            setThemeColor(target.value);
            router.push("/quiz");
          }}
        ></button>
      ))}
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
