import Link from "next/link";
import styled from "@emotion/styled";
import React from "react";
const Wrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 60px;
    margin: 0 auto;
    margin-right: 90px;
  }

  ul li {
    list-style: none;
    cursor: pointer;
  }

  .the-arrow {
    width: 1px;
    transition: all 0.2s;
  }
  .the-arrow.-left {
    position: absolute;
    top: 60%;
    left: 0;
  }
  .the-arrow.-left > .shaft {
    width: 0;
    background-color: #808080;
  }
  .the-arrow.-left > .shaft:before,
  .the-arrow.-left > .shaft:after {
    width: 0;
    background-color: #808080;
  }
  .the-arrow.-left > .shaft:before {
    transform: rotate(0);
  }
  .the-arrow.-left > .shaft:after {
    transform: rotate(0);
  }
  .the-arrow.-right {
    top: 3px;
  }
  .the-arrow.-right > .shaft {
    width: 1px;
    transition-delay: 0.2s;
  }
  .the-arrow.-right > .shaft:before,
  .the-arrow.-right > .shaft:after {
    width: 8px;
    transition-delay: 0.3s;
    transition: all 0.5s;
  }
  .the-arrow.-right > .shaft:before {
    transform: rotate(40deg);
  }
  .the-arrow.-right > .shaft:after {
    transform: rotate(-40deg);
  }
  .the-arrow > .shaft {
    background-color: #808080;
    display: block;
    height: 1px;
    position: relative;
    transition: all 0.2s;
    transition-delay: 0;
    will-change: transform;
  }
  .the-arrow > .shaft:before,
  .the-arrow > .shaft:after {
    background-color: #808080;
    content: "";
    display: block;
    height: 1px;
    position: absolute;
    top: 0;
    right: 0;
    transition: all 0.2s;
    transition-delay: 0;
  }
  .the-arrow > .shaft:before {
    transform-origin: top right;
  }
  .the-arrow > .shaft:after {
    transform-origin: bottom right;
  }

  .animated-arrow {
    display: inline-block;
    color: #4e3c3c;
    font-size: 1.25em;
    font-weight: 900;
    text-decoration: none;
    position: relative;
    transition: all 0.2s;
  }
  .animated-arrow:hover {
    color: black;
    font-weight: 900;
  }
  .animated-arrow:hover > .the-arrow.-left > .shaft {
    width: 64px;
    transition-delay: 0.1s;
    background-color: black;
  }
  .animated-arrow:hover > .the-arrow.-left > .shaft:before,
  .animated-arrow:hover > .the-arrow.-left > .shaft:after {
    width: 8px;
    transition-delay: 0.1s;
    background-color: black;
  }
  .animated-arrow:hover > .the-arrow.-left > .shaft:before {
    transform: rotate(40deg);
  }
  .animated-arrow:hover > .the-arrow.-left > .shaft:after {
    transform: rotate(-40deg);
  }
  .animated-arrow:hover > .main {
    transform: translateX(17px);
    transform: translateX(80px);
  }
  .animated-arrow:hover > .main > .the-arrow.-right > .shaft {
    width: 0;
    transform: translateX(200%);
    transition-delay: 0;
  }
  .animated-arrow:hover > .main > .the-arrow.-right > .shaft:before,
  .animated-arrow:hover > .main > .the-arrow.-right > .shaft:after {
    width: 0;
    transition-delay: 0;
    transition: all 0.1s;
  }
  .animated-arrow:hover > .main > .the-arrow.-right > .shaft:before {
    transform: rotate(0);
  }
  .animated-arrow:hover > .main > .the-arrow.-right > .shaft:after {
    transform: rotate(0);
  }
  .animated-arrow > .main {
    display: flex;
    align-items: center;
    transition: all 0.2s;
  }
  .animated-arrow > .main > .text {
    margin: 0 16px 0 0;
    line-height: 1;
  }
  .animated-arrow > .main > .the-arrow {
    position: relative;
  }
`;

export default function SignpostButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}
