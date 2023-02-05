import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import quiz from "../public/artist-info/quiz.json";
import frida from "../asset/images/frida.webp";
import dorothea from "../asset/images/Dorothea_Tanning.webp";
import klimt from "../asset/images/klimt_gustav.webp";
import vanGogh from "../asset/images/vangogh.webp";
import gwen from "../asset/images/gwen.webp";
import hopper from "../asset/images/edward-hopper.webp";
const QuizArea = styled.section`
  max-width: 600px;
  width: 40vw;
  margin: 0 auto;
  padding: 40px 0 0;

  @media screen and (max-width: 800px) {
    width: 80vw;
  }
`;

const Question = styled.h1`
  margin-bottom: 35px;
  width: 100%;
  height: 60px;
  font-size: 1.25rem;
`;

const QuestionButton = styled.div<{
  $bgColor: string;
  $opacity: string;
  $color: string;
}>`
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
  padding: 15px;
  background: ${(props) => props.$bgColor};
  opacity: ${(props) => props.$opacity};
  color: ${(props) => props.$color};

  &:active {
    background: white;
    border-left: 10px solid black;
    color: black;
  }
`;

const TestResult = styled.div`
  margin: 20px 0;
  hi {
    margin-bottom: 10px;
    font-size: 1.25rem;
  }
`;

const AudioPlayer = styled.div`
  margin-bottom: 20px;
  display: flex;
  audio {
    margin: auto 0;
  }
`;
const Button = styled.button`
  font-size: 1.25rem;
  padding: 15px;
  margin: 20px auto;
  width: 100%;
  color: white;
  background-color: #2c2b2c;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  column-gap: 20px;
  justify-content: space-between;
  margin: 20px auto 0;
  padding-bottom: 20px;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const AudioOption = styled.div`
  text-align: center;
  width: 50px;
  margin: auto 20px auto 0px;
  padding: 15px;
  background: white;
  &:active {
    background: white;
    border-left: 10px solid black;
    color: black;
  }
`;

const ArtistImage = styled.div<{ $imageUrl: string }>`
  background-image: url(${(props) => props.$imageUrl});
  width: 300px;
  height: 300px;
  max-width: 100%;
  background-size: cover;
  margin: 0 auto;
`;
const IntroText = styled.ul`
  list-style: none;
  li {
    margin-bottom: 10px;
  }
