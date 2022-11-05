import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ProfileContext";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import quiz from "../firestore-data/quiz.json";

export default function Quiz() {
  const router = useRouter();

  const [themeColor] = useContext(ThemeColorContext);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const subtractToIndex = 1;
  const toNextQuestion = 1;
  const [showAnswer, setShowAnswer] = useState(false);
  const [points, setPoints] = useState(0);
  const { user } = useAuth();

  // const testResult = [
  //   {
  //     lowestScore: 0,
  //     highestScore: 4,
  //     testResult: "",
  //     artworkImage: "",
  //     artistName: "Frida",
  //     artworkTitle: "",
  //     completionYear: "",
  //     artworkDescription: "",
  //   },
  // ];
  // gwen-john
  // vincent-van-gogh
  // gustav-klimt
  // frida-kahlo
  // edward-hopper
  // dorothea-tanning
  console.log("showAnswer", showAnswer, "points", points);

  const handleTestResult = async (artist) => {
    const saveToFavorites = (artist) => {
      return new Promise((resolve) => {
        const requestRef = doc(db, "users", user?.uid);
        updateDoc(requestRef, {
          "visitorJourney.recommededArtist": artist,
          "visitorJourney.quizPoints": points,
        });
      });
    };
    await saveToFavorites(artist);
    router.push("/collection-maps");
  };

  const handleQuizAnswers = (answerOption) => {
    if (currentQuestion == quiz.length) {
      setShowAnswer(true);
    }
    setCurrentQuestion(currentQuestion + toNextQuestion);
    setPoints(points + answerOption.points);
  };

  return (
    <>
      {!gameStarted && (
        <>
          <h1>take a test to see which artist you might like!</h1>
          <button
            onClick={() => {
              setGameStarted(true);
            }}
          >
            start
          </button>
        </>
      )}
      {gameStarted && !showAnswer && (
        <section>
          <h1>{quiz[currentQuestion - subtractToIndex].questionText}</h1>
          <div>
            {quiz[currentQuestion - subtractToIndex].answerOptions.map(
              (answerOption) => (
                <>
                  <img
                    style={{ width: "100px" }}
                    src={answerOption.answerImage}
                  />
                  <button onClick={() => handleQuizAnswers(answerOption)}>
                    {answerOption.answerText}
                  </button>
                </>
              )
            )}
          </div>
          <p>
            {currentQuestion}/{quiz.length}
          </p>
        </section>
      )}

      {showAnswer && points >= 0 && points <= 4 && (
        <>
          <div>you got {points} points, your artist is van gogh</div>
          <button
            onClick={() => {
              handleTestResult("vincent-van-gogh");
            }}
          >
            start explore the life stories of the artist!
          </button>
        </>
      )}
      {showAnswer && points >= 5 && points <= 8 && (
        <>
          <div>you got {points} points, your artist is klimt</div>
          <button
            onClick={() => {
              handleTestResult("gustav-klimt");
            }}
          >
            start explore the life stories of the artist!
          </button>
        </>
      )}
      {showAnswer && points >= 9 && points <= 12 && (
        <>
          <div>you got {points} points, your artist is frida</div>
          <button
            onClick={() => {
              handleTestResult("frida-kahlo");
            }}
          >
            start explore the life stories of the artist!
          </button>
        </>
      )}
      {showAnswer && points >= 13 && points <= 16 && (
        <>
          <div>you got {points} points, your artist is edward</div>
          <button
            onClick={() => {
              handleTestResult("edward-hopper");
            }}
          >
            start explore the life stories of the artist!
          </button>
        </>
      )}

      <div
        style={{ background: themeColor, height: "100px", width: "100px" }}
      ></div>
    </>
  );
}
