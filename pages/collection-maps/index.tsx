import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GoogleMaps = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function CollectionMap() {
  return (
    <>
      <GoogleMaps />
    </>
  );
}
