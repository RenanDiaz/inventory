import React, { Component } from 'react';
import { Row, Col, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PageError from '../components/PageError';
import classnames from 'classnames';
import api from '../api';
import './styles/ProductsModal.css';

class ProductsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      products: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ error: null });
    try {
      const products = await api.products.list();
      for (const product of products) {
        product.isSelected = false;
        product.quantity = '';
      }
      this.setState({ products });
    } catch (error) {
      this.setState({ error });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const products = this.state.products.filter(product => product.isSelected);
    this.props.addSelectedProducts(products);
    this.props.toggle();
  };

  toggleSelect = index => {
    const products = this.state.products;
    const selectedProduct = products[index];
    if (selectedProduct.isSelected) {
      selectedProduct.isSelected = false;
    } else {
      selectedProduct.isSelected = true;
    }
    this.setState({ products, selectedProduct, modal: true });
  };

  clearForm = () => {
    this.fetchData();
  };

  closeError = () => {
    this.props.toggle();
    this.clearForm();
  };

  clearError = e => {
    e.preventDefault();
    this.setState({ error: null });
  };

  render() {
    if (this.props.isOpen && this.state.error) {
      return (
        <Modal isOpen={this.props.isOpen} toggle={this.closeError} className={this.props.className}>
          <ModalHeader toggle={this.closeError} />
          <ModalBody>
            <PageError error={this.state.error} inline />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.clearError}>
              Reintentar
            </Button>{' '}
            <Button color="secondary" onClick={this.closeError}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Agregar productos</ModalHeader>
          <ModalBody className="py-0">
            <Form id="add-products-form" onSubmit={this.handleSubmit}>
              <Row className="text-center font-weight-bold border-bottom py-2">
                <Col xs={5} className="text-truncate">
                  Nombre
                </Col>
                <Col xs={5} className="text-truncate">
                  Presentación
                </Col>
                <Col xs={2} className="text-truncate">
                  Ret.
                </Col>
              </Row>
              <Row className="products-modal-table-container">
                <Col>
                  {this.state.products.length < 1 && (
                    <Row className="justify-content-center py-3">
                      <Col xs="auto">No hay productos registrados</Col>
                    </Row>
                  )}
                  {this.state.products.map((value, index) => {
                    return (
                      <Row
                        key={value.id}
                        className={classnames('border-bottom py-2 product-column', {
                          active: value.isSelected
                        })}
                        onClick={() => this.toggleSelect(index)}
                      >
                        <Col xs={5}>{value.shortName}</Col>
                        <Col xs={5}>{value.category.brief}</Col>
                        <Col xs={2}>{value.category.isReturnable ? 'Sí' : 'No'}</Col>
                      </Row>
                    );
                  })}
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" form="add-products-form">
              Agregar
            </Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ProductsModal;
