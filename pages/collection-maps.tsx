import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GoogleMaps = dynamic(() => import("../components/google-maps"), {
  ssr: false,
});

export default function CollectionMap() {
  return (
    <>
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>
      <GoogleMaps />
    </>
  );
}
