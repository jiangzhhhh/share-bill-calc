import React from 'react';
// var Decimal = require('decimal');

class Member extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const props = this.props;
    const name = props.name;
    const onAddBill = props.onAddBill;
    const onChangeBill = props.onChangeBill;
    const onChangeName = props.onChangeName;
    const bills = props.bills.map(num=> 
      <td>
        <input type="integer" name="number" value={num} min="0" onChange={onChangeBill}/>
      </td>
    );
    let billPrice = 0;
    props.bills.forEach(num => billPrice += num);
    const ncols = (props.ncols);
    //padding
    for(let i=0; i<ncols-bills.length; ++i){
      bills.push(<td></td>);
    }
    return (
      <tr>
        <button onClick={props.onDel} disabled={props.disabled}>-</button>
        <td><input type="text" value={name} onChange={onChangeName}/></td>
        {bills}
        <td><input type="integer" min="0" onChange={onAddBill}/></td>
        <td>{billPrice}</td>
        <td>pay</td>
        <td>discount</td>
      </tr>
    );
  }
}

function DummyMember(props){
    const newMemberName = props.newMemberName;
    return (
    <tr>
      <td></td>
      <td><input type="text" value={newMemberName} onChange={props.onChangeNewMemberName} onBlur={props.onAdd}/></td>
    </tr>
  );
}

function Summary(props){
  const sumBill = props.sumBill;
  const sumPay = props.sumPay;
  const sumDiscount = sumBill - sumPay;
  return (
    <tr>
      <td></td>
      <td>{sumBill}</td>
      <td>{sumPay}</td>
      <td>{sumDiscount}</td>
    </tr>
  );
}

class ShareBill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      ncols: 0,
      members: [
        {name:'谁', bills:[]}
      ],
      newMemberName: "",
      sumBill: 0,
      sumPay: 0,
    };

    this.onAddMember = this.onAddMember.bind(this);
    this.onDelMember = this.onDelMember.bind(this);
    this.onAddMemberBill = this.onAddMemberBill.bind(this);
    this.onChangeMemberName = this.onChangeMemberName.bind(this);
    this.onChangeNewMemberName = this.onChangeNewMemberName.bind(this);
  }

  onAddMember(event){
    const value = event.target.value;
    let members = this.state.members;
    members.push({name:value, bills:[]});
    this.setState({members: members, newMemberName: ""});
  }

  onDelMember(index){
    let members = this.state.members;
    members.splice(index, 1);
    this.setState({members: members});
  }

  onChangeNewMemberName(event){
    const value = event.target.value;
    this.setState({newMemberName: value});
  }

  onChangeMemberName(index, event){
    let members = this.state.members;
    let member = members[index];
    member.name = event.target.value;
    this.setState({members: members});
  }

  sumBill(){
    let sum = 0;
    this.state.members.forEach(m=>m.bills.forEach(num=>sum+=num));
    return sum;
  }

  onAddMemberBill(index, event){
    let members = this.state.members;
    let member = members[index];
    const value = event.target.value;
    if(value){
      const num = parseInt(value);
      member.bills.push(num);
      let ncols = this.state.ncols;
      ncols = Math.max(ncols, member.bills.length);
      let sumBill = this.sumBill();
      this.setState({members: members, ncols: ncols, sumBill: sumBill});
    }
  }

  onChangeMemberBill(index, event){
    const value = event.target.value;
    let members = this.state.members;
    let member = members[index];
    if(!value){
      member.bills.splice(index, 1);
      let ncols = 0;
      members.forEach(m => ncols = Math.max(ncols, m.bills.length));
      let sumBill = this.sumBill();
      this.setState({members: members, ncols: ncols, sumBill: sumBill});
    }
    else{
      const num = parseInt(value);
      member.bills[index] = num;
      let sumBill = this.sumBill();
      this.setState({members: members, sumBill: sumBill});
    }
  }

  render(){
    const onlyOneMember = this.state.members.length <= 1;
    const members = this.state.members.map(
      (m,index) =>
        <Member
          name={m.name}
          bills={m.bills}
          ncols={this.state.ncols}
          onChangeName={(e)=>this.onChangeMemberName(index, e)}
          onDel={(e)=>this.onDelMember(index, e)}
          onAddBill={(e)=>this.onAddMemberBill(index, e)}
          onChangeBill={(e)=>this.onChangeMemberBill(index, e)}
          disabled={onlyOneMember}
        />
    );
    return (
      <div>
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>名字</th>
            {Array(this.state.ncols+1).fill('价格').map((e,i) => <th>{e+(i+1)}</th>)}
            <th>账单价格</th>
            <th>支付价格</th>
            <th>优惠</th>
          </tr>
        </thead>
        <tbody>
          {members}
          <DummyMember newMemberName={this.state.newMemberName} onChangeNewMemberName={(e)=>this.onChangeNewMemberName(e)} onAdd={this.onAddMember}/>
          <Summary sumBill={this.state.sumBill} sumPay={this.state.sumPay}/>
        </tbody>
      </table>
      </div>
    );
  }
}

export default ShareBill;
