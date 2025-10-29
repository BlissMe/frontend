import React, { useState, useRef } from 'react';
import bg from '../../assets/images/body-scan-bg.png';

const BodyScan: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const audioFile = process.env.PUBLIC_URL + '/sounds/bodyscan.mp3';

    const handleStartSession = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleStopSession = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // reset to beginning
            setIsPlaying(false);
        }
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center flex flex-col text-white relative"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-3xl md:text-4xl font-semibold mb-6 drop-shadow-lg">
                    Body Scan Therapy
                </h1>

                {!isPlaying ? (
                    <button
                        onClick={handleStartSession}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full text-lg transition duration-300 shadow-md"
                    >
                        Start Session
                    </button>
                ) : (
                    <button
                        onClick={handleStopSession}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full text-lg transition duration-300 shadow-md"
                    >
                        Stop Session
                    </button>
                )}

                {isPlaying && (
                    <p className="text-lg font-medium mt-4 animate-pulse">
                        Session in progress...
                    </p>
                )}
            </div>

            <audio ref={audioRef} src={audioFile} onEnded={() => setIsPlaying(false)} />


        </div>
    );
};

export default BodyScan;
