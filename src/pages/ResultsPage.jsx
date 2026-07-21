import { Container, Button, Stack } from "react-bootstrap";

import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";

function ResultsPage() {
  let navigate = useNavigate();

  const handleNewGame = () => {
    navigate("/lobby");
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <Container className="py-4">
      <h1 title="Results">Results</h1>

      <Stack
        direction="horizontal"
        gap={3}
        className="justify-content-center mt-4"
      >
        <Button
          className="btn wingspan-btn py-3"
          onClick={handleReturnHome}
        >
          Return Home
        </Button>

        <Button
          className="btn wingspan-btn py-3"
          onClick={handleNewGame}
        >
          New Game
        </Button>
      </Stack>
    </Container>
  );
}

export default ResultsPage;