import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import NumberFormat from 'react-number-format';

class Cash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checks: {
        count: 4,
        amount: 3104
      },
      paper: [
        { name: 'one-hundred', value: 100, count: 0 },
        { name: 'fifty', value: 50, count: 0 },
        { name: 'twenty', value: 20, count: 128 },
        { name: 'ten', value: 10, count: 17 },
        { name: 'five', value: 5, count: 67 },
        { name: 'one', value: 1, count: 31 }
      ],
      coins: [
        { name: 'dollar-coin', value: 1, count: 100 },
        { name: 'fifty-coin', value: 0.5, count: 0 },
        { name: 'twentyfive-coin', value: 0.25, count: 360 },
        { name: 'ten-coin', value: 0.1, count: 300 },
        { name: 'five-coin', value: 0.05, count: 160 },
        { name: 'one-coin', value: 0.01, count: 100 }
      ]
    };
  }

  multiply = (number, multiplier) => (number * multiplier).toFixed(2);

  total = (checks, papers, coins) => {
    let totalPaper = 0;
    for (const paper of papers) {
      totalPaper += paper.count * paper.value;
    }
    let totalCoins = 0;
    for (const coin of coins) {
      totalCoins += coin.count * coin.value;
    }
    return checks.amount + totalPaper + totalCoins;
  };

  handleCheckCountChange = e => {
    const checks = this.state.checks;
    checks.count = e.target.value;
    this.setState({ checks });
  };

  handleCheckAmountChange = e => {
    const checks = this.state.checks;
    checks.amount = e.target.value;
    this.setState({ checks });
  };

  handlePaperCountChange = e => {
    const paper = this.state.paper;
    const index = e.target.getAttribute('data-index');
    paper[index].count = e.target.value;
    this.setState({ paper });
  };

  handleCoinsCountChange = e => {
    const coins = this.state.coins;
    const index = e.target.getAttribute('data-index');
    coins[index].count = e.target.value;
    this.setState({ coins });
  };

  render() {
    const checks = this.state.checks;
    const paper = this.state.paper;
    const coins = this.state.coins;
    return (
      <div className="content">
        <h4>Desglose de efectivo</h4>
        <Row className="justify-content-around">
          <Col xs={12} sm={6} md={4} lg={3} xl={2} className="text-center">
            <h5>Hoy</h5>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col>
            <Form>
              <FormGroup row className="justify-content-center text-right">
                <Label xs={3} sm={2} md={2} lg={2} xl={1}>
                  Cheques
                </Label>
                <Col xs={3} sm={2} md={2} lg={2} xl={1}>
                  <Input
                    type="number"
                    className="text-right"
                    name="check-q"
                    value={checks.count}
                    onChange={this.handleCheckCountChange}
                  />
                </Col>
                <Col xs={3} sm={3} md={2} lg={2} xl={2}>
                  <Input
                    type="number"
                    className="text-right"
                    name="check"
                    value={checks.amount.toFixed(2)}
                    onChange={this.handleCheckAmountChange}
                  />
                </Col>
              </FormGroup>
              <h5>Papel moneda</h5>
              <hr />
              {paper.map((value, index) => {
                return (
                  <FormGroup row className="justify-content-center text-right" key={index}>
                    <Label for={value.name} xs={3} sm={2} md={2} lg={2} xl={1}>
                      <NumberFormat
                        value={value.value}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </Label>
                    <Col xs={3} sm={2} md={2} lg={2} xl={1}>
                      <Input
                        type="number"
                        className="text-right"
                        name={value.name}
                        id={value.name}
                        value={value.count}
                        data-index={index}
                        onChange={this.handlePaperCountChange}
                      />
                    </Col>
                    <Label for={value.name} xs={3} sm={3} md={2} lg={2} xl={2}>
                      <NumberFormat
                        value={this.multiply(value.count, value.value)}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </Label>
                  </FormGroup>
                );
              })}
              <h5>Monedas</h5>
              <hr />
              {coins.map((value, index) => {
                return (
                  <FormGroup row className="justify-content-center text-right" key={index}>
                    <Label for={value.name} xs={3} sm={2} md={2} lg={2} xl={1}>
                      <NumberFormat
                        value={value.value}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </Label>
                    <Col xs={3} sm={2} md={2} lg={2} xl={1}>
                      <Input
                        type="number"
                        className="text-right"
                        name={value.name}
                        id={value.name}
                        value={value.count}
                        data-index={index}
                        onChange={this.handleCoinsCountChange}
                      />
                    </Col>
                    <Label for={value.name} xs={3} sm={3} md={2} lg={2} xl={2}>
                      <NumberFormat
                        value={this.multiply(value.count, value.value)}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </Label>
                  </FormGroup>
                );
              })}
              <h5>Total</h5>
              <hr />
              <FormGroup row className="justify-content-center text-right">
                <Label xs="auto">
                  <NumberFormat
                    value={this.total(checks, paper, coins)}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Label>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Cash;
