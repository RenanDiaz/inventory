import React, { Component } from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductFormModal from '../components/ProductFormModal';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';
import api from '../api';
import './styles/Catalog.css';

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      products: undefined,
      selectedProduct: undefined,
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
      for (const product of products) {
        product.isSelected = false;
      }
      this.setState({ loading: false, products, selectedProduct: undefined });
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

  select = index => {
    const products = this.state.products;
    for (const product of products) {
      product.isSelected = false;
    }
    const selectedProduct = products[index];
    selectedProduct.isSelected = true;
    this.setState({ products, selectedProduct, modal: true });
  };

  render() {
    if (this.state.loading && !this.state.products) {
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
                <h4 className="mb-0">Catálogo de productos</h4>
              </Col>
              <Col xs="auto">
                <Button color="primary" onClick={this.toggle}>
                  <FontAwesomeIcon icon="plus" />
                </Button>
                <ProductFormModal isOpen={this.state.modal} toggle={this.toggle} product={this.state.selectedProduct} />
              </Col>
            </Row>
          </Container>
        </div>
        <Row className="d-md-none mobile-table-container">
          <Col>
            {this.state.products.map((value, index) => {
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
                <Row className="text-center font-weight-bold border-bottom py-2">
                  <Col xs={1} className="text-truncate">
                    Código
                  </Col>
                  <Col xs={3} className="text-truncate">
                    Nombre
                  </Col>
                  <Col xs={2} className="text-truncate">
                    Nombre corto
                  </Col>
                  <Col xs={2} className="text-truncate">
                    Presentación
                  </Col>
                  <Col xs={1} className="text-truncate">
                    Costo
                  </Col>
                  <Col xs={1} className="text-truncate">
                    Precio
                  </Col>
                  <Col xs={1} className="text-truncate">
                    Gan.
                  </Col>
                  <Col xs={1} className="text-truncate">
                    Ret.
                  </Col>
                </Row>
              </Container>
            </div>
            <Row className="desktop-table-container">
              <Col>
                {this.state.products.map((value, index) => {
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

export default Catalog;
