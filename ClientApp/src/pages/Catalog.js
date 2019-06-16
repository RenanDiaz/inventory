import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewProductFormModal from '../components/NewProductFormModal';

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <div>
        <Row>
          <Col>
            <h4>Catálogo de productos</h4>
          </Col>
          <Col xs="auto">
            <Button color="primary" onClick={this.toggle}>
              <FontAwesomeIcon icon="plus" />
            </Button>
            <NewProductFormModal isOpen={this.state.modal} toggle={this.toggle} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Catalog;
