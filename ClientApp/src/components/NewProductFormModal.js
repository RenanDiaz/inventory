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
        presentation: '',
        isReturnable: false,
        cost: 0,
        price: 0
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const form = this.state.form;
    console.log({ form });
    try {
      api.products.create(form);
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

  gain = () => {
    const form = this.state.form;
    const cost = form.cost;
    const price = form.price;
    return price - cost;
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
                <Input type="" id="code" name="code" value={form.code} onChange={this.handleFormChange} autoFocus />
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
              <Label for="name" xs={5} sm={4}>
                Presentación:
              </Label>
              <Col>
                <Input
                  type="text"
                  id="presentation"
                  name="presentation"
                  value={form.presentation}
                  onChange={this.handleFormChange}
                />
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
                  value={this.gain()}
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
