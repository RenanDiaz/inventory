import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProductsModal from '../components/ProductsModal';
import PageError from '../components/PageError';
import api from '../api';

class NewPurchase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: {
        orderDate: new Date(),
        deliveryDate: new Date(),
        total: 0
      },
      products: []
    };

    this.items = [];
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      this.items = await api.items.list();
    } catch (error) {
      this.setState({ error });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const form = this.state.form;
    let total = 0;
    for (const product of this.state.products) {
      if (product.quantity) {
        total = (total * 100 + product.quantity * (product.cost * 100)) / 100;
      }
    }
    if (form.total !== total) {
      form.total = total;
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
    const products = this.state.products
      .concat(newProducts.filter(product => !this.state.products.includes(product)))
      .sort((a, b) => a.id - b.id)
      .filter(product => newProducts.includes(product));
    this.setState({ products });
  };

  handleQuantityChange = (e, index) => {
    const products = this.state.products;
    products[index].quantity = e.target.value === '' ? e.target.value : Number(e.target.value);
    this.setState({ products });
  };

  handleFocus = e => e.target.select();

  handleSubmit = async e => {
    e.preventDefault();
    if (e.target.id !== 'new-purchase') return;
    const form = this.state.form;
    try {
      let errorMessages = [];
      if (this.state.products.length < 1) {
        errorMessages.push('No se puede ingresar una compra sin productos.');
      }
      const products = this.state.products;
      for (const product of products) {
        if (!product.quantity || product.quantity < 1) {
          errorMessages.push(`El producto ${product.name} ${product.category.brief} tiene una cantidad inválida.`);
        }
      }
      if (errorMessages.length > 0) {
        throw new Error(errorMessages.join('\n'));
      }
      const purchase = await api.purchases.create(form);
      for (const product of products) {
        await api.purchasedProducts.create({
          quantity: product.quantity,
          productId: product.id,
          purchaseId: purchase.id
        });
        const filteredItems = this.items.filter(item => item.id === product.id);
        if (filteredItems.length > 0) {
          const item = filteredItems[0];
          item.quantity += product.quantity;
          await api.items.update(item.id, item);
        } else {
          await api.items.create({ quantity: product.quantity, productId: product.id });
        }
      }
      this.props.history.push('/purchases');
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const form = this.state.form;
    const products = this.state.products;
    return (
      <div className="content">
        <h4>Nueva compra</h4>
        <PageError modal error={this.state.error} toggle={this.dismissError} />
        <Form id="new-purchase" onSubmit={this.handleSubmit}>
          <Row className="justify-content-center text-right mb-3">
            <Col xs={12} sm={6} md="auto">
              <Row className="justify-content-between no-gutters">
                <Label xs={5} sm="auto">
                  Fecha del pedido:
                </Label>
                <Col xs="auto" sm={5} md={6} lg="auto" className="pl-lg-3">
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
            <Col xs={12} sm={6} md="auto">
              <Row className="justify-content-between no-gutters">
                <Label xs={5} sm="auto">
                  Fecha de entrega:
                </Label>
                <Col xs="auto" sm={5} md={6} lg="auto" className="pl-lg-3">
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
            <CardBody className="py-0">
              <Row className="text-center font-weight-bold border-bottom py-2 d-none d-sm-flex">
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
              {products.length < 1 && (
                <Row className="justify-content-center py-2">
                  <Col xs="auto" className="text-center">
                    No hay productos registrados para esta compra.
                    <br />
                    Presiona el botón de <b>+</b> para agregarlos.
                  </Col>
                </Row>
              )}
              {products.map((product, index) => {
                return (
                  <React.Fragment key={index}>
                    <Row className="align-items-center border-top py-2 d-sm-none">
                      <Col>
                        <Row>
                          <Col className="text-truncate">{product.shortName}</Col>
                        </Row>
                        <Row>
                          <Col className="text-truncate">
                            <span className="text-muted small">{product.category.brief}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs="auto" className="text-right px-0">
                        <NumberFormat
                          value={product.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
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
                      <Col xs={3} className="text-right pl-0">
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
                    <Row
                      className={classnames('align-items-center py-2 d-none d-sm-flex', {
                        'border-top': index > 0
                      })}
                    >
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
                  value={form.total}
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

export default NewPurchase;
