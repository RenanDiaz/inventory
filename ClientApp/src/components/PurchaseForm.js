import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProductsModal from './ProductsModal';
import api from '../api';
import PageError from './PageError';

class PurchaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: {
        orderDate: new Date(),
        deliveryDate: new Date(),
        products: [],
        purchaseTotal: 0
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const form = this.state.form;
    let purchaseTotal = 0;
    for (const product of form.products) {
      if (product.quantity) {
        purchaseTotal += product.quantity * product.cost;
      }
    }
    if (form.purchaseTotal !== purchaseTotal) {
      form.purchaseTotal = purchaseTotal;
      this.setState({ form });
    }
  }

  handleOrderDateChange = e => {
    const form = this.state.form;
    form.orderDate = e;
    this.setState({ form });
  };

  handleDeliveryDateChange = e => {
    const form = this.state.form;
    form.deliveryDate = e;
    this.setState({ form });
  };

  toggleProductsModal = () => {
    const modal = !this.state.modal;
    this.setState({ modal });
  };

  dismissError = () => {
    this.setState({ error: null });
  };

  addSelectedProducts = newProducts => {
    const form = this.state.form;
    form.products = form.products
      .concat(newProducts.filter(product => !form.products.includes(product)))
      .sort((a, b) => a.id - b.id);
    this.setState({ form });
  };

  handleQuantityChange = (e, index) => {
    const form = this.state.form;
    form.products[index].quantity = e.target.value === '' ? e.target.value : Number(e.target.value);
    this.setState({ form });
  };

  handleFocus = e => e.target.select();

  handleSubmit = async e => {
    e.preventDefault();
    if (e.target.id !== 'new-purchase') return;
    const form = this.state.form;
    try {
      let errorMessages = [];
      if (form.products.length < 1) {
        errorMessages.push('No se puede ingresar una compra sin productos.');
      }
      for (const product of form.products) {
        if (!product.quantity || product.quantity < 1) {
          errorMessages.push(`El producto ${product.name} ${product.category.brief} tiene una cantidad inválida.`);
        }
      }
      if (errorMessages.length > 0) {
        throw new Error(errorMessages.join('\n'));
      }
      await api.purchases.create(form);
      this.props.history.push('/purchases');
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const form = this.state.form;
    return (
      <div className="content">
        <h4>Nueva compra</h4>
        <PageError modal error={this.state.error} toggle={this.dismissError} />
        <Form id="new-purchase" onSubmit={this.handleSubmit}>
          <Row className="justify-content-center text-right mb-3">
            <Col xs={12} sm="auto">
              <Row>
                <Label for="name" xs={5} sm="auto">
                  Fecha del pedido:
                </Label>
                <Col xs="auto">
                  <DatePicker
                    className="form-control"
                    selected={form.orderDate}
                    onChange={this.handleOrderDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </Col>
              </Row>
            </Col>
            <div className="w-100 d-sm-none my-1" />
            <Col xs={12} sm="auto">
              <Row>
                <Label for="short-name" xs={5} sm="auto">
                  Fecha de entrega:
                </Label>
                <Col xs="auto">
                  <DatePicker
                    className="form-control"
                    selected={form.deliveryDate}
                    onChange={this.handleDeliveryDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Card className="mb-5">
            <CardBody className="py-1">
              <CardTitle className="mb-0">
                <Row className="justify-content-between align-items-center">
                  <Col xs="auto">Productos</Col>
                  <Col xs="auto">
                    <Button color="primary" onClick={this.toggleProductsModal}>
                      <FontAwesomeIcon icon="plus" />
                    </Button>
                    <ProductsModal
                      isOpen={this.state.modal}
                      toggle={this.toggleProductsModal}
                      addSelectedProducts={this.addSelectedProducts}
                    />
                  </Col>
                </Row>
              </CardTitle>
            </CardBody>
            <CardBody className="pt-0">
              <Row className="text-center font-weight-bold border-bottom py-2 d-none d-sm-block">
                <Col xs={3} className="text-truncate">
                  Nombre
                </Col>
                <Col xs={3} className="text-truncate">
                  Presentación
                </Col>
                <Col xs={2} className="text-truncate">
                  Costo
                </Col>
                <Col xs={2} className="text-truncate">
                  Cantidad
                </Col>
                <Col xs={2} className="text-truncate">
                  Total
                </Col>
              </Row>
              {form.products.length < 1 && (
                <Row className="justify-content-center py-2">
                  <Col xs="auto" className="text-center">
                    No hay productos registrados para esta compra.
                    <br />
                    Presiona el botón de <b>+</b> para agregarlos.
                  </Col>
                </Row>
              )}
              {form.products.map((product, index) => {
                return (
                  <React.Fragment key={index}>
                    <Row className="align-items-center border-bottom py-2 d-sm-none">
                      <Col>
                        <Row>
                          <Col>{product.shortName}</Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="text-muted small">{product.category.brief}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="auto" className="px-0 lh-0">
                        {product.category.isReturnable && <FontAwesomeIcon icon="exchange-alt" />}
                        {!product.category.isReturnable && (
                          <span className="fa-stack fa-1x">
                            <FontAwesomeIcon icon="exchange-alt" className="fa-stack-1x m-0" />
                            <FontAwesomeIcon icon="slash" className="fa-stack-1x m-0" />
                          </span>
                        )}
                      </Col>
                      <Col xs="3">
                        <Input
                          value={product.quantity}
                          type="text"
                          pattern="\d*"
                          className="text-right"
                          onChange={e => this.handleQuantityChange(e, index)}
                          onFocus={this.handleFocus}
                        />
                      </Col>
                    </Row>
                    <Row className="border-bottom py-2 d-none d-sm-block">
                      <Col xs={3} className="text-truncate">
                        {product.shortName}
                      </Col>
                      <Col xs={3} className="text-truncate">
                        {product.category.brief}
                      </Col>
                      <Col xs={2} className="text-right">
                        <NumberFormat
                          value={product.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          value={product.quantity}
                          type="number"
                          onChange={e => this.handleQuantityChange(e, index)}
                          className="text-right"
                        />
                      </Col>
                      <Col xs={2} className="text-right">
                        <NumberFormat
                          value={product.quantity * product.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              })}
            </CardBody>
          </Card>
        </Form>
        <div className="fixed-bottom bg-white">
          <Container>
            <Row className="justify-content-end my-1 font-weight-bold">
              <Label xs="auto">Total:</Label>
              <Label xs="auto">
                <NumberFormat
                  value={form.purchaseTotal}
                  displayType={'text'}
                  prefix={'$'}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Label>
              <Col xs="auto">
                <Button type="submit" color="primary" form="new-purchase">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default PurchaseForm;
