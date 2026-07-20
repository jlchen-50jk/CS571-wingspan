import { Row, Col, Container } from "react-bootstrap";
import AppModal from "./AppModal";
import SelectionCard from "./SelectionCard";

function GoalSelectionModal({
  show,
  onHide,
  roundNumber,
  goals,
  onGoalSelect,
}) {
    console.log("Available Goals in GoalSelectionModal:", goals);
  return <AppModal
      show={show}
      onHide={onHide}
      title={`Select Goal for Round ${roundNumber}`}
      size="xl"
    >
        <Container fluid>
            <Row className="g-3">
                {goals.map((goal) => (
                <Col
                    key={goal.id}
                    xs={6}
                    md={4}
                    lg={3}
                >
                    <SelectionCard
                    imgClassName="goal-slot"
                    image={goal.image}
                    onClick={() => {
                        onGoalSelect(goal);
                        onHide();
                    }}
                    />
                </Col>
                ))}
            </Row>
        </Container>
    </AppModal>
}

export default GoalSelectionModal;