import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import quiz from "../public/quiz.json";

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
    const getRecommendation = (artist) => {
      return new Promise((resolve) => {
        const requestRef = doc(db, "users", user?.uid);
        updateDoc(requestRef, {
          visitorJourney: arrayUnion({
            recommendedArtist: artist,
            quizDate: Timestamp.fromDate(new Date()),
            quizPoints: points,
          }),
        });
      });
    };
    getRecommendation(artist);
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
      <style jsx>
        {`
          section {
            width: 60vw;
            height: 500px;
            border-radius: 10px;
            margin: 200px auto;
            padding: 20px 50px;
            background: ${themeColor};
            color: white;
            display: flex;
            flex-direction: column;
          }
          h1 {
            text-align: center;

            margin: 20px 0;
          }
          p {
            margin-bottom: 20px;
          }
          img {
            height: 150px;
          }
        `}
      </style>
      {!gameStarted && (
        <section>
          <h1>
            <strong>Take a test to see which artist you might like!</strong>
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
            explicabo nulla tenetur corporis eos nam recusandae esse temporibus
            assumenda, praesentium maiores natus hic ad quae quos optio in!
            Error numquam rerum expedita, esse ipsa id vitae eaque vel deleniti
            accusamus, sunt soluta quaerat iusto quam provident dolores
            consectetur earum rem!
          </p>
          <button
            onClick={() => {
              setGameStarted(true);
            }}
          >
            start
          </button>
        </section>
      )}
      {gameStarted && !showAnswer && (
        <section>
          <h1>{quiz[currentQuestion - subtractToIndex]?.questionText}</h1>
          <div
            style={{
              height: "80%",

              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "space-between",
            }}
          >
            {quiz[currentQuestion - subtractToIndex]?.answerOptions.map(
              (answerOption, index) => (
                <div key={index}>
                  {/* <img src={answerOption.answerImage} /> */}
                  <button onClick={() => handleQuizAnswers(answerOption)}>
                    {answerOption.answerText}
                  </button>
                </div>
              )
            )}
          </div>
          <p style={{ textAlign: "left" }}>
            {currentQuestion}/{quiz.length}
          </p>
        </section>
      )}

      {showAnswer && points >= 0 && points <= 4 && (
        <section>
          <h1>you got {points} points, your artist is van gogh</h1>
          <button
            onClick={() => {
              handleTestResult("vincent-van-gogh");
            }}
          >
            start explore the life stories of the artist!
          </button>
          <button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </button>
        </section>
      )}
      {showAnswer && points >= 5 && points <= 8 && (
        <section>
          <h1>you got {points} points, your artist is klimt</h1>
          <button
            onClick={() => {
              handleTestResult("gustav-klimt");
            }}
          >
            start explore the life stories of the artist!
          </button>
          <button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </button>
        </section>
      )}
      {showAnswer && points >= 9 && points <= 12 && (
        <section>
          <h1>you got {points} points, your artist is frida</h1>
          <button
            onClick={() => {
              handleTestResult("frida-kahlo");
            }}
          >
            start explore the life stories of the artist!
          </button>
          <button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </button>
        </section>
      )}
      {showAnswer && points >= 13 && points <= 16 && (
        <section>
          <h1>you got {points} points, your artist is edward</h1>
          <button
            onClick={() => {
              handleTestResult("edward-hopper");
            }}
          >
            start explore the life stories of the artist!
          </button>
          <button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </button>
        </section>
      )}
    </>
  );
}
