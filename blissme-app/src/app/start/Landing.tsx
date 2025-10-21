import Bubble from '../../components/Background/Bubble';
import bg from "../../assets/images/landing.png";
import logo from "../../assets/images/logo.png";
import { Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Landing = () => {
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();
    const logoStyle = {
        maxWidth: '300px',
        marginBottom: '20px',
        marginTop: '40px',
        animation: 'scalePulse 2s infinite ease-in-out'
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100vw',
                position: 'relative', // ✅ Important for absolute children
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '50px 20px',
                boxSizing: 'border-box',
                color: 'white',
                overflow: 'hidden',
            }}
        >
            <style>
                {`
            @keyframes scalePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            `}
            </style>
            <img
                src={logo}
                alt="BlissMe Logo"
                style={logoStyle}

            />

            <div className="flex justify-center mt-4 z-10 w-[100px] md:w-auto">
                <button
                    type="button"
                    className="w-full md:w-[180px] h-[45px] text-base md:text-lg rounded-xl text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                    disabled={loading}
                    onClick={() => { setLoading(true); Navigate('/home'); }}
                >
                    Launch App
                </button>



            </div>

            <div className="
                    absolute 
                    left-1/2 
                    -translate-x-1/2 
                    z-50
                    bottom-[80px]     /* default for very small screens */
                    sm:bottom-[80px]  /* ≥640px */
                    md:bottom-[80px]  /* ≥768px */
                    lg:bottom-[60px]  /* ≥1024px */
                    xl:bottom-[60px]  /* ≥1280px */
">
                <DotLottieReact
                    src="/animations/bear.lottie"
                    loop
                    autoplay
                    className="
                    w-[300px] h-[220px]
                    sm:w-[350px] sm:h-[250px]
                    md:w-[450px] md:h-[350px]
                    lg:w-[400px] lg:h-[250px]
                    xl:w-[400px] xl:h-[250px]
                "
                />
            </div>


        </div>
    );
};

export default Landing;