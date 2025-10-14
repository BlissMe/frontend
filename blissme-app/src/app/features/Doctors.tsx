import React from "react";
import { Card, Button, Row, Col } from "antd";
import user from "../../assets/images/user.png";
import d1 from "../../assets/images/D1.jpg";
import d2 from "../../assets/images/D2.jpg";
import d3 from "../../assets/images/D3.jpg";
import d4 from "../../assets/images/D4.jpg";

const { Meta } = Card;

const Doctors = () => {
    // Dummy doctors data
    const doctors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            img: d1,
        },
        {
            id: 2,
            name: "Dr. Michael Smith",
            specialty: "Dermatologist",
            img: d2,
        },
        {
            id: 3,
            name: "Dr. Emily Davis",
            specialty: "Pediatrician",
            img: d3,
        },
        {
            id: 4,
            name: "Dr. James Brown",
            specialty: "Neurologist",
            img: d4,
        },
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px 20px",
                background: "linear-gradient(135deg, oklch(59.6% 0.145 163.225) 0%, oklch(95% 0.052 163.051) 20%)",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 className="text-3xl font-bold text-green-800 mb-6 text-center md:text-center" style={{ fontFamily: 'Merienda, cursive' }}>Contact Me</h1>
                <p style={{ fontSize: "1.1rem" }}>Find the best doctors in your area</p>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {doctors.map((doc) => (
                    <Col
                        key={doc.id}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <Card
                            hoverable
                            style={{
                                width: 300,
                                borderRadius: "15px",
                                overflow: "hidden",
                                textAlign: "center",
                            }}
                            cover={
                                <img
                                    draggable={false}
                                    alt={doc.name}
                                    src={doc.img}
                                    style={{ height: 280, objectFit: "cover" }}
                                />
                            }
                        >
                            <Meta
                                title={doc.name}
                                description={<span style={{ fontSize: "1rem" }}>{doc.specialty}</span>}
                            />
                            <Button
                                type="primary"
                                className="mt-5 bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:bg-[#1B5E3A] text-white border-none shadow-md"

                                onClick={() => alert(`Appointment requested with ${doc.name}`)}
                            >
                                Make Appointment
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Doctors;
