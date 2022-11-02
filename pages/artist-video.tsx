import Link from "next/link";

export default function ArtistVideo() {
  return (
    <>
      <div>Artist Video</div>
      <div style={{ textAlign: "right" }}>
        <Link href="/form">
          <p>And Finally...</p>
        </Link>
      </div>
    </>
  );
}
