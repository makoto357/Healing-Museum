import Link from "next/link";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
export default function ThemeColor() {
  const themeColors = ["red", "orange", "yellow", "green", "blue", "purple"];
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);
  return (
    <>
      {themeColors.map((themeColor) => (
        <button
          key={themeColor}
          style={{ background: themeColor, height: "100px", width: "100px" }}
          value={themeColor}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            setThemeColor(target.value);
          }}
        ></button>
      ))}
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
      <div style={{ textAlign: "right" }}>
        <Link href="/quiz">
          <p>click colors to go to quiz page</p>
        </Link>
      </div>
    </>
  );
}
