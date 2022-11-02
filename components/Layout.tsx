import Link from "next/link";

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
    </>
  );
}
