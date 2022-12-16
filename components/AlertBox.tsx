import styled from "@emotion/styled";
import { useRouter } from "next/router";

const AlertMessageWrapper = styled.div``;
const AlertMessage = styled.p``;
const AlertButtonWrapper = styled.div`
  width: 100%;
`;
const AlertButton = styled.button`
  margin-top: 5px;
  padding: 3px 10px;
  background: black;
  color: white;
`;

export default function AlertBox() {
  const router = useRouter();

  return (
    <AlertMessageWrapper>
      <AlertMessage>
        Take the art quiz to get your artist recommendation!
      </AlertMessage>
      <AlertButtonWrapper>
        <AlertButton onClick={() => router.push("/quiz")}>
          Take a quiz
        </AlertButton>
      </AlertButtonWrapper>
    </AlertMessageWrapper>
  );
}
