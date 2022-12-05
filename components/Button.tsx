import Link from "next/link";

export default function SignpostButton({ children, href }) {
  return (
    <div className="container">
      <ul>
        <li>
          <Link className="animated-arrow" href={href}>
            <span className="the-arrow -left">
              <span className="shaft"></span>
            </span>
            <span className="main">
              <span className="text">{children}</span>
              <span className="the-arrow -right">
                <span className="shaft"></span>
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
