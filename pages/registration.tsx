import styled from "@emotion/styled";

import React from "react";
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
  padding: 40px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
`;

const Heading = styled.h1`
  margin-bottom: 35px;
  font-size: 1.5rem;
`;

const Form = styled.form`
  width: 90vw;
  max-width: 450px;
  min-width: 320px;
`;

const FormControl = styled.input`
  padding: 15px;
  width: 100%;
  margin: 10px 0 20px;
  outline: none;
`;

const Button = styled.button`
  font-size: 1.25rem;
  padding: 15px;
  width: 100%;
  margin: 20px 0;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #2c2b2c;
  cursor: pointer;
  border-radius: 0px;
`;

const ReminderText = styled.div`
  cursor: pointer;
  text-align: center;
`;

export default function LoginPage() {
  const { login, signup, user } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(true);
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const notify = (message) =>
    toast(message, {
      icon: () => <img src={brandIcon.src} />,
    });
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      router.push("/theme-color");
    } catch (err) {
      notify(err.message);
    }
  };

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const sendData = async (uid) => {
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, {
      id: uid,
      name: signupData.username,
      email: signupData.email,
      last_changed: Timestamp.fromDate(new Date()),
      favoriteArtworksId: [],
      visitorJourney: [],
      favoritePostsId: [],
    });
    router.push("/theme-color");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(signupData.email, signupData.password);
      sendData(res.user.uid);
    } catch (err) {
      notify(err.message);
    }
  };

  return (
    <Wrapper>
      <ToastContainer
        position="top-center"
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
          <Form action="#" onSubmit={handleLogin}>
            <Heading>
              <strong>
                Welcome back! <br />
                Please log in to visit:
              </strong>
            </Heading>
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
              <label htmlFor="password">Password (at least 6 digits)</label>
              <FormControl
                type="password"
                name="password"
                autoComplete="on"
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
          <ReminderText onClick={() => setIsSignedUp(false)}>
            First time here? Please
            <strong> Sign up</strong>.
          </ReminderText>
        </>
      ) : (
        <>
          <Form action="#" onSubmit={handleSignup}>
            <Heading>
              <strong>
                Sign up to <br />
                collect and share artworks!
              </strong>
            </Heading>
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

            <ReminderText onClick={() => setIsSignedUp(true)}>
              Already been here before? Simply <strong>Login</strong>.
            </ReminderText>
          </Form>
        </>
      )}
      {user?.uid && (
        <SignpostButton href="/theme-color">
          Logged in already?
          <br />
          Directly enter the museum!
        </SignpostButton>
      )}
    </Wrapper>
  );
}
