import React, { Component } from 'react';
import {
  AppBar,
  RaisedButton,
  Card,
  CardHeader,
  CardTitle,
  CardText,
  LeftNav,
  List,
  ListItem,
  MenuItem,
  TextField,
  Toggle
} from 'material-ui';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import { createStore } from 'redux';
var Latex = require('react-latex');

import { Provider, connect } from 'react-redux'

let actions = {
  RESET_ALL: 'RESET_ALL',
  CHANGE_COPRIMES: 'CHANGE_COPRIMES',
  CHANGE_COPRIME: 'CHANGE_COPRIME',
  FLIP_AGENT: 'FLIP_AGENT',
  CHANGE_SECRET: 'CHANGE_SECRET'
}
const style = {
  margin: 12,
};

const leftCardStyle = {
  marginBottom: 20
}

const stageStyle = {
  marginLeft: 400,
}

const centerStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center"
}

let defaultState = {
  coPrimes: [5, 9, 11, 14, 17],
  agents: [true, true, true, true, true],
  secret: 300,
}

function gcd(a, b) {
  if (b == 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function xgcd(a, b) {
  if (b == 0) {
    return [1, 0, a];
  } else {
    var temp = xgcd(b, a % b);
    var x =
      temp[0];
    var y = temp[1];
    var d = temp[2];
    return [y, x - y * Math.floor(a / b), d];
  }
}
function agentsActions(state = [], action) {
  switch (action.type) {
    case actions.FLIP_AGENT:
      let agentsCopy = state.slice(0);
      agentsCopy[action.pos] = !agentsCopy[action.pos]
      return agentsCopy;
    default:
      return state;
  }
}
function coPrimesActions(state = [], action) {
  switch (action.type) {
    case actions.CHANGE_COPRIMES:
      return action.coPrimes;
    case actions.CHANGE_COPRIME:
      let coPrimesCopy = state.slice(0);
      if (isNaN(action.value)) {
        action.value = 0;
      }
      coPrimesCopy[action.pos] = action.value;
      return coPrimesCopy;
    default:
      return state;
  }
}

function actionReducer(state = defaultState, action) {
  switch (action.type) {
    case actions.RESET_ALL:
      return defaultState;

    case actions.CHANGE_COPRIMES:
    case actions.CHANGE_COPRIME:
      return Object.assign({}, state, {
        coPrimes: coPrimesActions(state.coPrimes, action)
      });

    case actions.FLIP_AGENT:
      return Object.assign({}, state, {
        agents: agentsActions(state.agents, action)
      });

    case actions.CHANGE_SECRET:
      return Object.assign({}, state, {
        secret: action.secret
      });

    default:
      return state;
  }
}

let store = createStore(actionReducer);

function bindPrime(pos, event, value) {
  state.coPrimes[pos] = parseInt(value);
}

class Configuration extends Component {

  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => {
      this.setState(store.getState());
    })
  }
  render() {
    let coPrimes = this.state.coPrimes;
    return (
      <Card style={leftCardStyle}>
        <CardTitle title="Configuration" subtitle="Configure your secret here." />
        <CardText>
          <TextField
            floatingLabelText="Co-Prime 1"
            hintText="3"
            value={coPrimes[0]}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_COPRIME, pos: 0, value: parseInt(e.target.value) }) } }
            /><br/>
          <TextField
            floatingLabelText="Co-Prime 2"
            hintText="5"
            value={coPrimes[1]}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_COPRIME, pos: 1, value: parseInt(e.target.value) }) } }
            /><br/>
          <TextField
            floatingLabelText="Co-Prime 3"
            hintText="7"
            value={coPrimes[2]}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_COPRIME, pos: 2, value: parseInt(e.target.value) }) } }
            /><br/>
          <TextField
            floatingLabelText="Co-Prime 4"
            hintText="14"
            value={coPrimes[3]}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_COPRIME, pos: 3, value: parseInt(e.target.value) }) } }
            /><br/>
          <TextField
            floatingLabelText="Co-Prime 5"
            hintText="17"
            value={coPrimes[4]}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_COPRIME, pos: 4, value: parseInt(e.target.value) }) } }
            /><br/>
          <TextField
            floatingLabelText="Secret"
            hintText="300"
            value={this.state.secret}
            onChange={(e) => { store.dispatch({ type: actions.CHANGE_SECRET, secret: parseInt(e.target.value) }) } }
            /><br/>
        </CardText>
      </Card>
    );
  }
}

