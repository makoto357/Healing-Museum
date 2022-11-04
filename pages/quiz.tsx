import { Radio } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
export default function Quiz() {
  const [themeColor] = useContext(ThemeColorContext);
  const router = useRouter();
  const onChangeValue = (e) => {
    console.log(e.target.value);
    router.push("/collection-maps");
  };
  return (
    <>
      <h1>
        Your preference and personalities resonate with this artist in the
        museum collections:
      </h1>
      <div onChange={onChangeValue}>
        <input type="radio" id="artist1" name="artist" value="vangogh" />
        <label htmlFor="artist1">VAN GOGH</label>

        <input type="radio" id="artist2" name="artist" value="klimt" />
        <label htmlFor="artist1">KLIMT</label>

        <input type="radio" id="artist3" name="artist" value="frida" />
        <label htmlFor="artist1">FRIDA</label>
      </div>

      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
