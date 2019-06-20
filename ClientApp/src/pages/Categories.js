import React, { Component } from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryFormModal from '../components/CategoryFormModal';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import classnames from 'classnames';
import api from '../api';
import './styles/Categories.css';

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      categories: undefined,
      selectedCategory: undefined,
      modal: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const categories = await api.categories.list();
      for (const category of categories) {
        category.isSelected = false;
      }
      this.setState({ loading: false, categories, selectedCategory: undefined });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  toggle = () => {
    const modal = !this.state.modal;
    if (!modal) {
      this.fetchData();
    }
    this.setState({ modal });
  };

  select = index => {
    const categories = this.state.categories;
    for (const category of categories) {
      category.isSelected = false;
    }
    const selectedCategory = categories[index];
    selectedCategory.isSelected = true;
    this.setState({ categories, selectedCategory, modal: true });
  };

  render() {
    if (this.state.loading && !this.state.categories) {
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
                <h4 className="mb-0">Presentaciones</h4>
              </Col>
              <Col xs="auto">
                <Button color="primary" onClick={this.toggle}>
                  <FontAwesomeIcon icon="plus" />
                </Button>
                <CategoryFormModal
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  category={this.state.selectedCategory}
                />
              </Col>
            </Row>
          </Container>
        </div>
        <Row className="d-md-none mobile-table-container">
          <Col>
            {this.state.categories.map((value, index) => {
              return (
                <Row
                  key={value.id}
                  className={classnames('align-items-center border-bottom', { active: value.isSelected })}
                  onClick={() => this.select(index)}
                >
                  <Col>
                    <Row>
                      <Col className="text-truncate">{value.description}</Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className="text-muted small">{value.brief}</span>
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
            <div className="fixed-top bg-white products-table-head">
              <Container>
                <Row className="text-center justify-content-center font-weight-bold border-bottom py-2">
                  <Col xs={1}>Volúmen</Col>
                  <Col xs={2}>Empaque</Col>
                  <Col xs={1}>Unidades</Col>
                  <Col xs={4}>Descripción</Col>
                  <Col xs={3}>Corto</Col>
                  <Col xs={1}>Retornable</Col>
                </Row>
              </Container>
            </div>
            <Row className="desktop-table-container">
              <Col>
                {this.state.categories.map((value, index) => {
                  return (
                    <Row
                      key={value.id}
                      className={classnames('border-top py-2 justify-content-center category-column', {
                        active: value.isSelected
                      })}
                      onClick={() => this.select(index)}
                    >
                      <Col xs={1}>{value.volume}</Col>
                      <Col xs={2}>{value.container}</Col>
                      <Col xs={1} className="text-right">
                        {value.units}
                      </Col>
                      <Col xs={4} className="text-center">
                        {value.description}
                      </Col>
                      <Col xs={3} className="text-center">
                        {value.brief}
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

export default Categories;