class AgentList extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => {
      this.setState(store.getState());
    });
    this.getDesctiption = this.getDesctiption.bind(this);
  }
  getDesctiption() {
    let agents = this.state.agents;
    let active = agents.filter(v => v).length;
    let inactive = agents.length - active;
    return "Active: " + active + ", Inactive: " + inactive + ".";
  };
  render() {
    let agents = this.state.agents;
    return (
      <Card style={leftCardStyle}>
        <CardTitle title="Agents" subtitle={this.getDesctiption() } />
        <CardText>
          <List>
            <ListItem primaryText="Alice" rightToggle={
              <Toggle toggled={agents[0]}
                onToggle={() => { store.dispatch({ type: actions.FLIP_AGENT, pos: 0 }) } }/>
            } />
            <ListItem primaryText="Bob" rightToggle={
              <Toggle toggled={agents[1]}
                onToggle={() => { store.dispatch({ type: actions.FLIP_AGENT, pos: 1 }) } }/>
            } />
            <ListItem primaryText="Carol" rightToggle={
              <Toggle toggled={agents[2]}
                onToggle={() => { store.dispatch({ type: actions.FLIP_AGENT, pos: 2 }) } }/>
            } />
            <ListItem primaryText="Dave" rightToggle={
              <Toggle toggled={agents[3]}
                onToggle={() => { store.dispatch({ type: actions.FLIP_AGENT, pos: 3 }) } }/>
            } />
            <ListItem primaryText="Eve" rightToggle={
              <Toggle toggled={agents[4]}
                onToggle={() => { store.dispatch({ type: actions.FLIP_AGENT, pos: 4 }) } }/>
            } />
          </List>
        </CardText>
      </Card>
    );
  }
}

const floatLeft = {
  float: "left",
  width: 400,
  marginLeft: 50
}

function getSecretValueRange(state) {
  let coPrimes = state.coPrimes.slice(0);
  let arr = coPrimes.sort((a, b) => { return a - b });
  return [arr[3] * arr[4], arr[0] * arr[1] * arr[2]];
}

class AgentStatusTable extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => {
      this.setState(store.getState());
    });
  }
  render() {
    return (
      <Card style={floatLeft}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Co-Prime</TableHeaderColumn>
              <TableHeaderColumn>Mod</TableHeaderColumn>
              <TableHeaderColumn>Available</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>Alice</TableRowColumn>
              <TableRowColumn>{this.state.coPrimes[0]}</TableRowColumn>
              <TableRowColumn>{this.state.secret % this.state.coPrimes[0]}</TableRowColumn>
              <TableRowColumn>{this.state.agents[0] ? "True" : "False"}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Bob</TableRowColumn>
              <TableRowColumn>{this.state.coPrimes[1]}</TableRowColumn>
              <TableRowColumn>{this.state.secret % this.state.coPrimes[1]}</TableRowColumn>
              <TableRowColumn>{this.state.agents[1] ? "True" : "False"}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Carol</TableRowColumn>
              <TableRowColumn>{this.state.coPrimes[2]}</TableRowColumn>
              <TableRowColumn>{this.state.secret % this.state.coPrimes[2]}</TableRowColumn>
              <TableRowColumn>{this.state.agents[2] ? "True" : "False"}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Dave</TableRowColumn>
              <TableRowColumn>{this.state.coPrimes[3]}</TableRowColumn>
              <TableRowColumn>{this.state.secret % this.state.coPrimes[3]}</TableRowColumn>
              <TableRowColumn>{this.state.agents[3] ? "True" : "False"}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Eve</TableRowColumn>
              <TableRowColumn>{this.state.coPrimes[4]}</TableRowColumn>
              <TableRowColumn>{this.state.secret % this.state.coPrimes[4]}</TableRowColumn>
              <TableRowColumn>{this.state.agents[4] ? "True" : "False"}</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  }
}

function getAgentsCount(state) {
  let agents = state.agents;
  let active = agents.filter(v => v).length;
  return active;
}

function getModsCps(state) {
  let mods = [];
  let cps = [];
  for (var i = 0; i < 5; i++) {
    if (mods.length == 3) {
      break;
    }
    if (state.agents[i]) {
      mods.push(state.secret % state.coPrimes[i]);
      cps.push(state.coPrimes[i]);
    }
  }
  return [mods, cps];
}

function calculateSum(state) {
  let modsCps = getModsCps(state);
  let mods = modsCps[0], cps = modsCps[1];
  let p = cps[0], q = cps[1], r = cps[2],
    a = mods[0], b = mods[1], c = mods[2];
  let qr1 = xgcd(q * r, p)[0],
    pr1 = xgcd(p * r, q)[0],
    pq1 = xgcd(p * q, r)[0];
  return a * qr1 * (q * r) +
    b * pr1 * (p * r) +
    c * pq1 * (p * q);
}

