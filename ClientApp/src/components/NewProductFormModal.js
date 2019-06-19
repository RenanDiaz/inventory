import React, { Component } from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import NumberFormat from 'react-number-format';
import api from '../api';

class NewProductFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      form: {
        code: '',
        name: '',
        shortName: '',
        categoryId: '',
        isReturnable: false,
        cost: 0,
        price: 0
      },
      categories: []
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
      this.setState({ loading: false, categories });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const form = this.state.form;
    if (!form.shortName) {
      form.shortName = form.name;
    }
    try {
      await api.products.create(form);
      form.code = '';
      form.name = '';
      form.shortName = '';
      form.categoryId = '';
      form.returnable = false;
      form.cost = 0;
      form.cost = 0;
      this.setState({ form });
      this.props.toggle();
    } catch (error) {
      this.setState({ error });
    }
  };

  handleFormChange = e => {
    const form = this.state.form;
    form[e.target.name] =
      e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value;
    this.setState({ form });
  };

  render() {
    const form = this.state.form;
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className} autoFocus={false}>
        <ModalHeader toggle={this.props.toggle}>Nuevo producto</ModalHeader>
        <ModalBody>
          <Form id="new-product" onSubmit={this.handleSubmit}>
            <FormGroup row className="text-right">
              <Label for="code" xs={5} sm={4}>
                Código:
              </Label>
              <Col xs={4}>
                <Input
                  type="text"
                  pattern="\d*"
                  id="code"
                  name="code"
                  value={form.code}
                  onChange={this.handleFormChange}
                  autoFocus
                />
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="name" xs={5} sm={4}>
                Nombre:
              </Label>
              <Col>
                <Input type="text" id="name" name="name" value={form.name} onChange={this.handleFormChange} />
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="short-name" xs={5} sm={4}>
                Nombre corto:
              </Label>
              <Col>
                <Input
                  type="text"
                  id="short-name"
                  name="shortName"
                  value={form.shortName}
                  onChange={this.handleFormChange}
                  placeholder={form.name}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="category-id" xs={5} sm={4}>
                Presentación:
              </Label>
              <Col>
                <Input
                  type="select"
                  id="category-id"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={this.handleFormChange}
                >
                  {this.state.categories.map(value => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.description}
                      </option>
                    );
                  })}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="cost" xs={5} sm={4}>
                Costo:
              </Label>
              <Col xs={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                  <Input
                    type="number"
                    id="cost"
                    name="cost"
                    className="text-right"
                    value={form.cost}
                    onChange={this.handleFormChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="price" xs={5} sm={4}>
                Precio:
              </Label>
              <Col xs={4}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    className="text-right"
                    value={form.price}
                    onChange={this.handleFormChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label xs={5} sm={4}>
                Ganancia:
              </Label>
              <Label xs="auto">
                <NumberFormat
                  value={form.price - form.cost}
                  displayType={'text'}
                  prefix={'$'}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Label>
            </FormGroup>
            <FormGroup row check className="justify-content-center">
              <Label for="is-returnable" check xs="auto">
                <Input
                  type="checkbox"
                  id="is-returnable"
                  name="isReturnable"
                  value={form.isReturnable}
                  onChange={this.handleFormChange}
                />
                Retornable
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" form="new-product" color="primary">
            Guardar
          </Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default NewProductFormModal;
