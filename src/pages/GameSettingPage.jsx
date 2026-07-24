import { Col, Container, Row, Accordion, Button, Card } from "react-bootstrap";
import SelectionCard from "../components/SelectionCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import GoalSelectionModal from "../components/GoalSelectionModal";
import GOALS from "../data/goals.js";
import { EXPANSIONS_LIST } from "../data/expansionList.js";

function GameSettingPage() {

  let navigate = useNavigate();

  const { gameSettings, assignGameId, assignPlayerId, updatePlayerCount, toggleExpansion, updateRoundGoal, resetGameSettings } = useGame();
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);

  const playerCntOptions = Array.from({ length: gameSettings.maxPlayers -2 }, (_, i) => i + 3); // Create an array [3, 4, ..., maxPlayers]
  const availableGoals = GOALS.filter(goal => gameSettings.expansions.includes(goal.expansion))
    .filter(goal => !Object.values(gameSettings.goals).includes(goal)); // Filter goals based on selected expansions and already selected goals

  //TODO: add error checking for start game button: no expansion select, and not all goals select (ok to be all blanks)
  //TODO: add a way to reset game settings to default values (3 players, base expansion, no goals selected)
  //TODO: add a way to remove a selected goal from a round (maybe just click the goal again to deselect it)
  //TODO: add random goal selection button that will randomly select a goal for each round from the available goals (based on selected expansions)

console.log("Game Settings:", gameSettings); //TODO: Remove this debug log after confirming gameSettings is correct

  function createGame() {
    //assign a unique game ID (for now just a random 4 letter string)
    assignGameId();
    sessionStorage.setItem("playerId", assignPlayerId()); // Assign a player ID to the host (first player)
    navigate("/lobby");
  }

  function leaveGame() {
    resetGameSettings();
    navigate("/");
  }

  return <Container className="center-screen">
    <h1 className="page-title">Game Settings</h1>
    <Accordion defaultActiveKey={["0", "1"]} className="mb-4" flush alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Expansion Selection</Accordion.Header>
        <Accordion.Body>
          <Row xs={1} sm={2} md={5}>
            {
              EXPANSIONS_LIST.map((expansion) => (
                <Col key={expansion.id}>
                  <SelectionCard imgClassName="expansion-card-img" image={expansion.img} onClick={() => toggleExpansion(expansion.id)} selected={gameSettings.expansions.includes(expansion.id)} />
                </Col>
              ))
            }
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Player Count</Accordion.Header>
        <Accordion.Body>
          <Row xs="auto">
            {playerCntOptions.map((count) => (
              <Col key={count}>
                <SelectionCard className="player-count-card" title={count} selected={gameSettings.playerCount === count} onClick={() => updatePlayerCount(count)} />
              </Col>
            ))}
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Goal Selection</Accordion.Header>
        <Accordion.Body>
          <Row>
            {
              [1, 2, 3, 4].map((round) => (
                <Col key={round} sm={6} md={3}>
                  <SelectionCard 
                    selected={false} 
                    className="goal-slot" 
                    title={`Round ${round}`}
                    image={gameSettings.goals[round] ? gameSettings.goals[round].image : ""}
                    onClick={() => {
                      setSelectedRound(round);
                      setShowGoalModal(true);
                    }}>
                      {
                        gameSettings.goals[round] ?<></> : <Card className="goal-placeholder">
                          <small>Select Goal</small>
                        </Card>
                      }
                  </SelectionCard>
                </Col>
              ))
            }
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <Button className="btn wingspan-btn py-3" onClick={createGame}> 
      Create Game
    </Button>
    <Button className="btn wingspan-btn py-3 mt-2" variant="secondary" onClick={leaveGame}>
      Back to Home
    </Button>
    <GoalSelectionModal
      show={showGoalModal}
      onHide={() => setShowGoalModal(false)}
      roundNumber={selectedRound}
      goals={availableGoals}
      onGoalSelect={(goal) => {
        updateRoundGoal(selectedRound, goal);
        setShowGoalModal(false);
      }}
    />
  </Container>

  
}

export default GameSettingPage;