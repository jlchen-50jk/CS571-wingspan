import baseScoreCard from "../assets/images/BaseScoreCard.jpeg";
import oceaniaScoreCard from "../assets/images/OceaniaScoreCard.jpeg";
import asiaScoreCard from "../assets/images/AsiaScoreCard.jpeg";
import americasScoreCard from "../assets/images/AmericasScoreCard.jpeg";

export const SCORE_CARD_CONFIGS = {
  base: {
    image: baseScoreCard,

    playerColumns: [
      37, 49, 62, 75, 88
    ],

    scorePositions: [
        { field: "playerName", position: 10 },
        { field: "birdPoints", position: 18 },
        { field: "bonusCards", position: 30 },
        { field: "roundGoals", position: 40 },

        { field: "eggs", position: 53 },
        { field: "cachedFood", position: 64 },
        { field: "tuckedCards", position: 75 },

        { field: "total", position: 85 },
    ],
  },

  oceania: {
    image: oceaniaScoreCard,

    playerColumns: [
      37, 50, 63, 75, 89
    ],

    scorePositions: [
        { field: "playerName", position: 10 },
        { field: "birdPoints", position: 16 },
        { field: "bonusCards", position: 27 },
        { field: "roundGoals", position: 38 },

        { field: "eggs", position: 48 },
        { field: "cachedFood", position: 57 },
        { field: "tuckedCards", position: 68 },
        { field: "nectarPlayed", position: 75 },
        { field: "nectar", position: 80 },

        { field: "total", position: 87 },
    ],
  },

  asia: {
    image: asiaScoreCard,

    playerColumns: [
      30, 40, 50, 61, 72, 82, 92
    ],

    scorePositions: [
        { field: "playerName", position: 5 },
        { field: "birdPoints", position: 14 },
        { field: "bonusCards", position: 25 },
        { field: "roundGoals", position: 35 },

        { field: "eggs", position: 47 },
        { field: "cachedFood", position: 60 },
        { field: "tuckedCards", position: 70 },
        { field: "nectarPlayed", position: 77 },
        { field: "nectar", position: 82 },

        { field: "total", position: 90 },
    ],
  },

  americas: {
    image: americasScoreCard,

    playerColumns: [
       36, 47, 58.5, 70, 81.5,
    ],

    scorePositions: [
        { field: "playerName", position: 5 },
        { field: "birdPoints", position: 10 },
        { field: "bonusCards", position: 20 },
        { field: "roundGoals", position: 28 },

        { field: "eggs", position: 37 },
        { field: "cachedFood", position: 45 },
        { field: "tuckedCards", position: 53 },
        { field: "nectarPlayed", position: 68 },
        { field: "nectar", position: 72 },
        { field: "hummingbirds", position: 80 },

        { field: "total", position: 92 },
    ],

  },
};