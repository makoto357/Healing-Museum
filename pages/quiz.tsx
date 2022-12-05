import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import quiz from "../public/artist-info/quiz.json";
import frida from "../asset/frida.jpg";
import dorothea from "../asset/Dorothea_Tanning.jpeg";
import klimt from "../asset/klimt_gustav.jpeg";
import vanGogh from "../asset/vangogh.jpeg";
import gwen from "../asset/gwen.jpeg";
import hopper from "../asset/edward-hopper.jpg";
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

  /* &:hover {
    background: #2c2b2c;
    opacity: 0.5;
    color: white;
  } */
  &:active {
    background: white;
    border-left: 10px solid black;
    color: black;
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

const HalfButton = styled.button`
  height: fit-content;
  font-size: 1.25rem;
  padding: 15px;
  width: 48%;
  color: white;
  background-color: #2c2b2c;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    margin-top: 20px;
    width: 100%;
  }
`;

const AudioOption = styled.div`
  text-align: center;
  width: 50px;
  margin: auto 20px auto 0px;
  padding: 15px;
  background: white;
  /* &:hover {
    background: #2c2b2c;
    opacity: 0.5;
    color: white;
  } */
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
export default function Quiz() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const subtractToIndex = 1;
  const toNextQuestion = 1;
  const [seletedOption, setSeletedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [points, setPoints] = useState([]);
  const { user } = useAuth();
  // const [audios, setAudios] = useState([]);
  // const audioInput = useRef(null);

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
  // useEffect(() => {
  //   const storage = getStorage();
  //   const listRef = ref(storage, "quiz-sound-files");
  //   const paths = [];
  //   listAll(listRef)
  //     .then((res) => {
  //       res.items.forEach((itemRef) => {
  //         paths.push(itemRef.fullPath);
  //       });
  //       getUrls(paths);
  //     })
  //     .catch((error) => {});
  //   const getUrls = async (paths) => {
  //     const audioUrls = [];
  //     paths.map((path) => {
  //       getDownloadURL(ref(storage, path))
  //         .then((url) => {
  //           audioUrls.push(url);
  //           setAudios(audioUrls);
  //         })
  //         .catch((error) => {});
  //     });
  //   };
  // }, []);
  return (
    <div>
      {!gameStarted && (
        <QuizArea>
          <Question>
            <strong>Take a test to see which artist you might like!</strong>
          </Question>
          <ul>
            <li style={{ marginBottom: "10px" }}>
              Welcome! How are you feeling?
            </li>
            <li style={{ marginBottom: "10px" }}>
              Artist Georges Braque once said{" "}
              <strong>“Art is a wound turned into light.”</strong> It is in
              today&apos;s busy modern world, we could be greatly benefited from
              looking and feeling arts and its healing properties.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>
                Take this quiz to reflect on your present well-being and find
                out which artist has viewpoints and attitudes towards life
                resembling your own.
              </strong>{" "}
              You’ll be asked to imagine yourself in different situations.
            </li>

            <li style={{ marginBottom: "10px" }}>
              This is not a diagnostic tool. If you are seeking therapeutic
              treatments or wish to talk with someone about your mental health,
              seek advice from a local therapist.
            </li>
          </ul>
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
                <>
                  {answerOption.audio ? (
                    <>
                      <div
                        style={{
                          marginBottom: "20px",
                          display: "flex",
                        }}
                      >
                        <AudioOption
                          onClick={() => handleQuizAnswers(answerOption)}
                        >
                          {index + 1}
                        </AudioOption>
                        <audio
                          style={{ margin: "auto 0" }}
                          src={answerOption.audio}
                          controls
                        />
                      </div>

                      {/* <button onClick={() => audioInput.current.play()}>
                        play
                      </button>
                      <button onClick={() => audioInput.current.pause()}>
                        pause
                      </button> */}
                    </>
                  ) : (
                    <QuestionButton
                      onMouseEnter={() => setSeletedOption(index)}
                      onMouseLeave={() => setSeletedOption(null)}
                      $bgColor={"white"}
                      // seletedOption ? "white" : "#2c2b2c"
                      $opacity={"1"}
                      // seletedOption ? "1" : "0.5"
                      $color={""}
                      // seletedOption ? "black" : "white"
                      key={index}
                      onClick={() => handleQuizAnswers(answerOption)}
                    >
                      {/* <img src={answerOption.answerImage} /> */}
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

      {showAnswer && sortable[0][0] === quizResults[0].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[0].artistImage} />
          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[0].artistName}.</strong>
            </h1>
            <p>{quizResults[0].artistIntro}</p>
          </div>
          <ButtonGroup>
            {/* <HalfButton
              onClick={() => {
                setGameStarted(false);
                setPoints([]);
                setShowAnswer(false);
                setCurrentQuestion(1);
              }}
            >
              Play again
            </HalfButton> */}
            <Button
              onClick={() => {
                handleTestResult(quizResults[0].artistUrl);
              }}
            >
              Learn about this artist!
            </Button>
          </ButtonGroup>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[1].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[1].artistImage} />

          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[1].artistName}.</strong>
            </h1>
            <p>{quizResults[1].artistIntro}</p>
          </div>
          <ButtonGroup>
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
            <HalfButton
              onClick={() => {
                handleTestResult(quizResults[1].artistUrl);
              }}
            >
              Learn about this artist!
            </HalfButton>
          </ButtonGroup>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[2].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[2].artistImage} />

          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[2].artistName}.</strong>
            </h1>
            <p>{quizResults[2].artistIntro}</p>
          </div>
          <ButtonGroup>
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
            <HalfButton
              onClick={() => {
                handleTestResult(quizResults[2].artistUrl);
              }}
            >
              Learn about this artist!
            </HalfButton>
          </ButtonGroup>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[3].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[3].artistImage} />

          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[3].artistName}.</strong>
            </h1>
            <p>{quizResults[3].artistIntro}</p>
          </div>
          <ButtonGroup>
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
            <HalfButton
              onClick={() => {
                handleTestResult(quizResults[3].artistUrl);
              }}
            >
              Learn about this artist!
            </HalfButton>
          </ButtonGroup>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[4].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[4].artistImage} />

          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[4].artistName}.</strong>
            </h1>
            <p>{quizResults[4].artistIntro}</p>
          </div>
          <ButtonGroup>
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
            <HalfButton
              onClick={() => {
                handleTestResult(quizResults[4].artistUrl);
              }}
            >
              Learn about this artist!
            </HalfButton>
          </ButtonGroup>
        </QuizArea>
      )}
      {showAnswer && sortable[0][0] === quizResults[5].result && (
        <QuizArea>
          <ArtistImage $imageUrl={quizResults[5].artistImage} />
          <div style={{ margin: "20px 0" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
              Your artist is <strong>{quizResults[5].artistName}.</strong>
            </h1>
            <p>{quizResults[5].artistIntro}</p>
          </div>
          <ButtonGroup>
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
            <HalfButton
              onClick={() => {
                handleTestResult(quizResults[5].artistUrl);
              }}
            >
              Learn about this artist!
            </HalfButton>
          </ButtonGroup>
        </QuizArea>
      )}
    </div>
  );
}
