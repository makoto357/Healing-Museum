import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

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
    <>
      {isSignedUp ? (
        <section style={{ marginBottom: "5px" }}>
          <div>
            <div>
              <div>
                <h1>
                  Welcome back! <br />
                  Please log in to visit:
                </h1>
                <form action="#" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email">Your email</label>
                    <input
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
                    <input
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

                  <button
                    type="submit"
                    style={{ border: "1px solid black", padding: "5px 10px" }}
                  >
                    Log in
                  </button>
                </form>
                <div style={{ display: "flex" }}>
                  <p>
                    First time here? Please{" "}
                    <button onClick={() => setIsSignedUp(false)}>
                      Sign up
                    </button>{" "}
                    this way
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div>
            <div>
              <div>
                <h1>
                  First Time Here?
                  <br />
                  Sign up to Share and Collect Artworks!
                </h1>
                <form action="#" onSubmit={handleSignup}>
                  <div>
                    <label htmlFor="email">Your name</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="user name"
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
                    <label htmlFor="email">Your email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="name@company.com"
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
                    <input
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
                  <button
                    type="submit"
                    style={{ border: "1px solid black", padding: "5px 10px" }}
                  >
                    Create an account
                  </button>
                </form>
                <div style={{ display: "flex" }}>
                  <p>
                    Already been here before? Simply
                    <button onClick={() => setIsSignedUp(true)}>
                      Log in
                    </button>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <h1>
        <strong>OR</strong>
      </h1>

      <Link href="/theme-color">Directly Enter the Museum </Link>
    </>
  );
}
