import Script from "next/script";
import styled from "@emotion/styled";

const Text = styled.h1`
  text-align: left;
  font-size: 2rem;
  padding-top: 40px;
  margin: auto 15vw;
`;

export default function Custom404() {
  return (
    <>
      <Text>
        <strong>404 - Page Not Found...Redirecting to Home Page</strong>
      </Text>
      <Script id="redirect">{`document.location.href="/"`}</Script>
    </>
  );
}
