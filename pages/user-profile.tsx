import Link from "next/link";

export default function UserProfile() {
  return (
    <>
      <div>profile</div>
      <div style={{ textAlign: "right" }}>
        <Link href="/visitor-posts">
          <p>check posts of other visitors.</p>
        </Link>
      </div>
    </>
  );
}
