import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GoogleMaps = dynamic(() => import("../../components/map"), {
  ssr: false,
});

export default function CollectionMap() {
  return (
    <>
      <GoogleMaps />
    </>
  );
}
