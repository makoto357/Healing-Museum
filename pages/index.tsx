import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <nav className="nav">
        <Link href="/registration">
          <div>start the journey</div>
        </Link>
      </nav>
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
            <Link href="/quiz">
              <p>Quiz</p>
            </Link>
          </li>
          <li>
            <Link href="/collection-maps">
              <p>Collection Maps</p>
            </Link>
          </li>
          <li>
            <Link href="/artworks">
              <p>Artworks</p>
            </Link>
          </li>
          <li>
            <Link href="/artist-video">
              <p>artist video</p>
            </Link>
          </li>
          <li>
            <Link href="/visitor-posts">
              <p>visitor post</p>
            </Link>
          </li>

          {user && (
            <li>
              <Link href="/user-profile">
                <p>Profile</p>
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
