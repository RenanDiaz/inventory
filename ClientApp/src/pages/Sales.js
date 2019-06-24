import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import NumberFormat from 'react-number-format';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import { Link } from 'react-router-dom';
import api from '../api';

class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      sales: undefined
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const sales = await api.sales.list();
      this.setState({ loading: false, sales });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  render() {
    if (this.state.loading && !this.state.sales) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }
    return (
      <div className="">
        <div className="fixed-top bg-white page-title">
          <Container>
            <Row className="py-2 border-bottom align-items-center">
              <Col>
                <h4 className="mb-0">Ventas</h4>
              </Col>
              <Col xs="auto">
                <Button tag={Link} to={'/'} color="primary">
                  <FontAwesomeIcon icon="plus" />
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
        <Row>
          <Col>
            <div className="fixed-top bg-white mixed-table-head">
              <Container>
                <Row className="text-center justify-content-center font-weight-bold border-bottom py-2">
                  <Col xs={3} className="text-truncate">
                    Fecha
                  </Col>
                  <Col xs={4} className="text-truncate">
                    Total
                  </Col>
                </Row>
              </Container>
            </div>
            <Row className="mixed-table-container">
              <Col>
                {this.state.sales.length < 1 && (
                  <Row className="justify-content-center py-3">
                    <Col xs="auto">No hay ventas registradas</Col>
                  </Row>
                )}
                {this.state.sales.map((sale, index) => {
                  return (
                    <Row
                      key={sale.id}
                      className={classnames('justify-content-center border-bottom py-2 selectable-row', {
                        active: sale.isSelected
                      })}
                      onClick={() => this.select(index)}
                    >
                      <Col xs={3} className="text-center">
                        {new Date(sale.date).toLocaleDateString('es')}
                      </Col>
                      <Col xs={4} className="text-right">
                        <NumberFormat
                          value={sale.total}
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

export default Sales;
