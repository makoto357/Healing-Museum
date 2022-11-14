import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { FacebookShareButton } from "next-share";
import fb from "../asset/fb.svg";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["index"])),
    },
  };
}
export default function Home(props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <>
      <div className="index-page">
        <style jsx>{`
          .nav {
            display: flex;
          }
          .index-page {
            display: flex;
          }
          .intro-text {
            width: 600px;
            margin: auto;
          }
        `}</style>

        <ul>
          <li>
            <FacebookShareButton
              url={"https://the-healing-museum-makoto357.vercel.app"}
              quote={
                "The Healing Museum brings you closer to the world of modern art."
              }
              hashtag={
                "#modernart #artiststory #artquiz #audiovisualtour #interactive"
              }
            >
              <div
                style={{
                  backgroundImage: `url(${fb.src})`,
                  width: "30px",
                  height: "30px",
                  backgroundSize: "cover",
                }}
              ></div>
            </FacebookShareButton>
          </li>
          <li>
            <Link href="/registration">
              <div>{t("index:home")}</div>
            </Link>
          </li>
          <li>
            <Link href="/quiz">
              <p>{t("index:quiz")}</p>
            </Link>
          </li>
          <li>
            <Link href="/collection-maps">
              <p>{t("index:map")}</p>
            </Link>
          </li>
          <li>
            <Link href="/artworks">
              <p>{t("index:details")}</p>
            </Link>
          </li>
          <li>
            <Link href="/artist-video">
              <p>{t("index:artworks")}</p>
            </Link>
          </li>
          <li>
            <Link href="/visitor-posts">
              <p>{t("index:posts")}</p>
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/user-profile">
                <p>{t("index:profile")}</p>
              </Link>
            </li>
          )}
        </ul>

        <section className="intro-text">
          <h1>The Healing Museum</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Accusantium magnam vitae laboriosam, nulla architecto ratione
            dolores consequatur eveniet blanditiis tempore nam aspernatur eum?
            Minima magni obcaecati ipsam doloremque aut maiores dignissimos.
            Molestiae possimus illum optio asperiores modi. Nam animi aliquam
            dolores veniam amet, laborum alias excepturi ea ex debitis velit
            voluptatibus omnis inventore, illum fugiat molestiae facere eum
            perspiciatis unde maxime nihil vitae! Nobis, aspernatur. Animi
            veritatis aperiam, quis ad repellendus nostrum totam doloremque
            voluptates, debitis veniam hic nihil explicabo quidem quo at modi
            earum? Pariatur odio, sed iusto odit ut, vitae, possimus hic
            asperiores fuga quam recusandae dolor. Aliquam?
          </p>
        </section>
      </div>
    </>
  );
}
