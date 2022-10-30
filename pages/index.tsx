import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/collection-map">
          <a>Collection Maps</a>
        </Link>
      </li>
      <li>
        <Link href="/collections">
          <a>Collections</a>
        </Link>
      </li>
      <li>
        <Link href="/user-profile">
          <a>Collections</a>
        </Link>
      </li>
      <li>
        <Link href="/artwork">
          <a></a>
        </Link>
      </li>
    </ul>
  );
}
