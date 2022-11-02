import Link from "next/link";

export default function ThemeColor() {
  const themeColors = ["red", "orange", "yellow", "green", "blue", "purple"];
  return (
    <>
      {themeColors.map((themeColor) => (
        <button
          key={themeColor}
          style={{ background: themeColor, height: "100px", width: "100px" }}
          value={themeColor}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            console.log(target.value);
          }}
        ></button>
      ))}
      <div style={{ textAlign: "right" }}>
        <Link href="/quiz">
          <p>click colors to go to quiz page</p>
        </Link>
      </div>
    </>
  );
}
