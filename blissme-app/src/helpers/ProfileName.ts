export const getAvatarStyle = (username: string) => {
  const colors = [
    "#6BCB77", // light green
    "#28a745", // medium green
    "#2ecc71", // emerald
    "#27ae60", // dark green
    "#00c853", // vivid green
    "#66bb6a", // muted green
    "#43a047", // forest green
    "#1b5e20", // deep green
    "#81c784", // pastel green
    "#388e3c", // strong green
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
