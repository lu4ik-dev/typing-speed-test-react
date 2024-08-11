import React from 'react';

const Header = () => (
    <header className="p-2 bg-black text-white">
        <div className="container d-flex">
            <span className="my-auto fs-2 badge bg-warning text-dark">TST</span>
            <nav aria-label="breadcrumb" className="my-auto mx-auto">
                <ol className="breadcrumb my-auto">
                    <li className="breadcrumb-item text-warning fs-5" aria-current="page">Typing Speed Trainer - Test task</li>
                </ol>
            </nav>
        </div>
    </header>
);

export default Header;
