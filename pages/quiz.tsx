import { Radio } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
export default function Quiz() {
  const [themeColor] = useContext(ThemeColorContext);
  const onChangeValue = (e) => {
    console.log(e.target.value);
    // localStorage.setItem("artist", e.target.value);
  };
  return (
    <>
      <div onChange={onChangeValue}>
        <input type="radio" id="artist1" name="artist" value="vangogh" />
        <label htmlFor="artist1">VAN GOGH</label>

        <input type="radio" id="artist2" name="artist" value="klimt" />
        <label htmlFor="artist1">KLIMT</label>

        <input type="radio" id="artist3" name="artist" value="frida" />
        <label htmlFor="artist1">FRIDA</label>
      </div>
      <div style={{ textAlign: "right" }}>
        <Link href="/collection-maps">
          <p>click options to go to map page</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
