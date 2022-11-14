import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
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
      <h1>
        Welcome to the Healing Museum. Please select a color which best
        represents your mood today:
      </h1>
      {themeColors.map((themeColor) => (
        <button
          key={themeColor.primary}
          className="backgroundColor:"
          style={{
            background: themeColor.primary,
            height: "500px",
            width: "100px",
            marginRight: "5px",
            borderRadius: "10px",
          }}
          value={themeColor.secondary}
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
