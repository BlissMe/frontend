// Bubble.js
import React from 'react';
import './Bubble.css';

const Bubble = () => {
    return (
        <div className="bear-wrapper">
            <div className="bear">
                <div className="ear left-ear"></div>
                <div className="ear right-ear"></div>
                <div className="eye left"></div>
                <div className="eye right"></div>
                <div className="mouth"></div>
                <div className="body">
                    <div className="arm left-arm"></div>
                    <div className="arm right-arm"></div>
                    <div className="leg left-leg"></div>
                    <div className="leg right-leg"></div>
                </div>
            </div>
        </div>
    );
};

export default Bubble;
