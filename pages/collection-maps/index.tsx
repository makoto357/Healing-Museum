import React from "react";
import dynamic from "next/dynamic";

const GoogleMaps = dynamic(() => import("../../components/Map"), {
  ssr: false,
});

export default function CollectionMap() {
  return (
    <div style={{ height: "100%", paddingTop: "44px" }}>
      <GoogleMaps />
    </div>
  );
}
