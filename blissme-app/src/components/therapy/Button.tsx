import { useUserDataStore } from "../../store/useUserDataStore";

type ButtonProps = {
  buttonText: string;
  py: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  formSubmit?: boolean;
};

const Button = ({
  buttonText,
  py,
  fontSize,
  lineHeight,
  letterSpacing,
  formSubmit,
}: ButtonProps) => {
  const logData = useUserDataStore((state) => state.logData);

  return (
    <button
      disabled={!!formSubmit && logData.horasSono === ""}
      type="submit"
      className={`text-white font-RedditSans px-8 font-semibold rounded-[10px] hover:bg-blue-700 ${
        !!formSubmit && logData.horasSono === ""
          ? "bg-[#4865dbb3]"
          : "bg-blue-600 cursor-pointer"
      }`}
      style={{
        paddingTop: py,
        paddingBottom: py,
        fontSize: fontSize,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
      }}
    >
      {buttonText}
    </button>
  );
};
export default Button;
