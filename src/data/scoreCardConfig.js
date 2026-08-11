import baseScoreCard from "../assets/images/BaseScoreCard.jpeg";
import oceaniaScoreCard from "../assets/images/OceaniaScoreCard.jpeg";
import asiaScoreCard from "../assets/images/AsiaScoreCard.jpeg";
import americasScoreCard from "../assets/images/AmericasScoreCard.jpeg";

export const SCORE_CARD_CONFIGS = {
  base: {
    image: baseScoreCard,

    playerColumns: [
      35, 48, 61, 74, 87
    ],

    scorePositions: [
        { field: "playerName", position: 5 },
        { field: "birdPoints", position: 16 },
        { field: "bonusCards", position: 28 },
        { field: "roundGoals", position: 40 },

        { field: "eggs", position: 53 },
        { field: "cachedFood", position: 64 },
        { field: "tuckedCards", position: 75 },

        { field: "total", position: 95 },
    ],
  },

  oceania: {
    image: oceaniaScoreCard,

    playerColumns: [
      35, 48, 61, 74, 87
    ],

    scorePositions: [
        { field: "playerName", position: 5 },
        { field: "birdPoints", position: 16 },
        { field: "bonusCards", position: 28 },
        { field: "roundGoals", position: 40 },

        { field: "eggs", position: 53 },
        { field: "cachedFood", position: 64 },
        { field: "tuckedCards", position: 75 },
        { field: "nectarPlayed", position: 68 },
        { field: "nectar", position: 86 },

        { field: "total", position: 95 },
    ],
  },

  asia: {
    image: asiaScoreCard,

    playerColumns: [
      35, 48, 61, 74, 87
    ],

    scorePositions: [
        { field: "playerName", position: 5 },
        { field: "birdPoints", position: 16 },
        { field: "bonusCards", position: 28 },
        { field: "roundGoals", position: 40 },

        { field: "eggs", position: 53 },
        { field: "cachedFood", position: 64 },
        { field: "tuckedCards", position: 75 },
        { field: "nectarPlayed", position: 68 },
        { field: "nectar", position: 86 },

        { field: "total", position: 95 },
    ],
  },

  americas: {
    image: americasScoreCard,

    playerColumns: [
       35, 48, 61, 74, 87,
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
        { field: "hummingBirdTrack", position: 80 },

        { field: "total", position: 93 },
    ],

  },
};