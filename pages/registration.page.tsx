import styled from "@emotion/styled";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
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
  max-width: 90vw;
  width: 450px;
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
  margin-bottom: 40px;
`;

export default function LoginPage() {
  const { login, signup, user } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(true);
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "kim@gmail.com",
    password: "helloworld321",
  });
  const notify = (message: string) =>
    toast(message, {
      hideProgressBar: false,
      autoClose: 3000,
      icon: () => (
        <Image alt="brand" width={30} height={30} src={brandIcon.src} />
      ),
    });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      router.push("/theme-color");
    } catch (err) {
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      notify(message);
    }
  };

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const sendData = async (uid: string) => {
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, {
      id: uid,
      name: signupData.username,
      email: signupData.email,
      last_changed: Timestamp.fromDate(new Date()),
      favoriteArtworksId: [],
      visitorJourney: [],
      favoritePostsId: [],
      drawings: [],
    });
    router.push("/theme-color");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(signupData.email, signupData.password);
      sendData(res.user.uid);
    } catch (err) {
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      notify(message);
    }
  };

  return (
    <Wrapper>
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
                onChange={(e) =>
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
                onChange={(e) =>
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
                onChange={(e) =>
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
