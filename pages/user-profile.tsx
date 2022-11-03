import Link from "next/link";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";

export default function UserProfile() {
  const [themeColor] = useContext(ThemeColorContext);

  return (
    <>
      <div>profile</div>
      <div style={{ textAlign: "right" }}>
        <Link href="/visitor-posts">
          <p>check posts of other visitors.</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
