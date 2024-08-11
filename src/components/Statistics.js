import React from 'react';

const Statistics = ({ statistics }) => (
    <div className="col d-flex mt-2 justify-content-center">
        <div className="text-light border border-light rounded p-4">
            <h5>Statistics:</h5>
            <p>Number of words: {statistics?.words}</p>
            <p>Number of characters: {statistics?.characters}</p>
            <p>Number of errors: {statistics?.errors}</p>
            <p>Typing speed (WPM): {statistics?.wpm}</p>
            <p>Characters per minute: {statistics?.charactersPerMinute}</p>
            <p>Successful attempts: {statistics?.successRate}%</p>
            <p>Text matching: {statistics?.accuracy}%</p>
        </div>
    </div>
);

export default Statistics;
