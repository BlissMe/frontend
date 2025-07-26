import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface Character {
  _id: string;
  name: string;
  imageUrl: string;
  characterId: number;
  __v: number;
}

interface CharacterContextType {
  characters: Character[];
  selectedCharacterId: number | null;
  setSelectedCharacterId: (id: number | null) => void;
  selectedCharacter: Character | undefined;
  nickname: string | undefined;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const url = process.env.REACT_APP_API_URL;
  const nickname = useSelector((state: RootState) => state.user.nickname);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<Character[]>(`${url}/`);
        console.log("Characters fetched:", response.data);
        setCharacters(response.data);
      } catch (error: any) {
        console.error("Error fetching characters:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [url]);
  const selectId = useSelector(
    (state: RootState) => state.user.virtualCharacter
  );

  const selectedCharacter = characters.find(
    (char) => char.characterId === selectId
  );
  console.log("chatHistory", selectedCharacter);
  return (
    <CharacterContext.Provider
      value={{
        characters,
        selectedCharacterId,
        setSelectedCharacterId,
        selectedCharacter,
        nickname,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error(
      "useCharacterContext must be used within a CharacterProvider"
    );
  }
  return context;
};

export { CharacterProvider, useCharacterContext };
