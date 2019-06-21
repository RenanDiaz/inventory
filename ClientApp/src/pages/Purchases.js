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
        <Row className="d-md-none mobile-table-container">
          <Col>
            {this.state.purchases.length < 1 && (
              <Row className="justify-content-center py-3">
                <Col xs="auto">No hay compras registradas</Col>
              </Row>
            )}
            {this.state.purchases.map((value, index) => {
              return (
                <Row
                  key={value.id}
                  className={classnames('align-items-center border-bottom', { active: value.isSelected })}
                  onClick={() => this.select(index)}
                >
                  <Col xs={2} className="text-center font-weight-bold">
                    {value.code}
                  </Col>
                  <Col>
                    <Row>
                      <Col className="text-truncate">{value.name}</Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className="text-muted small">{value.category.brief}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs="auto" className="text-right">
                    <Row>
                      <Col className="small lh-1">
                        <NumberFormat
                          value={value.price}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="small lh-1">
                        <NumberFormat
                          value={value.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                          className="text-muted"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="small lh-1">
                        <NumberFormat
                          value={value.price - value.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs="auto" className="px-0 lh-0">
                    {value.category.isReturnable && <FontAwesomeIcon icon="exchange-alt" />}
                    {!value.category.isReturnable && (
                      <span className="fa-stack fa-1x">
                        <FontAwesomeIcon icon="exchange-alt" className="fa-stack-1x m-0" />
                        <FontAwesomeIcon icon="slash" className="fa-stack-1x m-0" />
                      </span>
                    )}
                  </Col>
                  <Col xs="auto" className="text-muted">
                    <FontAwesomeIcon icon="angle-right" />
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
        <Row className="d-none d-md-block">
          <Col>
            <div className="fixed-top bg-white products-table-head">
              <Container>
                <Row className="text-center justify-content-center font-weight-bold border-bottom py-2">
                  <Col xs={2} className="text-truncate">
                    Fecha
                  </Col>
                  <Col xs={3} className="text-truncate">
                    Proveedor
                  </Col>
                  <Col xs={2} className="text-truncate">
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
                {this.state.purchases.map((value, index) => {
                  return (
                    <Row
                      key={value.id}
                      className={classnames('border-bottom py-2 product-column', {
                        active: value.isSelected
                      })}
                      onClick={() => this.select(index)}
                    >
                      <Col xs={1} className="font-weight-bold">
                        {value.code}
                      </Col>
                      <Col xs={3}>{value.name}</Col>
                      <Col xs={2}>{value.shortName}</Col>
                      <Col xs={2}>{value.category.brief}</Col>
                      <Col xs={1} className="text-right">
                        <NumberFormat
                          value={value.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                      <Col xs={1} className="text-right">
                        <NumberFormat
                          value={value.price}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                      <Col xs={1} className="text-right">
                        <NumberFormat
                          value={value.price - value.cost}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Col>
                      <Col xs={1}>{value.category.isReturnable ? 'Sí' : 'No'}</Col>
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
