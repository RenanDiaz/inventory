import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewProductFormModal from '../components/NewProductFormModal';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import NumberFormat from 'react-number-format';
import api from '../api';
import './styles/Catalog.css';

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      products: undefined,
      modal: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const products = await api.products.list();
      this.setState({ loading: false, products });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  toggle = () => {
    const modal = !this.state.modal;
    if (!modal) {
      this.fetchData();
    }
    this.setState({
      modal
    });
  };

  render() {
    if (this.state.loading && !this.state.data) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }
    return (
      <div>
        <Row className="pb-2 border-bottom">
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
        <Row className="d-md-none mobile-catalog-table-container">
          <Col>
            {this.state.products.map(value => {
              return (
                <Row key={value.id} className="align-items-center border-bottom">
                  <Col xs={2} className="text-center font-weight-bold">
                    {value.code}
                  </Col>
                  <Col>
                    <Row>
                      <Col className="text-truncate">{value.name}</Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className="text-muted small">{value.presentation}</span>
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
                    {value.isReturnable && <FontAwesomeIcon icon="exchange-alt" />}
                    {!value.isReturnable && (
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
            <Row className="text-center font-weight-bold border-bottom py-2">
              <Col xs={1}>Código</Col>
              <Col xs={3}>Nombre</Col>
              <Col xs={2}>Nombre corto</Col>
              <Col xs={2}>Presentación</Col>
              <Col xs={1}>Costo</Col>
              <Col xs={1}>Precio</Col>
              <Col xs={1}>Ganancia</Col>
              <Col xs={1}>Retornable</Col>
            </Row>
            <Row className="desktop-catalog-table-container">
              <Col>
                {this.state.products.map(value => {
                  return (
                    <Row key={value.id} className="border-top py-2">
                      <Col xs={1} className="font-weight-bold">
                        {value.code}
                      </Col>
                      <Col xs={3}>{value.name}</Col>
                      <Col xs={2}>{value.shortName}</Col>
                      <Col xs={2}>{value.presentation}</Col>
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
                      <Col xs={1}>{value.isReturnable ? 'Sí' : 'No'}</Col>
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

export default Catalog;
