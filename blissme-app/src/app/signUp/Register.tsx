import { AnimatedBackground, LayeredBackground } from 'animated-backgrounds';
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import signup from "../../assets/images/signup.jpg";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import '../../index.css';
import MessageBubble from '../../components/Background/MessageBubble';

import bg6 from '../../assets/images/b6.jpg';


const { Text } = Typography;

const Register = () => {

    const layers = [
        { animation: 'starryNight', opacity: 0.8, blendMode: 'normal', speed: 0.5 },
        { animation: 'cosmicDust', opacity: 0.6, blendMode: 'screen', speed: 1.0 },
        { animation: 'auroraBorealis', opacity: 0.4, blendMode: 'overlay', speed: 1.5 }
    ];
    const cosmicScene = [
        {
            animation: 'starryNight',
            opacity: 0.8,
            blendMode: 'normal',
            speed: 0.3
        },
        {
            animation: 'cosmicDust',
            opacity: 0.6,
            blendMode: 'screen',
            speed: 0.8
        },
        {
            animation: 'auroraBorealis',
            opacity: 0.4,
            blendMode: 'overlay',
            speed: 1.2
        }
    ];

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setToken } = useContext(AuthContext);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const userData = {
                email: values.email,
                password: values.password,
                authType: "normal",
            };

            const response = await userSignUpService(userData);

            if (response.message) {
                message.success("Successfully Registered!");
                console.log(response?.token)
                setToken(response?.token);
                setLocalStorageData("token", response?.token);
                navigate("/nick-name", { replace: true });
            } else {
                message.error(response.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            message.error("Something went wrong. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const googleAuth = () => {
        window.open(`http://localhost:8080/auth/google`, "_self");
    };

    return (
        <div
            className="relative z-0 min-h-screen w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${bg6})` }}
        >
            <div className="min-h-screen w-full flex items-center justify-center  relative z-10">
                <div className="flex flex-col items-center gap-2 w-full md:w-1/2 max-w-[500px] py-8 bg-white rounded-xl shadow-lg">

                    {/* Message Bubble on top */}
                    <MessageBubble />

                    {/* Form & other content below */}
                    <div className="flex flex-col items-center w-full ">
                        <div className="flex flex-col items-center w-full gap-1 mb-2">
                            <Text className="text-black text-2xl md:text-3xl font-semibold " style={{ fontFamily: 'Merienda, cursive' }}>
                                Register
                            </Text>
                            <Text
                                className="text-[15px] font-normal text-center"
                                style={{ fontFamily: 'Merienda, cursive' }}
                            >           Let’s get you started with your friendly AI buddy!
                            </Text>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w *:-full ">
                        <Form layout="vertical" className="w-[380px] sm:w-[400px]" onFinish={onFinish}>
                            <Form.Item
                                name="email"
                                label="Email "
                                className="custom-label"

                                required={false}
                                rules={[
                                    { required: true, message: "Email is required!" },
                                    { type: "email", message: "Email is invalid!" },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                    onKeyDown={(e) => {
                                        const key = e.key;
                                        if (!/^[A-Za-z.@0-9]*$/.test(key) && key !== "Backspace") {
                                            e.preventDefault();
                                        }
                                    }}
                                    size="large"
                                    maxLength={100}
                                    autoComplete="off"
                                    className="w-full custom-input rounded-none"

                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password "
                                className="custom-label"

                                required={false}
                                rules={[{ validator: passwordFieldValidation }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    size="large"
                                    placeholder="Password"
                                    maxLength={60}
                                    className="w-full custom-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="agree"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject("You must agree to terms"),
                                    },
                                ]}
                            >
                                <Checkbox>
                                    I agree to{" "}
                                    <span className="text-textColorTwo">Terms & Conditions</span>{" "}
                                    and <span className="text-textColorTwo">Privacy</span>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <div className="flex justify-center">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                                        loading={loading}
                                    >
                                        Sign Up
                                    </Button>



                                </div>
                            </Form.Item>
                        </Form>

                        <Form>
                            <div className="flex justify-center mb-2">
                                <Text className="text-center text-black text-sm">or</Text>
                            </div>

                            <Form.Item>
                                <div className="flex justify-center">
                                    <Button
                                        type="primary"
                                        className="google_btn flex items-center gap-2"
                                        onClick={googleAuth}
                                    >
                                        <img
                                            src={assets.google}
                                            alt="google icon"
                                            className="w-5 h-5"
                                        />
                                        Sign up with Google
                                    </Button>
                                </div>
                            </Form.Item>

                            <Text className="block text-center text-sm md:text-base text-textColorOne">
                                Already have an account?{" "}
                                <span
                                    className="text-textColorTwo cursor-pointer"
                                    onClick={() => navigate("/sign-in")}
                                >
                                    Sign In
                                </span>
                            </Text>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Register
