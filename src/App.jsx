import { useEffect, useState } from "react";
import { generate } from "random-words";
import Countdown from "react-countdown";
import "./App.css";

function App() {
  const [randomWords, setRandomWords] = useState([]);
  const [countdownSecond, setCountdownSecond] = useState(60000);
  const [isCounting, setIsCounting] = useState(false);
  const [resetWords, setResetWords] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWordList, setCorrectWordList] = useState([]);
  const [incorrectWordList, setInCorrectWordList] = useState([]);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [WPM, setWPM] = useState(null);
  const [correctWords, setCorrectWords] = useState(null);
  const [wrongWords, setWrongWords] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const renderer = ({ minutes, seconds }) => {
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return (
      <span>
        {minutes}:{formattedSeconds}
      </span>
    );
  };

  const handleResetCountDown = () => {
    setCountdownSecond(60000);
    setIsCounting(false);
    setCountdownStarted(false);
    setResetWords((prev) => !prev);
    setCurrentWordIndex(0);
    setInputValue("");
    const wpm = handleCalculateWPM();
    setWPM(wpm);
    setCorrectWords(correctWordList.length);
    setWrongWords(incorrectWordList.length);
    setCorrectWordList([]);
    setInCorrectWordList([]);
    setEndTime(null);
  };

  const handleStartCountDown = () => {
    if (!countdownStarted) {
      setCountdownStarted(true);
      setIsCounting(true);
      setEndTime(Date.now() + countdownSecond);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!countdownStarted) {
      handleStartCountDown();
    }

    if (value.trim() === randomWords[currentWordIndex]) {
      setCorrectWordList((prev) => [...prev, randomWords[currentWordIndex]]);
    }
    // else {
    //   setInCorrectWordList((e) => [...e, value]);
    // }
  };
  
  console.log("so tu sai :  s" + incorrectWordList);
  console.log("SO tu dung: " + correctWordList.length);

  const handleKeyDown = (e) => {
    if (e.key === " " && e.target.value.trim() !== "") {
      e.preventDefault();
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setInputValue("");
      const currentInput = e.target.value;
      if (currentInput !== randomWords[currentWordIndex]) {
        // console.log(currentInput);
        setInCorrectWordList((e) => [...e, currentInput]);
      }
    } else if (e.key === " " && e.target.value.trim() === "") {
      e.preventDefault();
    }
  };

  const handleCalculateWPM = () => {
    const WPM = correctWordList.length / 1;
    // console.log(WPM);
    return Math.round(WPM);
  };

  console.log(currentWordIndex);

  useEffect(() => {
    setRandomWords(generate(381));
  }, [resetWords]);

  return (
    <div className="fast-finger">
      <div className="sample">
        <div
          className="random"
          style={{ top: `-${Math.floor(currentWordIndex / 12) * 45}px` }}
        >
          {randomWords.map((word, index) => {
            const wordStyle =
              index < currentWordIndex
                ? correctWordList.includes(word)
                  ? { color: "green" }
                  : { color: "red" }
                : {};

            return (
              <span
                className="word"
                key={index}
                style={{
                  ...wordStyle,
                  backgroundColor:
                    index === currentWordIndex ? "rgb(212, 203, 203)" : "",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
      <div className="typing">
        <div className="input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              handleInputChange(e);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="countdown">
          {isCounting && endTime ? (
            <Countdown
              date={endTime}
              renderer={renderer}
              onComplete={() => {
                handleResetCountDown();
                setShowResult(true);
              }}
            />
          ) : (
            <span>1:00</span>
          )}
        </div>
        <div className="btn-controls">
          <button className="reset" onClick={handleResetCountDown}>
            Reset
          </button>
        </div>
      </div>
      <div className="point">
        {showResult ? (
          <>
            <h1>{WPM !== null ? WPM : "0"} WPM</h1>
            <h4>Correct words: {WPM !== null ? correctWords : ""}</h4>
            <h4>Wrong words: {WPM !== null ? wrongWords : ""}</h4>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
