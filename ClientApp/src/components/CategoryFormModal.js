import React, { Component } from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import api from '../api';
import PageError from './PageError';

class CategoryFormModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      dropdownOpen: false,
      selectedUnit: 'mL',
      form: {
        volume: '',
        container: 'Lata',
        units: 12,
        description: '',
        brief: '',
        isReturnable: false
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.category && this.props.category) {
      const category = this.props.category;
      const splitVolume = /^([0-9]+[.]?[0-9]*)(.+)$/.exec(category.volume);
      this.setState({
        form: {
          volume: splitVolume[1],
          container: category.container,
          units: category.units,
          description: category.description,
          brief: category.brief,
          isReturnable: category.isReturnable
        },
        selectedUnit: splitVolume[2]
      });
    }

    if (!this.props.category && prevProps.category) {
      this.clearForm();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const form = this.state.form;
    form.volume = `${form.volume}${this.state.selectedUnit}`;
    if (!form.description) {
      form.description = `${form.volume} ${form.container.toLowerCase()} ${form.units} unidades`;
    }
    if (!form.brief) {
      form.brief = form.volume;
    }
    try {
      if (this.props.category) {
        await api.categories.update(this.props.category.id, form);
      } else {
        await api.categories.create(form);
      }
      this.clearForm();
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

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  clearForm = () => {
    this.setState({
      form: {
        volume: '',
        container: 'Lata',
        units: 12,
        description: '',
        brief: '',
        isReturnable: false
      },
      selectedUnit: 'mL'
    });
  };

  closeError = () => {
    this.props.toggle();
    this.clearForm();
  };

  clearError = e => {
    e.preventDefault();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <Modal isOpen={this.props.isOpen} toggle={this.closeError} className={this.props.className}>
          <ModalHeader toggle={this.closeError} />
          <ModalBody>
            <PageError error={this.state.error} inline />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.clearError}>
              Reintentar
            </Button>{' '}
            <Button color="secondary" onClick={this.closeError}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
    const form = this.state.form;
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className} autoFocus={false}>
        <ModalHeader toggle={this.props.toggle}>
          {this.props.category && 'Editar presentación'}
          {!this.props.category && 'Nueva presentación'}
        </ModalHeader>
        <ModalBody>
          <Form id="new-category" onSubmit={this.handleSubmit}>
            <FormGroup row className="text-right">
              <Label for="volume" xs={4} sm={3}>
                Volúmen:
              </Label>
              <Col>
                <InputGroup>
                  <Input
                    type="text"
                    pattern="[0-9.]+"
                    id="volume"
                    name="volume"
                    className="text-right"
                    value={form.volume}
                    onChange={this.handleFormChange}
                    autoFocus
                  />
                  <InputGroupButtonDropdown
                    addonType="append"
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropDown}
                  >
                    <DropdownToggle caret color="light" className="border">
                      {this.state.selectedUnit}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => this.setState({ selectedUnit: 'mL' })}>mL</DropdownItem>
                      <DropdownItem onClick={() => this.setState({ selectedUnit: 'L' })}>L</DropdownItem>
                      <DropdownItem onClick={() => this.setState({ selectedUnit: 'oz' })}>oz</DropdownItem>
                    </DropdownMenu>
                  </InputGroupButtonDropdown>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="container" xs={4} sm={3}>
                Empaque:
              </Label>
              <Col>
                <Input
                  type="select"
                  id="container"
                  name="container"
                  value={form.container}
                  onChange={this.handleFormChange}
                >
                  <option>Lata</option>
                  <option>Botella plástica</option>
                  <option>Botella de vidrio</option>
                  <option>Tetrapack</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="units" xs={4} sm={3}>
                Unidades:
              </Label>
              <Col>
                <Input type="number" id="units" name="units" value={form.units} onChange={this.handleFormChange} />
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="description" xs={4} sm={3}>
                Descripción:
              </Label>
              <Col>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={this.handleFormChange}
                  placeholder={`${form.volume}${this.state.selectedUnit} ${form.container.toLowerCase()} ${
                    form.units
                  } unidades`}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="text-right">
              <Label for="brief" xs={4} sm={3}>
                Corto:
              </Label>
              <Col>
                <Input
                  type="text"
                  id="brief"
                  name="brief"
                  value={form.brief}
                  onChange={this.handleFormChange}
                  placeholder={`${form.volume}${this.state.selectedUnit}`}
                />
              </Col>
            </FormGroup>
            <FormGroup row check className="justify-content-center">
              <Label for="is-returnable" check xs="auto">
                <Input
                  type="checkbox"
                  id="is-returnable"
                  name="isReturnable"
                  checked={form.isReturnable}
                  onChange={this.handleFormChange}
                />
                Retornable
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" form="new-category" color="primary">
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

export default CategoryFormModal;
