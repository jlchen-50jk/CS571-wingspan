import { Container, Stack, Button } from "react-bootstrap";

import { useGame } from "../context/GameContext";

import SelectionCard from "../components/SelectionCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RoundPage() {
  //State Variables
  const {gameSettings, advanceRound } = useGame();
  const [roundEnd, setRoundEnd] = useState(false);

  const round =
    gameSettings.currentRound;

  const roundGoal =
    gameSettings.goals[round];

  const handleEndRound = () => {
    advanceRound();
    setRoundEnd(false);
  };

  function handleEndGame() {
    // Navigate to the final scoring page
    navigate("/scoring");
  }

  let navigate = useNavigate();
  //TODO: Handle score tracking - game setting will have round scores added.
  return <Container className="py-4">
    <h1 className="page-title text-center mb-4">Round {round}</h1>

    <div className="d-flex justify-content-center mb-4">
      <div style={{ width: "250px" }}>
        <SelectionCard
          className="selected"
          image={roundGoal?.image}
        />
      </div>
    </div>

    <div className="text-center mb-5">
      {
        roundEnd ? <h4>Round {round} Scoring</h4> : <h4>Round {round} In Progress</h4>
      }
    </div>

    <Stack
      direction="horizontal"
      gap={3}
      className="justify-content-center"
    >
      <Button
        className="btn wingspan-btn py-3"
        onClick={() =>
          navigate("/")
        }
      >
        Leave Game
      </Button>
      { 
        roundEnd ? <Button className="btn wingspan-btn py-3" onClick={round < 4 ? handleEndRound : handleEndGame}>
          {round < 4 ? `Advance to Round ${round + 1}` : "End Game"}
        </Button> : <Button className="btn wingspan-btn py-3" onClick={() => setRoundEnd(true)}>
          End Round
        </Button>
      }
    </Stack>
  </Container>
}

export default RoundPage;