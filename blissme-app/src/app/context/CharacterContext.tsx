import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
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
  const selectId = useSelector(
    (state: RootState) => state.user.virtualCharacter
  );

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

  const selectedCharacter = useMemo(() => {
    if (!characters.length || selectId == null) {
      console.warn("Characters not loaded or selectId is null");
      return undefined;
    }

    console.log("All characters:", characters);
    console.log("Redux selectId:", selectId);

    const result = characters.find(
      (char) => Number(char.characterId) === Number(selectId)
    );

    console.log("Selected character result:", result);
    return result;
  }, [characters, selectId]);

  //if (loading) return null; 

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