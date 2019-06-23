import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

import './styles/PageError.css';

function PageError(props) {
  if (props.inline) {
    return <div>{props.error.message}</div>;
  }
  if (props.modal) {
    return (
      <Modal
        isOpen={props.error !== null}
        toggle={props.toggle}
        className={classnames(props.className, { PageError: true })}
      >
        <ModalHeader toggle={props.toggle}>Ha ocurrido un error</ModalHeader>
        <ModalBody>
          <p>{props.error && props.error.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.toggle}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return <div className="PageError">{props.error.message}</div>;
}

export default PageError;
