import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
import like from "../asset/download-smiling-face-with-tightly-closed-eyes-icon-smiling-emoji-11562881831tykcocazrv.png";
export default function Form() {
  const [themeColor] = useContext(ThemeColorContext);
  return (
    <>
      <form className="main-form">
        <style jsx>{`
          .main-form {
            width: 500px;
            margin: auto;
          }
        `}</style>
        <p>
          Having been on this short trip to the inner world of {"Van Gogh"}, you
          feel...
        </p>
        <section className="flex">
          <Image
            src={like}
            alt="like"
            onClick={() => {
              console.log("like");
            }}
            width={30}
            height={30}
          />
          <Image
            src={like}
            alt="like"
            onClick={() => {
              console.log("love");
            }}
            width={30}
            height={30}
          />
          <Image
            src={like}
            alt="like"
            onClick={() => {
              console.log("sad");
            }}
            width={30}
            height={30}
          />
          <Image
            src={like}
            alt="like"
            onClick={() => {
              console.log("anger");
            }}
            width={30}
            height={30}
          />
        </section>
        <fieldset>
          <label htmlFor="resonance">
            Does the life story of this artist echos with your personal
            experiences?
          </label>
          <input
            name="resonance"
            type="text"
            placeholder="leave your words..."
            required
          ></input>
        </fieldset>
        <fieldset>
          <div>
            {/* <Image alt="" /> */}
            <div></div>
            <p></p>
            <div></div>
            <input type="file"></input>
          </div>
          <ul className="info-list">
            <li></li>
            <li>Please use only your own original photos</li>
          </ul>
        </fieldset>

        <button type="submit"></button>
      </form>
      <div style={{ textAlign: "right" }}>
        <Link href="/user-profile">
          <p>here is a souvenir for you at the end of your journey</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
