import React, { Component } from 'react';
import { Form, Row, Col, Input, Container, Label, Button } from 'reactstrap';
import NumberFormat from 'react-number-format';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import api from '../api';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      items: undefined,
      sale: 0
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const items = await api.items.list();
      for (const item of items) {
        item.oldQuantity = item.quantity;
        item.quantity = '';
      }
      this.setState({ loading: false, items });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const items = this.state.items;
    if (!items) return;
    let sale = 0;
    for (const item of items) {
      const soldItems = item.oldQuantity - item.quantity;
      sale = (sale * 100 + soldItems * (item.product.cost * 100)) / 100;
    }
    if (this.state.sale !== sale) {
      this.setState({ sale });
    }
  }

  handleFocus = e => e.target.select();

  handleQuantityChange = (e, index) => {
    const items = this.state.items;
    items[index].quantity = e.target.value === '' ? e.target.value : Number(e.target.value);
    this.setState({ items });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (e.target.id !== 'new-sale') return;
    const items = this.state.items;
    try {
      const sale = await api.sales.create({ date: new Date(), total: this.state.sale });
      for (const item of items) {
        if (item.quantity === '') item.quantity = 0;
        await api.items.update(item.id, {
          categoryId: item.categoryId,
          productId: item.productId,
          quantity: item.quantity
        });
        const soldItems = item.oldQuantity - item.quantity;
        if (soldItems > 0) {
          await api.soldProducts.create({
            categoryId: item.categoryId,
            productId: item.productId,
            quantity: soldItems,
            saleId: sale.id
          });
        }
      }
      this.fetchData();
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    if (this.state.loading && !this.state.items) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }

    const items = this.state.items;
    return (
      <div className="content">
        <Form id="new-sale" onSubmit={this.handleSubmit}>
          {items.map((item, index) => {
            if (item.oldQuantity < 1) return null;
            return (
              <Row key={item.id} className="align-items-center border-bottom py-2 d-sm-none">
                <Col>
                  <Row>
                    <Col className="text-truncate">{item.product.shortName}</Col>
                  </Row>
                  <Row>
                    <Col className="text-truncate">
                      <span className="text-muted small">{item.category.brief}</span>
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto" className="text-right px-0">
                  <NumberFormat value={item.oldQuantity} displayType={'text'} thousandSeparator />
                </Col>
                <Col xs="3">
                  <Input
                    value={item.quantity}
                    type="text"
                    pattern="\d*"
                    className="text-right"
                    onChange={e => this.handleQuantityChange(e, index)}
                    onFocus={this.handleFocus}
                  />
                </Col>
                <Col xs={2} className="text-right pl-0">
                  <NumberFormat value={item.oldQuantity - item.quantity} displayType={'text'} thousandSeparator />
                </Col>
              </Row>
            );
          })}
        </Form>
        <div className="fixed-bottom bg-white">
          <Container>
            <Row className="justify-content-between my-1 font-weight-bold">
              <Col xs="auto">
                <Row className="no-gutters">
                  <Label xs="auto">Venta total:</Label>
                  <Label xs="auto" className="pl-3 bigger">
                    <NumberFormat
                      value={this.state.sale}
                      displayType={'text'}
                      prefix={'$'}
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </Label>
                </Row>
              </Col>
              <Col xs="auto">
                <Button type="submit" color="primary" form="new-sale">
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

export default Home;
