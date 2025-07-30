import { getAvatarStyle } from "../../helpers/ProfileName";

const Avatar = ({ username }: { username: string }) => {
  const { backgroundColor, letter } = getAvatarStyle(username);

  return (
    <div
      style={{ backgroundColor }}
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base"
    >
      {letter}
    </div>
  );
};

export default Avatar;
