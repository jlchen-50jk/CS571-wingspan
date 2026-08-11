import { Card } from "react-bootstrap";

function SelectionCard({
  title,
  image,
  imgClassName = "",
  selected,
  onClick,
  className = "",
  children,
  disabled = false,
}) {
  return (
    <Card
      className={`selection-card ${
        selected ? "selected" : ""
      } ${disabled ? "disabled" : ""} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      <Card.Body>
        {title && (
          <Card.Title>
            {title}
          </Card.Title>
        )}

        {image && (
          <Card.Img className={imgClassName} src={image} />
        )}

        {children}
      </Card.Body>
    </Card>
  );
}

export default SelectionCard;