function calculateTwoSum(state) {
  let modsCps = getModsCps(state);
  let mods = modsCps[0], cps = modsCps[1];
  let p = cps[0], q = cps[1],
    a = mods[0], b = mods[1];
  let q1 = xgcd(q, p)[0],
    p1 = xgcd(p, q)[0];
  return a * q * q1 + b * p * p1;
}

function superMod(a, b) {
  return ((a % b) + b) % b;
}

class StatusTable extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => {
      this.setState(store.getState());
    });
  }
  render() {
    let mods = getModsCps(this.state)[0];
    let cps = getModsCps(this.state)[1];
    return (
      <Card style={floatLeft}>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>Min Secret Value</TableRowColumn>
              <TableRowColumn>{getSecretValueRange(this.state)[0]}</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>Max Secret Value</TableRowColumn>
              <TableRowColumn>{getSecretValueRange(this.state)[1]}</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <CardText>
          {(() => {
            if (getAgentsCount(this.state) >= 3) {
              return (<div>
                <Latex>{"$$a = " + getModsCps(this.state)[0][0] +
                  ", b = " + getModsCps(this.state)[0][1] +
                  ", c = " + getModsCps(this.state)[0][2] +
                  "$$"}</Latex> <br/>
                <Latex>{"$$p = " + getModsCps(this.state)[1][0] +
                  ", q = " + getModsCps(this.state)[1][1] +
                  ", r = " + getModsCps(this.state)[1][2] +
                  "$$"}</Latex> <br/>
                <Latex>{"$$a (q\\cdot r)^{-1_{p}}(q\\cdot r) +$$"}</Latex> <br/>
                <Latex>{"$$b (q\\cdot r)^{-1_{q}}(q\\cdot r) +$$"}</Latex> <br/>
                <Latex>{"$$c (p\\cdot q)^{-1_{r}}(p\\cdot q) = " + calculateSum(this.state) + "$$"}</Latex> <br/>

                <Latex>{"$$" + calculateSum(this.state) + "\\, \\text{mod} \\," + "(p\\cdot q \\cdot r) = " +
                  superMod(calculateSum(this.state), cps[0] * cps[1] * cps[2]) + "$$"}</Latex>
              </div>);
            } else {
              return (<div>
                <Latex>{"$$a = " + getModsCps(this.state)[0][0] +
                  ", b = " + getModsCps(this.state)[0][1] +
                  "$$"}</Latex> <br/>
                <Latex>{"$$p = " + getModsCps(this.state)[1][0] +
                  ", q = " + getModsCps(this.state)[1][1] +
                  "$$"}</Latex> <br/>
                <Latex>{"$$a q^{-1_{p}}q +$$"}</Latex> <br/>
                <Latex>{"$$b p^{-1_{q}}p =" + calculateTwoSum(this.state) + "$$"}</Latex> <br/>

                <Latex>{"$$" + calculateTwoSum(this.state) + "\\, \\text{mod} \\," + "(p\\cdot q) = " +
                  superMod(calculateTwoSum(this.state), cps[0] * cps[1]) + "$$"}</Latex>
              </div>);
            }

          })() }
        </CardText>
        <div style={{ width: "100%", textAlign: "center", marginBottom: 20 }}>
          {(() => {
            var decryptedValue = 0;
            if (getAgentsCount(this.state) >= 3) {
              decryptedValue = superMod(calculateSum(this.state), cps[0] * cps[1] * cps[2]);
            } else {
              decryptedValue = superMod(calculateTwoSum(this.state), cps[0] * cps[1]);
            }
            if (decryptedValue != this.state.secret) {
              return <RaisedButton primary={true} label="Decryption Failed" />;
            } else {
              return <RaisedButton secondary={true} label="Decryption Successful" />;
            }
          })() }
        </div>
      </Card>
    );
  }
}


export default class App extends Component {
  render() {
    return (
      <div>
        <LeftNav open={true} width={400}>
          <div style={centerStyle}>
            <RaisedButton label="Evaluate" primary={true} style={style} />
            <RaisedButton label="Reset" secondary={true} style={style} onClick={() => { store.dispatch({ type: actions.RESET_ALL }) } } />
          </div>
          <Configuration />
          <AgentList />
        </LeftNav>
        <div className="wrapper" style={stageStyle}>
          <AgentStatusTable />
          <StatusTable />
        </div>
      </div>
    );
  }
}

