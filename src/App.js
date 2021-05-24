import React, { useState } from "react";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";
import Editor from "./editor";

export default function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="App">
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} enforceFocus={false} onHide={handleClose}>
        <Modal.Body>
          <Editor />
        </Modal.Body>
      </Modal>
    </div>
  );
}
