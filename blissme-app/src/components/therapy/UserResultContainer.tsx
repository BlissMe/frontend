//import { useAuth } from "../context/AuthContext";
import ResultCard from "./ResultCard";
import veryHappyWhiteEmoji from "../../assets/svg/icon-very-happy-white.svg";
import neutralWhiteEmoji from "../../assets/svg/icon-neutral-white.svg";
import happyWhiteEmoji from "../../assets/svg/icon-happy-white.svg";
import sadWhiteEmoji from "../../assets/svg/icon-sad-white.svg";
import verySadWhiteEmoji from "../../assets/svg/icon-very-sad-white.svg";
import risingSvg from "../../assets/svg/icon-trend-increase.svg";
import sameSvg from "../../assets/svg/icon-trend-same.svg";
import fallingSvg from "../../assets/svg/icon-trend-decrease.svg";
import risingSvgWhite from "../../assets/svg/icon-trend-increase-white.svg";
import sameSvgWhite from "../../assets/svg/icon-trend-same-white.svg";
import fallingSvgWhite from "../../assets/svg/icon-trend-decrease-white.svg";
import zzzSvg from "../../assets/svg/icon-sleep-white.svg";
import { useUserDataStore } from "../../store/useUserDataStore";

type averageMoodType = {
  text: string;
  bg: string;
  info: string | null;
  emoji: string | null;
  arrow: string | null;
  color1: string;
  color2: string;
};

type CompleteResult = {
  mostCommonMood: string;
  trend: string | null;
  trendArrow: string | null;
};

