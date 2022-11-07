import Link from "next/link";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";

export default function ArtistVideo() {
  const [themeColor] = useContext(ThemeColorContext);
  return (
    <>
      <div>Artist Video</div>
      <div style={{ textAlign: "right" }}>
        <Link href="/form">
          <p>And Finally...</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
      ;
    </>
  );
}
