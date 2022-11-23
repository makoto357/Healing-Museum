import styled from "@emotion/styled";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import brandIcon from "../asset/healing-museum-website-icon.png";
import SignpostButton from "../components/Button";

const Wrapper = styled.div`
  margin: auto;
  padding: 104px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  height: 100vh;
`;

const Heading = styled.h1`
  width: 100%;
  max-width: 458px;
  margin-bottom: 35px;
  font-size: 1.5rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 458px;
`;

const FormControl = styled.input`
  padding: 15px;
  width: 100%;
  margin: 10px 0 20px;
`;

const FormSplit = styled.div`
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  max-width: 458px;
`;

const Split = styled.div`
  width: 45%;
  border-bottom: 1px solid #313538;
  margin-bottom: 15px;
`;

const SplitText = styled.div`
  margin-top: 10px 10px 0px;
  padding: 10px;
`;

const Signup = styled.div`
  display: flex;
  width: 100%;
  max-width: 458px;
  justify-content: flex-end;
`;

const MemberSignup = styled.div`
  border-bottom: 1px solid;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 15px;
  width: 100%;
  margin: 20px 0;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #2c2b2c;
  cursor: pointer;
  border-radius: 0px;
`;

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(true);
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginData);
    try {
      await login(loginData.email, loginData.password);
      // router.push("/theme-color");
    } catch (err) {
      toast(
        "We couldn't find your email or password...Do you mind try again?",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          icon: ({ theme, type }) => <img src={brandIcon.src} />,
        }
      );

      console.log(err);
    }
  };

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const sendData = async (uid) => {
    try {
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        id: uid,
        name: signupData.username,
        email: signupData.email,
        last_changed: Timestamp.fromDate(new Date()),
      });
      toast("Successful registration!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: ({ theme, type }) => <img src={brandIcon.src} />,
      });
      // router.push("/theme-color");
    } catch (error) {
      console.log(error);
      toast(
        "An error occcurred, please check your email and password again, thank you!",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          icon: ({ theme, type }) => <img src={brandIcon.src} />,
        }
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(signupData.email, signupData.password);
      sendData(res.user.uid);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <ToastContainer
        position="top-center"
        // autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isSignedUp ? (
        <>
          <Heading>
            <strong>
              Welcome back! <br />
              Please log in to visit:
            </strong>
          </Heading>
          <Form action="#" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <FormControl
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
                value={loginData.email}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <FormControl
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                value={loginData.password}
              />
            </div>

            <Button type="submit">Login</Button>
          </Form>
          <div>
            <p>
              First time here? Please{" "}
              <button onClick={() => setIsSignedUp(false)}>
                <strong>Sign up</strong>
              </button>{" "}
              this way.
            </p>
          </div>
        </>
      ) : (
        <>
          <Heading>
            <strong>
              Sign up to <br />
              collect and share artworks!
            </strong>
          </Heading>
          <Form action="#" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email">Name</label>
              <FormControl
                type="text"
                name="username"
                id="username"
                placeholder="Please enter your name"
                required
                onChange={(e: any) =>
                  setSignupData({
                    ...signupData,
                    username: e.target.value,
                  })
                }
                value={signupData.username}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <FormControl
                type="email"
                name="email"
                id="email"
                placeholder="name@mail.com"
                required
                onChange={(e: any) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value,
                  })
                }
                value={signupData.email}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <FormControl
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                onChange={(e: any) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
                value={signupData.password}
              />
            </div>
            <Button type="submit">Create an account</Button>
          </Form>
          <div>
            <p>
              Already been here before? Simply{" "}
              <button onClick={() => setIsSignedUp(true)}>
                <strong>Login</strong>
              </button>
              .
            </p>
          </div>
        </>
      )}
      <SignpostButton href="/theme-color">Enter the museum</SignpostButton>
    </Wrapper>
  );
}
