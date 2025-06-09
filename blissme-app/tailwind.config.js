/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        textColorOne: "#5F5757",
        textColorTwo: "#1713FF",
        buttonColor : "#1B5E3B",
        bgColorOne : "#A8D5BABD",
        inputColorOne :"#F2C1B6",
        inputColorTwo :"#47A37E",
        inputColorThree :"#DCF2DE",
        iconColor : "#1B5E3A"
      },
        animation: {
        ping_slow: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      screens: {
        xsm: "360px",
        sm: "540px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1680px",
        "4gs": "712px",
      },
      borderWidth: {
        DEFAULT: "0.75px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
        large: "12px",
      },
      fontSize: {
        xxxs: "0.5rem", //8px
        xxs: "0.625rem", //10px
        xs: "0.75rem", //12px
        sm: "0.875rem", //14px
        base: "1rem", //16px
        lg: "1.125rem", //18px
        xl: "1.25rem", //20px
        "1xl": "1.375rem", //22px
        "2xl": "1.5rem", //25px
        "3xl": "1.875rem", //30px
        "4xl": "2rem", //36px
      },
    },
    plugins: [],
  },
};
