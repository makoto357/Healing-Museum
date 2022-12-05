import Script from "next/script";

export default function Custom404() {
  return (
    <>
      <h1
        style={{
          textAlign: "left",
          fontSize: "2rem",
          paddingTop: "40px",
          margin: "auto 15vw",
        }}
      >
        <strong>404 - Page Not Found...Redirecting to Home Page</strong>
      </h1>
      <Script id="redirect">{`document.location.href="/"`}</Script>
    </>
  );
}
