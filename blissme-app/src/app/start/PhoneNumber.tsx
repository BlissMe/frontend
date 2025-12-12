import React, { useState } from "react";

const PhoneNumber = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Simple validation: must be 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    alert(`Subscribed with phone number: ${phone}`);
    // Here you can call your subscription API
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Your Phone Number</h2>

      <input
        type="text"
        placeholder="e.g., 0771234567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
      >
        Subscribe
      </button>
    </div>
  );
};

export default PhoneNumber;
