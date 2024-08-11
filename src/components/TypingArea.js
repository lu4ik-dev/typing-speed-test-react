import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { spanSplitter } from '../services/spanSplitter';

const TypingArea = ({ randomText, charStatus, exampleTextRef, handleChangeText, showChart, chartData }) => {
    
    const inputRef = useRef(null);
    useEffect(() => {
        if (randomText) {
            spanSplitter(randomText, exampleTextRef.current, charStatus);
        }
    }, [randomText, charStatus, exampleTextRef]);

    const showKeyboard = () => {
        inputRef.current.focus(); // mobile
    };

    return (
        <div className="col-10 col-md-8 col-lg-6 mt-2 border border-light rounded p-4 text-light position-relative d-flex flex-column align-items-center">
            <div ref={exampleTextRef} className="mb-3 fs-3 d-flex flex-wrap"></div>
            <div className="d-block ">
                <button className="mx-1 btn btn-warning" onClick={handleChangeText}>Change text</button>
                <button className="mx-1 mt-2 btn btn-info d-block d-sm-none" onClick={showKeyboard}>
                    Show Keyboard
                </button>
                {/* Скрытый input элемент для фокусировки */}
                <input type="text" style={{ opacity: 0, position: 'absolute', top: '-1000px' }} ref={inputRef} />
            </div>
            {showChart && (
                <div className="mt-4 chart-container">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: { display: true, text: 'Time (seconds)' }
                                },
                                y: {
                                    title: { display: true, text: 'WPM' },
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TypingArea;
