import styled from "@emotion/styled";

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
const QuizArea = styled.section`
  width: 700px;
  margin: 0 auto;
  font-size: 1.5rem;
`;

const Question = styled.h1`
  margin-bottom: 20px;
  font-size: 2rem;
`;

const QuestionButton = styled.button`
  font-size: 1.5rem;
  width: 80%;

  margin-bottom: 30px;
  padding: 30px;
  background: white;
  &:hover {
    background: #2c2b2c;
    opacity: 0.5;
    border-left: 10px solid black;
    color: white;
  }
`;

const Button = styled.button`
  font-size: 22px;
  padding: 15px;
  width: 30%;
  margin-bottom: 10px;
  color: white;
  background-color: #2c2b2c;
  border: 1px solid #2c2b2c;
  cursor: pointer;
  border-radius: 30px;
`;

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
      {!gameStarted && (
        <QuizArea>
          <Question>
            <strong>Take a test to see which artist you might like!</strong>
          </Question>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
            explicabo nulla tenetur corporis eos nam recusandae esse temporibus
            assumenda, praesentium maiores natus hic ad quae quos optio in!
            Error numquam rerum expedita, esse ipsa id vitae eaque vel deleniti
            accusamus, sunt soluta quaerat iusto quam provident dolores
            consectetur earum rem!
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

      {showAnswer && points >= 0 && points <= 4 && (
        <QuizArea>
          <h1>you got {points} points, your artist is van gogh</h1>
          <Button
            onClick={() => {
              handleTestResult("vincent-van-gogh");
            }}
          >
            start explore the life stories of the artist!
          </Button>
          <Button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </Button>
        </QuizArea>
      )}
      {showAnswer && points >= 5 && points <= 8 && (
        <QuizArea>
          <h1>you got {points} points, your artist is klimt</h1>
          <Button
            onClick={() => {
              handleTestResult("gustav-klimt");
            }}
          >
            start explore the life stories of the artist!
          </Button>
          <Button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </Button>
        </QuizArea>
      )}
      {showAnswer && points >= 9 && points <= 12 && (
        <QuizArea>
          <h1>you got {points} points, your artist is frida</h1>
          <Button
            onClick={() => {
              handleTestResult("frida-kahlo");
            }}
          >
            start explore the life stories of the artist!
          </Button>
          <Button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </Button>
        </QuizArea>
      )}
      {showAnswer && points >= 13 && points <= 16 && (
        <QuizArea>
          <h1>you got {points} points, your artist is edward</h1>
          <Button
            onClick={() => {
              handleTestResult("edward-hopper");
            }}
          >
            start explore the life stories of the artist!
          </Button>
          <Button
            onClick={() => {
              setGameStarted(false);
              setPoints(0);
              setShowAnswer(false);
              setCurrentQuestion(1);
            }}
          >
            Play again
          </Button>
        </QuizArea>
      )}
    </>
  );
}
