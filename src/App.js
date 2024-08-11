import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import { spanSplitter } from './services/spanSplitter';
import TypingArea from './components/TypingArea';
import Statistics from './components/Statistics';
import { fetchAndParseJSON } from './services/fetchRequest';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function App() {
    const exampleTextRef = useRef(null);
    const [lengthText, setLengthText] = useState(0);
    const [inputCounter, setInputCounter] = useState(0);
    const [errorCounter, setErrorCounter] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [charStatus, setCharStatus] = useState([]);
    const [randomText, setRandomText] = useState("");
    const [timer, setTimer] = useState(0);
    const [isTiming, setIsTiming] = useState(false);
    const [inputData, setInputData] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState({});
    const [statistics, setStatistics] = useState(null);
    const [language, setLanguage] = useState('english');

    const handleChangeText = async () => {
        const data = await fetchAndParseJSON("https://raw.githubusercontent.com/lu4ik-dev/typing-speed-test-react/main/exampleText.json");
        if (data) {
            const text = getRandomItem(data[language]);
            setRandomText(text);
            setCharStatus(new Array(text.length).fill(null));
            setLengthText(text.length);
            setCurrentIndex(0);
            setInputCounter(0);
            setErrorCounter(0);
            setInputData([]);
            setTimer(0);
            setIsTiming(false);
            setShowChart(false);
            setStatistics(null);
        }
    };

    const handleKeyPress = (event) => {
        const key = event.key;

        if (key.length !== 1) return;

        if (!isTiming) setIsTiming(true);

        const currentTime = (timer / 1000).toFixed(2);
        const status = key === randomText[currentIndex] ? 'correct' : 'incorrect';

        setInputData((prevData) => [
            ...prevData,
            {
                char: key,
                status: status,
                time: currentTime,
                attempt: inputCounter + 1
            }
        ]);

        if (key === randomText[currentIndex]) {
            setInputCounter((prev) => prev + 1);
            if (key !== " ") {
                setCharStatus((prevStatus) => {
                    const newStatus = [...prevStatus];
                    newStatus[currentIndex] = 'correct';
                    return newStatus;
                });
            }
            setCurrentIndex((prevIndex) => prevIndex + 1);

            if (currentIndex + 1 === randomText.length) {
                setIsTiming(false);
                setShowChart(true);
                createChartData();
                calculateStatistics();
            }
        } else {
            setCharStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[currentIndex] = 'incorrect';
                return newStatus;
            });
            setErrorCounter((prev) => prev + 1);
        }

        spanSplitter(randomText, exampleTextRef.current, charStatus);
    };

    useEffect(() => {
        handleChangeText();
    }, [language]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [randomText, currentIndex]);

    useEffect(() => {
        if (randomText) {
            const exampleTextElement = exampleTextRef.current;
            if (exampleTextElement) {
              spanSplitter(randomText, exampleTextElement, charStatus);
                setLengthText(randomText.length);
            }
        }
    }, [randomText, charStatus]);

    useEffect(() => {
        let interval = null;
        if (isTiming) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 100);
            }, 100);
        } else if (!isTiming && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTiming, timer]);

    const createChartData = () => {
        const labels = inputData.map((data) => data.time);
        const successData = inputData
            .filter(data => data.status === 'correct')
            .map(data => parseFloat(data.time));

        const errorData = inputData
            .filter(data => data.status === 'incorrect')
            .map(data => parseFloat(data.time));

        const combinedData = inputData.map(data => ({
            time: parseFloat(data.time),
            status: data.status,
        }));

        const wpmData = combinedData.map((data, index) => {
            const wordsTyped = Math.floor((index + 1) / 5);
            const timeInMinutes = (data.time / 60);
            return wordsTyped / timeInMinutes;
        });

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Characters per minute (WPM)',
                    data: wpmData,
                    borderColor: 'rgba(75, 192, 192, 0.5)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1,
                },
                {
                    label: 'Errors',
                    data: errorData,
                    borderColor: 'rgba(255, 0, 0, 0.5)',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    fill: true,
                    tension: 0.1,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                },
            ],
        });
    };

    const calculateStatistics = () => {
        const words = randomText.split(' ').length;
        const correctAttempts = inputCounter;
        const totalAttempts = inputCounter + errorCounter;
        const timeInMinutes = timer / 60000;

        const wpm = timeInMinutes ? (correctAttempts / 5) / timeInMinutes : 0;
        const charactersPerMinute = (inputCounter + errorCounter) / (timeInMinutes || 1);
        const successRate = totalAttempts ? (correctAttempts / totalAttempts) * 100 : 0;
        const accuracy = totalAttempts ? (correctAttempts / lengthText) * 100 : 0;

        setStatistics({
            words,
            characters: inputCounter + errorCounter,
            errors: errorCounter,
            wpm: wpm.toFixed(2),
            successRate: successRate.toFixed(2),
            accuracy: accuracy.toFixed(2),
            charactersPerMinute: charactersPerMinute.toFixed(2),
        });
    };

    return (
        <div className="d-flex flex-column vh-100 bg-dark">
            <Header />
            <Navbar
                language={language}
                setLanguage={setLanguage}
                inputCounter={inputCounter}
                lengthText={lengthText}
                currentIndex={currentIndex}
                errorCounter={errorCounter}
                timer={timer}
                handleChangeText={handleChangeText}
            />
            <div className="container-fluid bg-dark flex-grow-1">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <TypingArea
                            randomText={randomText}
                            charStatus={charStatus}
                            exampleTextRef={exampleTextRef}
                            handleChangeText={handleChangeText}
                            showChart={showChart}
                            chartData={chartData}
                        />
                        {showChart && <Statistics statistics={statistics} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
