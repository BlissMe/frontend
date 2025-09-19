import { useUserDataStore } from "../../store/useUserDataStore";
import { ReactNode, MouseEventHandler } from "react";

type ButtonProps = {
  buttonText: string;
  py: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  formSubmit?: boolean;
  className?: string; 
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>; 
};

const Button = ({
  buttonText,
  py,
  fontSize,
  lineHeight,
  letterSpacing,
  formSubmit,
  className,
  icon,
  onClick, 
}: ButtonProps) => {
  const logData = useUserDataStore((state) => state.logData);

  const defaultClass = `flex items-center justify-center gap-2 text-white font-RedditSans px-8 font-semibold rounded-[10px] hover:bg-blue-700 ${
    !!formSubmit && logData.horasSono === ""
      ? "bg-[#4865dbb3]"
      : "bg-blue-600 cursor-pointer"
  }`;

  return (
    <button
      type={formSubmit ? "submit" : "button"} 
      className={className ? className : defaultClass}
      style={{
        paddingTop: py,
        paddingBottom: py,
        fontSize: fontSize,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
      }}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>} 
      <span className="mx-2">{buttonText}</span>
    </button>
  );
};

export default Button;
