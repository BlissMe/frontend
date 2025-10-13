import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getLocalStoragedata } from "../../helpers/Storage";

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
  selectId: number | null;
  fetchCharacters: () => Promise<void>;
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
  const selectId = Number(
    useSelector((state: RootState) => state.user.virtualCharacter)
  );

  const fetchCharacters = async () => {
    const localToken = getLocalStoragedata("token");
    if (!localToken) return;

    try {
      const response = await axios.get<Character[]>(`${url}/api/blissme/all-characters`, {
        headers: { Authorization: `Bearer ${localToken}` },
      });
      setCharacters(response.data);
    } catch (error: any) {
      console.error("Error fetching characters:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [url]);

  const selectedCharacter = characters.find(
    (char) => char.characterId === selectId
  );

  return (
    <CharacterContext.Provider
      value={{
        characters,
        selectedCharacterId,
        setSelectedCharacterId,
        selectedCharacter,
        nickname,
        selectId,
        fetchCharacters,
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
