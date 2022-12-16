import React from "react";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const GoogleMaps = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

const Wrapper = styled.div`
  height: 100%;
  padding-top: 40px;
`;
export default function CollectionMap() {
  return (
    <Wrapper>
      <GoogleMaps />
    </Wrapper>
  );
}
