import { useUserDataStore } from "../../store/useUserDataStore";
import { ReactNode } from "react";

type ButtonProps = {
  buttonText: string;
  py: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  formSubmit?: boolean;
  className?: string; // ✅ allow passing custom styles
  icon?: ReactNode;   // ✅ new icon prop
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
}: ButtonProps) => {
  const logData = useUserDataStore((state) => state.logData);

  const defaultClass = `flex items-center justify-center gap-2 text-white font-RedditSans px-8 font-semibold rounded-[10px] hover:bg-blue-700 ${
    !!formSubmit && logData.horasSono === ""
      ? "bg-[#4865dbb3]"
      : "bg-blue-600 cursor-pointer"
  }`;

  return (
    <button
      disabled={!!formSubmit && logData.horasSono === ""}
      type="submit"
      className={className ? className : defaultClass} // ✅ custom or default
      style={{
        paddingTop: py,
        paddingBottom: py,
        fontSize: fontSize,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
      }}
    >
      {icon && <span>{icon}</span>} {/* ✅ render icon if passed */}
      <span>{buttonText}</span>
    </button>
  );
};

export default Button;
