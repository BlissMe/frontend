import Bubble from '../../components/Background/Bubble';
import bg from "../../assets/images/loading-bg.png";
import logo from "../../assets/images/logo.png";
import { Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

            <div className="flex justify-center mt-4 z-10">
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full md:w-[180px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                    loading={loading}
                    onClick={() => { setLoading(true); Navigate('/home'); }}
                >
                    Launch App
                </Button>



            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Bubble />
            </div>
        </div>
    );
};

export default Landing;
