import Link from "next/link";

export default function Form() {
  return (
    <>
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>

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
            Does the life story and works of the artist echos with your personal
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
            <img />
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