`;
type quizResult = {
  result: string;
  artistName: string;
  artistUrl: string;
  artistIntro: string;
  artistImage: string;
};
type answerOption = {
  audio?: string;
  answerText?: string;
  points?: string[];
};
export default function Quiz() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [points, setPoints] = useState<string[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    router.prefetch("/collection-maps");
  }, [router]);
  function getResult() {
    const count: any = {};

    points.map((point) => {
      if (count[point]) {
        count[point] += 1;
      } else {
        count[point] = 1;
      }
    });

    let sortable: [string, number][] = [];
    for (let artist in count) {
      sortable.push([artist, count[artist]]);
    }
    sortable.sort(function (a: [string, number], b: [string, number]) {
      return b[1] - a[1];
    });
    return sortable[0][0];
  }

  const quizResults = [
    {
      result: "F",
      artistName: "Frida Kahlo",
      artistUrl: "frida-kahlo",
      artistIntro:
        "Frida Kahlo has become an icon because of her unique personality and her multifaceted life. She has become a standard-bearer for women's inner strength, for a love of Mexico and its culture, and for courage in the face of adversity.",
      artistImage: frida.src,
    },
    {
      result: "D",
      artistName: "Dorothea Tanning",
      artistUrl: "dorothea-tanning",
      artistIntro:
        "Tanning's paintings are often direct illustrations of her dreams. She aimed to make complex psychology visible - revealing a particular interest in the unconscious of one individual experienced through a single dream.",
      artistImage: dorothea.src,
    },
    {
      result: "K",
      artistName: "Gustav Klimt",
      artistUrl: "gustav-klimt",
      artistIntro:
        "Klimt embedded allusions to sexuality and the human psyche in the rich, lavishly decorated figures and patterns. Often, their messages—of pleasure, sexual liberation, and human suffering—were only thinly veiled.",
      artistImage: klimt.src,
    },
    {
      result: "E",
      artistName: "Edward Hopper",
      artistUrl: "edward-hopper",
      artistIntro:
        "Hopper's realistic depictions of everyday urban scenes shock the viewer into recognition of the strangeness of familiar surroundings. His 'Nighthawks' is often read as an exploration of human existentialism and loneliness in the modern age. ",
      artistImage: hopper.src,
    },
    {
      result: "V",
      artistName: "Vincent van Gogh",
      artistUrl: "vincent-van-gogh",
      artistIntro:
        "Van Gogh is the mirror that reflects the face of the universe, and he is credited for portraying unique representations through his art. Not only did he display what was in front of him, but he also brought out a sense of feeling and connectivity through his paintings.",
      artistImage: vanGogh.src,
    },
    {
      result: "G",
      artistName: "Gwen John",
      artistUrl: "gwen-john",
      artistIntro:
        "Gwen John is a Welsh painter who was known for her self-portraits, quiet domestic interiors, and portraits of other women. The subjects of her works are by turns reserved, serene and troubling, with their inner life shown most keenly in its confinement.",
      artistImage: gwen.src,
    },
  ];
  const handleTestResult = (artist: string) => {
    const getRecommendation = async (artist: string) => {
      const requestRef = doc(
        db,
        "users",
        user?.uid !== undefined ? user?.uid : ""
      );
      await updateDoc(requestRef, {
        visitorJourney: arrayUnion({
          recommendedArtist: artist,
          quizDate: Timestamp.fromDate(new Date()),
          quizPoints: points,
        }),
      });
    };
    getRecommendation(artist);
    router.push("/collection-maps");
  };

  const handleQuizAnswers = (answerOption: answerOption) => {
    if (currentQuestion == quiz.length) {
      setShowAnswer(true);
    }
    setCurrentQuestion(currentQuestion + 1);
    setPoints(
      points.concat(
        answerOption.points !== undefined ? answerOption.points : []
      )
    );
  };

  const renderQuestions = (quizResults: quizResult) => {
    return (
      <QuizArea>
        <ArtistImage $imageUrl={quizResults.artistImage} />

        <TestResult>
          <h1>
            Your artist is <strong>{quizResults.artistName}.</strong>
          </h1>
          <p>{quizResults.artistIntro}</p>
        </TestResult>
        <ButtonGroup>
          <Button
            onClick={() => {
              handleTestResult(quizResults.artistUrl);
            }}
          >
            Learn about this artist!
          </Button>
        </ButtonGroup>
      </QuizArea>
    );
  };

  const renderQuizArea = () => {
    return (
      <QuizArea>
        <Question>
          <strong>Take a test to see which artist you might like!</strong>
        </Question>

        <IntroText>
          <li>Welcome! How are you feeling?</li>
          <li>
            Artist Georges Braque once said&nbsp;
            <strong>“Art is a wound turned into light.”</strong> It is in
            today&apos;s busy modern world, we could be greatly benefited from
            looking and feeling arts and its healing properties.
          </li>
          <li>
            <strong>
              Take this quiz to reflect on your present well-being and find out
              which artist has viewpoints and attitudes towards life resembling
              your own.
            </strong>
            &nbsp; You’ll be asked to imagine yourself in different situations.
          </li>

          <li>
            This is not a diagnostic tool. If you are seeking therapeutic
            treatments or wish to talk with someone about your mental health,
            seek advice from a local therapist.
          </li>
        </IntroText>
        <Button
          onClick={() => {
            setGameStarted(true);
          }}
        >
          Start
        </Button>
      </QuizArea>
    );
  };
  return (
    <div>
      {!gameStarted && renderQuizArea()}
      {gameStarted && !showAnswer && (
        <QuizArea>
          <Question>{quiz[currentQuestion - 1]?.questionText}</Question>
          <div>
            {quiz[currentQuestion - 1]?.answerOptions.map(
              (answerOption: answerOption, index) => (
                <>
                  {answerOption.audio ? (
                    <AudioPlayer>
                      <AudioOption
                        onClick={() => {
                          handleQuizAnswers(answerOption);
                        }}
                      >
                        {index + 1}
                      </AudioOption>
                      <audio src={answerOption.audio} controls />
                    </AudioPlayer>
                  ) : (
                    <QuestionButton
                      $bgColor={"white"}
                      $opacity={"1"}
                      $color={""}
                      key={answerOption.answerText}
                      onClick={() => handleQuizAnswers(answerOption)}
                    >
                      <p>
                        <strong>{answerOption.answerText}</strong>
                      </p>
                    </QuestionButton>
                  )}
                </>
              )
            )}
          </div>
          <p>
            {currentQuestion}/{quiz.length}
          </p>
        </QuizArea>
      )}

      {showAnswer &&
        quizResults.filter((quizResult) => quizResult.result == getResult()) &&
        renderQuestions(
          quizResults.filter(
            (quizResult) => quizResult.result == getResult()
          )[0]
        )}
    </div>
  );
}