const UserResultContainer = () => {
  //const { userMoodRecord } = useAuth();
  const userMoodRecord = useUserDataStore((state) => state.userMoodRecord);

  const result: CompleteResult = ((records) => {
    const scale = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];
    const lastFive = records.slice(-5);

    // CASO COM NULL retorna o keep tracking
    if (lastFive.length < 5) {
      return {
        mostCommonMood: "Keep tracking",
        trend: "Log 5 check-ins to see your average mood.",
        trendArrow: null,
      };
    }

    //pego dos ultimos 5 registros acesso o humor e vejo quantas vezes repete esse humor retornando objeto com happy: 2 sad: 1 etc
    const count = lastFive.reduce<Record<string, number>>((acc, { humor }) => {
      if (humor) acc[humor] = (acc[humor] || 0) + 1;
      return acc;
    }, {});

    //separo os valores de count, gerando um array de arrays [[happy, 2] [sad, 1]] etc
    const entries = Object.entries(count);

    let mostCommonMood = "Neutral";

    //verifico se tem 3 arrays no array (no caso 3 humores distintos) ai verifico se é o caso de dois deles terem empate de 2 vezes escolhido
    const isTwoTwoOne = () =>
      entries.length === 3 &&
      entries.filter(([, v]) => v === 2).length === 2 &&
      entries.some(([, v]) => v === 1);

    //se só tiver um array é pq foram todos os 5 o mesmo humor
    if (entries.length === 1) {
      mostCommonMood = entries[0][0];
      //se tem 5 arrays é pq cada um dos 5 é um diferente e então define como neutral
    } else if (entries.length === 5) {
      mostCommonMood = "Neutral";

      //entra no caso de empate 2 2 (outro 1)
    } else if (isTwoTwoOne()) {
      //pega os que foram escolhidos 2 vezes
      const twoItems = entries.filter(([, v]) => v === 2);
      //pega o outro 1
      const oneItem = entries.find(([, v]) => v === 1);

      //verifica primeiro se realmente o twoItems tem 2 humores que foram empatados em 2, depois confirma que o outro humor retornou uma array [sad, 1] e que o primeiro valor é uma string
      if (
        twoItems.length !== 2 ||
        !Array.isArray(oneItem) ||
        typeof oneItem[0] !== "string"
      ) {
        //se tiver algum problema define como neutral
        mostCommonMood = "Neutral";
      } else {
        //define a e b como os primeiros valores do twoItems (os string do humor)
        const [a, b] = twoItems.map(([k]) => k);
        // c igual o string do oneitem
        const c = oneItem[0];

        // usamos a função idx para obter a posição de cada humor na escala (de "Very sad" até "Very happy")
        // calculamos a distância entre c e a, e entre c e b na escala
        // se a estiver mais próximo de c, escolhemos a; se b estiver mais próximo, escolhemos b
        // se ambos estiverem à mesma distância, escolhemos o de maior intensidade (mais à direita na escala)
        // isso favorece humores mais felizes em caso de empate total
        const idx = (mood: string) => scale.indexOf(mood);
        const distA = Math.abs(idx(c) - idx(a));
        const distB = Math.abs(idx(c) - idx(b));

        mostCommonMood =
          distA < distB
            ? a
            : distB < distA
            ? b
            : scale[Math.max(idx(a), idx(b))];
      }
    }
    // aqui é caso não seja empate 2 2 aí ele pega simplesmente o que teve maior repeticao ordena os pares por ordem decrescente de quantidade e seleciona o humor mais frequente (primeiro da lista)
    else {
      entries.sort((a, b) => b[1] - a[1]);
      mostCommonMood = entries[0][0];
    }
    // Convertemos os últimos 5 humores em índices numéricos com base na escala
    // Ex: "Very sad" = 0, ..., "Very happy" = 4

    const score = (mood: string) => scale.indexOf(mood);

    // Criamos um array com os valores numéricos dos humores
    // Exemplo: ["Very sad", "Sad", "Happy"] → [0, 1, 3]
    const diffs = lastFive.map((d) => score(d.humor!));

    // Calculamos a tendência somando as diferenças entre dias consecutivos:
    // (dia2 - dia1) + (dia3 - dia2) + ... + (dia5 - dia4)
    // Isso mostra se o humor está melhorando, piorando ou estável no geral

    const totalChange = diffs
      .slice(1)
      .reduce((acc, curr, i) => acc + (curr - diffs[i]), 0);

    const trend =
      totalChange > 0
        ? "Increase from the previous 5 check-ins"
        : totalChange < 0
        ? "Decrease from the previous 5 check-ins"
        : "same as the previous 5 check-ins";

    const trendArrow =
      trend === "same as the previous 5 check-ins"
        ? sameSvg
        : trend === "Decrease from the previous 5 check-ins"
        ? fallingSvg
        : risingSvg;

    return { mostCommonMood, trend, trendArrow };
  })(userMoodRecord);

  let averageMoodResult: averageMoodType;

  switch (result.mostCommonMood) {
    case "Very Happy":
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-[#FFC97C]",
        info: result.trend,
        emoji: veryHappyWhiteEmoji,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-neutral-900",
      };
      break;

    case "Happy":
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-[#89E780]",
        info: result.trend,
        emoji: happyWhiteEmoji,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-neutral-900",
      };
      break;

    case "Neutral":
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-[#89CAFF]",
        info: result.trend,
        emoji: neutralWhiteEmoji,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-neutral-900",
      };
      break;

    case "Sad":
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-[#B8B1FF]",
        info: result.trend,
        emoji: sadWhiteEmoji,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-neutral-900",
      };
      break;

    case "Very Sad":
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-[#FF9B99]",
        info: result.trend,
        emoji: verySadWhiteEmoji,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-neutral-900",
      };
      break;

    case "Keep tracking":
    default:
      averageMoodResult = {
        text: result.mostCommonMood,
        bg: "bg-blue-100",
        info: result.trend,
        emoji: null,
        arrow: result.trendArrow,
        color1: "text-neutral-900",
        color2: "text-[#21214db3]",
      };
  }

  const sleepResult = ((records) => {
    const lastFive = records.slice(-5);

    const sleepParameter = {
      "0-2 hours": 1,
      "3-4 hours": 3.5,
      "5-6 hours": 5.5,
      "7-8 hours": 7.5,
      "9+ hours": 9,
    };
    if (lastFive.length < 5) {
      return {
        text: "Not enough data yet!",
        info: "Track 5 nights to view average sleep.",
        bg: "bg-blue-100",
        emoji: null,
        arrow: null,
        color1: "text-neutral-900",
        color2: "text-[#21214db3]",
      };
    } else {
      const lastFiveSleep = lastFive.map((day) => day.horas_sono);
      const numericSleepValues = lastFiveSleep.map(
        (value) => sleepParameter[value as keyof typeof sleepParameter]
      );
      const total = numericSleepValues.reduce((acc, curr) => acc + curr);
      const average = total / 5;
      const finalSleepResult =
        average < 2.25
          ? "0-2 Hours"
          : average < 4.5
          ? "3-4 Hours"
          : average < 6.5
          ? "5-6 Hours"
          : average < 8.25
          ? "7-8 Hours"
          : "9+ Hours";

      const trendValue = numericSleepValues
        .slice(1)
        .reduce((acc, curr, i) => acc + (curr - numericSleepValues[i]), 0);

      const sleepTrend =
        trendValue > 0
          ? "Increase from the previous 5 check-ins"
          : trendValue < 0
          ? "Decrease from the previous 5 check-ins"
          : "Same as the previous 5 check-ins";
      const trendEmoji =
        sleepTrend === "Increase from the previous 5 check-ins"
          ? risingSvgWhite
          : sleepTrend === "Decrease from the previous 5 check-ins"
          ? fallingSvgWhite
          : sameSvgWhite;
      return {
        text: finalSleepResult,
        info: sleepTrend,
        bg: "bg-blue-600",
        emoji: zzzSvg,
        arrow: trendEmoji,
        color1: "text-white",
        color2: "text-white/70",
      };
    }
  })(userMoodRecord);

  return (
    <section className="py-5 px-4 md:px-6 md:py-6 gap-6 flex flex-col bg-white w-full border border-blue-100 rounded-2xl min-[780px]:max-w-[370px] min-[1170px]:min-w-[305px]">
      <ResultCard
        averageResult={averageMoodResult}
        information="Average Mood"
      />
      <ResultCard averageResult={sleepResult} information="Average Sleep" />
    </section>
  );
};

export default UserResultContainer;
