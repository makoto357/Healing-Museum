import styled from "@emotion/styled";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

const Wrapper = styled.div`
  margin: auto;
  padding: 40px 56px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
`;

const Heading = styled.h1`
  width: 100%;
  max-width: 458px;
  margin-bottom: 30px;
  font-size: 22px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 458px;
`;

const FormControl = styled.input`
  padding: 15px;
  width: 100%;
  margin: 5px 0 15px;
  border-radius: 5px;
`;
// border: solid 1px ${({ invalid }) => (invalid ? "#CB4042" : "#979797")};

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
  border-radius: 30px;
`;

const FBbutton = styled.button`
  padding: 15px;
  width: 100%;
  margin-bottom: 15px;
  color: #3b5998;
  border: 1px solid #3b5998;
  cursor: pointer;
  background-color: white;
  max-width: 458px;
  border-radius: 30px;
  &:hover {
    transition: all 0.3s ease;
    background-color: #3b5998;
    color: white;
  }
`;

export default function LoginPage() {
  const { user, login, signup } = useAuth();
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
      router.push("/theme-color");
    } catch (err) {
      alert(err);
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
      alert("Successful registration!");
      router.push("/theme-color");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(signupData.email, signupData.password);
      sendData(res.user.uid);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  return (
    <Wrapper>
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
      <h1>
        <strong>OR</strong>
      </h1>
      <Link href="/theme-color">Directly enter the museum!</Link>
    </Wrapper>
  );
}
