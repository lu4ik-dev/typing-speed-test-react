import React from 'react';

const Navbar = ({ language, setLanguage, inputCounter, lengthText, currentIndex, errorCounter, timer, handleChangeText }) => (
    <div className="navbar navbar-expand navbar-dark bg-dark border border-light rounded py-3 fs- my-3">
        <div className="container-fluid justify-content-center">
            <div className="collapse navbar-collapse justify-content-center">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <span className="nav-link" data-bs-toggle="tooltip" data-bs-placement="top" title="All symbols">All: {inputCounter}/{lengthText}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" data-bs-toggle="tooltip" data-bs-placement="top" title="Current index">Current index: {currentIndex}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" data-bs-toggle="tooltip" data-bs-placement="top" title="Mistakes">Error: {errorCounter}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" data-bs-toggle="tooltip" data-bs-placement="top" title="Timer">Timer: {(timer / 1000).toFixed(2)} sec</span>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link">
                            <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language selection">
                                <option value="english">English</option>
                                <option value="russian">Russian</option>
                                <option value="spanish">Spanish</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default Navbar;
