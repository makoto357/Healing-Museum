import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
export default function ThemeColor() {
  const router = useRouter();
  const themeColors = [
    "#cf2e2e",
    "#AF8C12",
    "#F2C641",
    "#4E74A6",
    "#0094A3",
    "#9966cb",
  ];

  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  return (
    <>
      <h1>
        Welcome to the Healing Museum. Please select a color which best
        represents your mood today:
      </h1>
      {themeColors.map((themeColor) => (
        <button
          key={themeColor}
          className="backgroundColor:"
          style={{
            background: themeColor,
            height: "500px",
            width: "100px",
            marginRight: "5px",
            borderRadius: "10px",
          }}
          value={themeColor}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            setThemeColor(target.value);
            router.push("/quiz");
          }}
        ></button>
      ))}
      {/* <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div> */}
    </>
  );
}
