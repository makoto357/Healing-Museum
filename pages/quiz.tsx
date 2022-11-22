import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import { Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import quiz from "../public/quiz.json";
const QuizArea = styled.section`
  width: 80vw;
  margin: 0 auto;
  padding: 104px 0 0;
`;

const Question = styled.h1`
  margin-bottom: 35px;
  width: 100%;
  font-size: 1.5rem;
`;

const QuestionButton = styled.button`
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  &:hover {
    background: #2c2b2c;
    opacity: 0.5;
    color: white;
  }
  &:active {
    background: white;
    border-left: 10px solid black;
    color: black;
  }
`;

const Button = styled.button`
  font-size: 1.5rem;
  padding: 15px;
  margin: 20px auto 0;
  width: 100%;
  color: white;
  background-color: #2c2b2c;
  cursor: pointer;
`;

const HalfButton = styled.button`
  font-size: 1.5rem;
  padding: 15px;
  margin: 20px auto 0;
  margin-right: 10px;
  width: 45%;
  color: white;
  background-color: #2c2b2c;
  cursor: pointer;
`;

export default function Quiz() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const subtractToIndex = 1;
  const toNextQuestion = 1;
  const [showAnswer, setShowAnswer] = useState(false);
  const [points, setPoints] = useState([]);
  const { user } = useAuth();
  console.log("showAnswer", showAnswer, "points", points.sort());

  const count = {};

  points.map((point) => {
    if (count[point]) {
      count[point] += 1;
    } else {
      count[point] = 1;
    }
  });

  let sortable = [];
  for (var vehicle in count) {
    sortable.push([vehicle, count[vehicle]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  console.log(sortable);

  const quizResults = [
    {
      result: "F",
      artistName: "Frida Kahlo",
      artistUrl: "frida-kahlo",
      artistIntro: "frida is an....",
    },
    {
      result: "D",
      artistName: "Dorothea Tanning",
      artistUrl: "dorothea-tanning",
      artistIntro: "Tanning is an....",
    },
    {
      result: "K",
      artistName: "Gustav Klimt",
      artistUrl: "gustav-klimt",
      artistIntro: "Klimt is an....",
    },
    {
      result: "E",
      artistName: "Edward Hopper",
      artistUrl: "edward-hopper",
      artistIntro: "Hopper is an....",
    },
    {
      result: "V",
      artistName: "Vincent van Gogh",
      artistUrl: "vincent-van-gogh",
      artistIntro: "Vincent is an....",
    },

    {
      result: "G",
      artistName: "Gwen John",
      artistUrl: "gwen-john",
      artistIntro: "John is an....",
    },
  ];
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
    setPoints(points.concat(answerOption.points));
  };

  // result = getResult(sortable)
  // <QuizReult result={result} />

  return (
    <div style={{ height: "100vh" }}>
      {!gameStarted && (
        <QuizArea>
          <Question>
            <strong>Take a test to see which artist you might like!</strong>
          </Question>
          <p>
            Welcome! How are you feeling?
            <br />
            Take this quiz to reflect on your present well-being and find out
            which artist in the healing museum has viewpoints and attitudes
            towards life resembling your own. You’ll be asked to imagine
            yourself in different situations.
            <br />
            Artist Georges Braque once said “Art is a wound turned into light”.
            It is in today&apos;s busy modern world, we could be greatly
            benefited from looking and feeling arts and its healing properties.
            <br />
            This is not a diagnostic tool. If you are seeking therapeutic
            treatments or wish to talk with someone about your mental health,
            seek advice from a local therapist.
          </p>
          <Button
            onClick={() => {
              setGameStarted(true);
            }}
          >
            Start
          </Button>
        </QuizArea>
      )}
      {gameStarted && !showAnswer && (
        <QuizArea>
          <Question>
            {quiz[currentQuestion - subtractToIndex]?.questionText}
          </Question>
          <div>
            {quiz[currentQuestion - subtractToIndex]?.answerOptions.map(
              (answerOption, index) => (
                <QuestionButton
                  key={index}
                  onClick={() => handleQuizAnswers(answerOption)}
                >
                  {/* <img src={answerOption.answerImage} /> */}
                  <p>
                    <strong>{answerOption.answerText}</strong>
                  </p>
                </QuestionButton>
              )
            )}
          </div>
          <p>
            {currentQuestion}/{quiz.length}
          </p>
        </QuizArea>
      )}

      {showAnswer && sortable[0][0] === quizResults[0].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[0].artistName}</h1>
          <p>{quizResults[0].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[0].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[1].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[1].artistName}</h1>
          <p>{quizResults[1].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[1].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[2].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[2].artistName}</h1>
          <p>{quizResults[2].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[2].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[3].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[3].artistName}</h1>
          <p>{quizResults[3].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[3].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[4].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[4].artistName}</h1>
          <p>{quizResults[4].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[4].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[5].result && (
        <QuizArea>
          <h1>Your artist is {quizResults[5].artistName}</h1>
          <p>{quizResults[5].artistIntro}</p>
          <HalfButton
            onClick={() => {
              handleTestResult(quizResults[5].artistUrl);
            }}
          >
            Learn about this artist!
          </HalfButton>
          <HalfButton
            onClick={() => {
              setGameStarted(false);
              setPoints([]);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </HalfButton>
        </QuizArea>
      )}
    </div>
  );
}
