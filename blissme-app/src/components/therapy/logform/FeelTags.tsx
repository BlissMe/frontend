import { useUserDataStore } from "../../../store/useUserDataStore";

type FeelTagsType = {
  tag: string;
};

const FeelTags = ({ tag }: FeelTagsType) => {
  const logData = useUserDataStore((state) => state.logData);

  return (
    <div
      className={`flex items-center px-3.5 py-2.5 border-2 w-fit bg-white rounded-[10px] gap-[7px] cursor-pointer hover:bg-transparent ${
        logData.tags.includes(tag) ? "border-green-600" : "border-green-100"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-sm flex items-center justify-center ${
          logData.tags.includes(tag)
            ? "bg-green-600"
            : "border-2 border-green-200"
        }`}
      >
        <svg
          className={`${logData.tags.includes(tag) ? "flex" : "hidden"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="8"
          fill="none"
          viewBox="0 0 10 8"
        >
          <path
            fill="#fff"
            d="M3.541 6.86.623 3.94a.467.467 0 0 1 0-.65l.633-.633a.446.446 0 0 1 .633 0l1.986 1.969L8.094.408a.446.446 0 0 1 .633 0l.632.633a.467.467 0 0 1 0 .65L4.191 6.86a.467.467 0 0 1-.65 0Z"
          />
        </svg>
      </div>
      <span className="font-RedditSans text-[1.125rem]/[140%] tracking-[0.019rem] text-neutral-900">
        {tag}
      </span>
    </div>
  );
};
export default FeelTags;
