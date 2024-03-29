import styled from "@emotion/styled";
import link from "../../../../asset/link.png";

const LikeButton = styled.div`
  background-image: url(${link.src});
  width: 25px;
  height: 25px;
  background-size: cover;
  cursor: pointer;
`;
export const CopyClipboard = ({ content }: { content: string }) => {
  return (
    <>
      <LikeButton onClick={() => navigator.clipboard.writeText(content)} />
    </>
  );
};
