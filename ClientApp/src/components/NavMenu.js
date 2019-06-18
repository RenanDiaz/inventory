import React, { Component } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './styles/NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      productsDropdownIsOpen: false,
      accountingDropdownIsOpen: false
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  forceCollapseNavbar = () => {
    this.setState({
      collapsed: true
    });
  };

  toggleProductsDropdown = () => {
    this.setState({
      productsDropdownIsOpen: !this.state.productsDropdownIsOpen
    });
  };

  toggleAccountingDropdown = () => {
    this.setState({
      accountingDropdownIsOpen: !this.state.accountingDropdownIsOpen
    });
  };

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm bg-white border-bottom fixed-top" light>
          <Container>
            <NavbarBrand tag={Link} to="/">
              Inventario
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    active={window.location.pathname === '/'}
                    onClick={this.forceCollapseNavbar}
                  >
                    Inicio
                  </NavLink>
                </NavItem>
                <Dropdown
                  nav
                  isOpen={this.state.productsDropdownIsOpen}
                  toggle={this.toggleProductsDropdown}
                  active={window.location.pathname.includes('/products')}
                >
                  <DropdownToggle nav caret>
                    Productos
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      tag={Link}
                      to="/products/catalog"
                      active={window.location.pathname === '/products/catalog'}
                      onClick={this.forceCollapseNavbar}
                    >
                      Catálogo
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown
                  nav
                  isOpen={this.state.accountingDropdownIsOpen}
                  toggle={this.toggleAccountingDropdown}
                  active={window.location.pathname.includes('/accounting')}
                >
                  <DropdownToggle nav caret>
                    Contabilidad
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      tag={Link}
                      to="/accounting/cash"
                      active={window.location.pathname === '/accounting/cash'}
                      onClick={this.forceCollapseNavbar}
                    >
                      Desglose de efectivo
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/orders"
                    active={window.location.pathname.includes('/orders')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Pedidos
                  </NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
