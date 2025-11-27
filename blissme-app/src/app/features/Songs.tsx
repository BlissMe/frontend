import React, { useEffect, useState } from "react";
import axios from "axios";
import bg from "../../assets/images/bearsongs.png";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
};

const Songs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get<Song[]>(`${API_URL}/api/blissme/songs`);
        setSongs(res.data);
      } catch (err) {
        setError("Failed to load songs.");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);
  const handleLogoClick = () => navigate("/home");

  const handlePlay = (index: number) => setCurrentPlaying(index);

  if (loading) return <p className="text-center mt-10">Loading songs…</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div
      className="min-h-screen flex bg-green-50"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/*  <div className="fixed top-4 left-4 z-20 ">
                <img
                    onClick={handleLogoClick}
                    src={logo}
                    alt="Logo"
                    className="h-10 w-auto cursor-pointer"
                />
            </div> */}
      {/* Left scrollable list */}
      <div className="w-full md:w-2/5 bg-[#95BFA7] backdrop-blur-sm overflow-y-auto p-6 ml-6 mt-20 mr-6 mb-6 rounded-xl shadow-lg">
        <button
          onClick={() => navigate("/chat-new/text")}
          className="
          fixed top-4 right-8 z-50 
          bg-white/10 backdrop-blur-md border border-white/20
          text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg
          hover:bg-white/20 hover:scale-105 transition-transform duration-200
        "
        >
          ← Back to Chat
        </button>
        <h1
          className="text-3xl font-bold text-green-800 mb-6 text-center md:text-center"
          style={{ fontFamily: "Merienda, cursive" }}
        >
          Listen Me
        </h1>

        <ul className="space-y-6">
          {songs.map((song, index) => (
            <li
              key={song._id}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#D0D5BC] shadow rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                {song.coverUrl && (
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg">{song.title}</p>
                  <p className="text-gray-500 text-sm">{song.artist}</p>
                </div>
              </div>

              <audio
                controls
                src={song.audioUrl}
                className="mt-4 md:mt-0 w-full md:w-40 "
                onPlay={() => handlePlay(index)}
                onPause={() => setCurrentPlaying(null)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Right side stays as background image (empty space) */}
      <div className="hidden md:block md:flex-1" />
    </div>
  );
};

export default Songs;
