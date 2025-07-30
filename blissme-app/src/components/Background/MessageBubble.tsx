import React from 'react';
import './MessageBubble.css';

const MessageBubble = () => {
    return (
        <div className="bubble">
            <div className="ear left-ear"></div>
            <div className="ear right-ear"></div>
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="mouth"></div>
        </div>
    );
};

export default MessageBubble;
