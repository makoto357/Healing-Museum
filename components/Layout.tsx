import Link from "next/link";
import { FacebookShareButton } from "next-share";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <>
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>
      <main>{children}</main>
      <FacebookShareButton
        url={"https://the-healing-museum-makoto357.vercel.app"}
        quote={"next-share is a social share buttons for your next React apps."}
        hashtag={"#nextshare"}
      >
        <div>share on fb</div>{" "}
      </FacebookShareButton>
    </>
  );
}
