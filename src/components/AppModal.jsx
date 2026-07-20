import { Modal } from "react-bootstrap";

function AppModal({
  show,
  onHide,
  title,
  size = "lg",
  closeable = true,
  children,
}) {
  return <Modal
      show={show}
      onHide={closeable ? onHide : undefined}
      backdrop={closeable ? true : "static"}
      keyboard={closeable}
      size={size}
      centered
    >
      <Modal.Header closeButton={closeable}>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
}

export default AppModal;