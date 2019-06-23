import React, { Component } from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import api from '../api';

class Purchases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      purchases: undefined
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const purchases = await api.purchases.list();
      for (const purchase of purchases) {
        purchase.isSelected = false;
      }
      this.setState({ loading: false, purchases });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    if (this.state.loading && !this.state.purchases) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }
    return (
      <div>
        <div className="fixed-top bg-white page-title">
          <Container>
            <Row className="py-2 border-bottom align-items-center">
              <Col>
                <h4 className="mb-0">Compras</h4>
              </Col>
              <Col xs="auto">
                <Button tag={Link} to={'/purchases/new'} color="primary">
                  <FontAwesomeIcon icon="plus" />
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
        <Row>
          <Col>
            <div className="fixed-top bg-white products-table-head">
              <Container>
                <Row className="text-center justify-content-center font-weight-bold border-bottom py-2">
                  <Col xs={3} className="text-truncate">
                    Fecha
                  </Col>
                  <Col xs={3} className="text-truncate">
                    Entrega
                  </Col>
                  <Col xs={3} className="text-truncate">
                    Total
                  </Col>
                </Row>
              </Container>
            </div>
            <Row className="desktop-table-container">
              <Col>
                {this.state.purchases.length < 1 && (
                  <Row className="justify-content-center py-3">
                    <Col xs="auto">No hay compras registradas</Col>
                  </Row>
                )}
                {this.state.purchases.map((purchase, index) => {
                  return (
                    <Row
                      key={purchase.id}
                      className={classnames('justify-content-center border-bottom py-2 product-column', {
                        active: purchase.isSelected
                      })}
                      onClick={() => this.select(index)}
                    >
                      <Col xs={3} className="text-center">
                        {new Date(purchase.orderDate).toLocaleDateString('es')}
                      </Col>
                      <Col xs={3} className="text-center">
                        {new Date(purchase.deliveryDate).toLocaleDateString('es')}
                      </Col>
                      <Col xs={3} className="text-right">
                        <NumberFormat
                          value={purchase.total}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Purchases;
