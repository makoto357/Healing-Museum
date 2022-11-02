import Link from "next/link";
import Image from "next/image";
export default function Form() {
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
    </>
  );
}
