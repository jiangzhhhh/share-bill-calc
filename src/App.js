import React from 'react';
// var Decimal = require('decimal');

class Member extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: '谁',
      billPrices: [],
      payPrice: 0,
      discount: 0,
    };
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onPriceAdd = this.onPriceAdd.bind(this);
    this.onDelMember = this.onDelMember.bind(this);
  }

  onPriceChange(index, event){
    let value = event.target.value;
    let billPrices = this.state.billPrices;
    if(!value)
    {
      billPrices.splice(index, 1);
    }
    else{
      billPrices[index] = value;
    }
    // this.setState({items:items});
    this.props.bill.updateBill();
  }

  onPriceAdd(event){
    let value = parseInt(event.target.value);
    if(value > 0){
      let billPrices = this.state.billPrices;
      billPrices.push(value);
      // this.setState({items:items});
      this.props.bill.updateBill();
    }
  }

  onDelMember(){
    let members = this.props.bill.state.members;
    let index = members.indexOf(this);
    members.splice(index, 1);
    this.props.bill.setState({members:members});
    this.props.bill.updateBill();
  }

  sum(){
    let i = 0;
    this.state.billPrices.forEach(x => i += parseInt(x));
    return i;
  }

  renderBillPrices(){
    let html = []
    let items = this.state.billPrices;
    let numItems = items.length;
    for(let i=0; i<numItems; ++i){
      let price = items[i];
      html.push(
        <td>
          <input type="integer" name="number" value={price} min="0" onChange={(e)=>this.onPriceChange(i, e)}/>
        </td>)
      ;
    }
    html.push(
      <td>
        <input type="integer" name="number" value='' min="0" onChange={this.onPriceAdd}/>
      </td>);
    //padding
    for(let i=0; i<this.props.bill.numCols()-numItems; ++i){
      html.push(<td></td>);
    }
    html.push(
      <td>
        {this.sum()}
      </td>
    );
    return html;
  }

  render(){
    return (
      <tr>
        <button onClick={this.onDelMember}>-</button>
        <td contentEditable='true'>
            {this.state.name}
        </td>
        {this.renderBillPrices()}
        <td>{this.state.payPrice}</td>
        <td>{this.state.discount}</td>
      </tr>
    );
  }
}

class Bill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      members: [new Member({bill:this})],
      billPrice: 0,
      payPrice: 0,
    };
    this.onAddMember = this.onAddMember.bind(this);
    this.onPayPriceChange = this.onPayPriceChange.bind(this);
  }

  renderMembers(){
    let html = [];
    this.state.members.forEach((x)=>html.push(x.render()));
    return html;
  }

  onAddMember(){
    let members = this.state.members;
    members.push(new Member({bill:this}));
    this.setState({members:members});
  }

  onPayPriceChange(event){
    let value = event.target.value;
    let num = 0;
    if(value)
    {
      num = parseInt(value);
    }
    this.state.payPrice = num;
    this.updateBill();
  }

  numCols(){
    let ncols = 0;
    this.state.members.map(m=>
      ncols = Math.max(ncols, m.state.billPrices.length)
    );
    return ncols;
  }

  updateBill(){
    let billPrice = 0;
    this.state.members.map(m=>
      billPrice += m.sum()
    );

    let payPrice = this.state.payPrice;
    let discount = billPrice - payPrice;
    console.log(`discount:${discount},billPrice:${billPrice},payPrice:${payPrice}`);
    this.state.members.map(m=>{
      let price = m.sum();
      let weight = price / billPrice;
      console.log(`weight:${weight}`);
      m.state.discount = discount * weight;
      m.state.payPrice = price - m.state.discount;
      m.setState({discount:discount, payPrice:payPrice});
    }
    );

    this.setState({billPrice: billPrice, payPrice:payPrice});
  }

  renderCols(){
    let ncols = 0;
    this.state.members.forEach(m => {
      ncols = Math.max(ncols, m.state.billPrices.length);
    });
    let html = [];
    for(let i=0; i<(ncols+1); ++i){
      html.push(<th>{'价格'+(i+1)}</th>);
    }
    return html;
  }

  renderStatus(){
    let html = []
    html.push(<button onClick={this.onAddMember}>+</button>);
    html.push(<td>汇总</td>);
    //padding
    for(let i=0; i<this.numCols()+1; ++i){
      html.push(<td></td>);
    }
    html.push(<td>{this.state.billPrice}</td>);
    html.push(<td><input type="integer" name="number" value={this.state.payPrice} min="0" onChange={this.onPayPriceChange}/></td>);
    html.push(<td>{this.state.billPrice-this.state.payPrice}</td>);
    return <tr>{html}</tr>;
  }

  render(){
    return (
      <div>
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>名字</th>
            {this.renderCols()}
            <th>账单价格</th>
            <th>支付价格</th>
            <th>优惠</th>
          </tr>
        </thead>
        <tbody>
          {this.renderMembers()}
          {this.renderStatus()}
        </tbody>
      </table>
      </div>
    );
  }
}

export default Bill;
