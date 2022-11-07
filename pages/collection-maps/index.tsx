import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GoogleMaps = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function CollectionMap() {
  return (
    <>
      <h1>
        Explore the collection and select an artwork to read the story of{" "}
        {"selected-artist"}
      </h1>

      <GoogleMaps />
    </>
  );
}
