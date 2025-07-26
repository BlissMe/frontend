export const getAvatarStyle = (username: string) => {
  const colors = [
    "#FF6B6B", // red
    "#6BCB77", // green
    "#4D96FF", // blue
    "#FFC75F", // yellow
    "#FF9671", // orange
    "#845EC2", // purple
    "#2C73D2", // indigo
    "#00C9A7", // teal
    "#D65DB1", // pink
    "#0081CF", // sky blue
  ];

  // Create a hash from the username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Get index based on hash
  const index = Math.abs(hash) % colors.length;

  const color = colors[index];
  const letters = username?.trim()?.slice(0, 2).toUpperCase() || "US";

  return {
    backgroundColor: color,
    letter: letters,
  };
};
