import React from 'react';

// 四舍五入到指定小数位数
function roundTo(n, digits) {
  if (digits === undefined) {
      digits = 0;
  }

  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  return Math.round(n) / multiplicator;
}

class Member extends React.Component{
  render(){
    const props = this.props;
    const name = props.name;
    const onAddBill = props.onAddBill;
    const onChangeBill = props.onChangeBill;
    const onChangeName = props.onChangeName;
    let bills = props.bills.map((num,index)=> 
      <td>
        <input type="number" value={num} step="0.1" min="0" onChange={(e)=>onChangeBill(index, e)}/>
      </td>
    );
    bills.push(<td><input type="number" step="0.1" min="0" onChange={onAddBill}/></td>);
    let billPrice = 0;
    props.bills.forEach(num => billPrice += parseFloat(num));
    const ncols = props.ncols;
    const padding = Array(ncols-(bills.length-1)).fill(<td></td>);
    return (
      <tr>
        <button onClick={props.onDel} disabled={props.disabled}>-</button>
        <td><input type="text" value={name} onChange={onChangeName}/></td>
        {bills}
        {padding}
        <td>{billPrice}</td>
        <td>{props.pay}</td>
        <td>{roundTo(billPrice-props.pay, 2)}</td>
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
  const ncols = props.ncols;
  const sumBill = props.sumBill;
  const sumPay = props.sumPay;
  const sumDiscount = roundTo(sumBill - sumPay, 2);
  const padding = Array(ncols+1).fill(<th></th>);
  const onChangeSumPay = props.onChangeSumPay;
  return (
    <tr>
      <th></th>
      <th>汇总</th>
      {padding}
      <th>{sumBill}</th>
      <th><input type="number" value={sumPay==0?'':sumPay} step="0.1" min="0" onChange={onChangeSumPay} /></th>
      <th>{sumDiscount}</th>
    </tr>
  );
}

class ShareBill extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      ncols: 0,
      members: [
        {name:'自己', bills:[], pay:0}
      ],
      newMemberName: "",
      sumBill: 0,
      sumPay: 0,
    };
  }

  onAddMember(event){
    const value = event.target.value;
    if(value){
      let members = this.state.members;
      members.push({name:value, bills:[]});
      this.setState({members: members, newMemberName: "",});
    }
  }

  onDelMember(index){
    let members = this.state.members;
    members.splice(index, 1);
    this.setState({members: members});
    this.updateBill();
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

  updateBill(){
      let members = this.state.members;
      let sumBill = 0;
      members.forEach(m=>m.bills.forEach(num=>sumBill+=num));
      const sumPay = this.state.sumPay;
      let sumDiscount = roundTo(sumBill - sumPay, 2);

      for(let i=0; i<members.length; ++i){
        let member = members[i];
        let bill = 0;
        member.bills.forEach(x=> bill+=x);
        const weight = bill / sumBill;
        const discount = roundTo(sumDiscount * weight, 2);
        member.pay = roundTo(bill - discount, 2);
      }
      this.setState({members: members, sumBill: sumBill, sumDiscount: sumDiscount});
    }

  onAddMemberBill(index, event){
    let members = this.state.members;
    const value = event.target.value;
    const num = parseFloat(value);
    if(num > 0){
        let member = members[index];
        member.bills.push(num);
        let ncols = this.state.ncols;
        ncols = Math.max(ncols, member.bills.length);
        this.setState({members: members, ncols: ncols});
        this.updateBill();
    }
  }

  onChangeMemberBill(index, billIndex, event){
    const value = event.target.value;
    let members = this.state.members;
    let member = members[index];
    if(!value){
      member.bills.splice(billIndex, 1);
      let ncols = 0;
      members.forEach(m => ncols = Math.max(ncols, m.bills.length));
      this.setState({members: members, ncols: ncols});
    }
    else{
      const num = parseFloat(value);
      member.bills[billIndex] = num;
      this.setState({members: members});
    }
    this.updateBill();
  }

  onChangeSumPay(event){
    const value = event.target.value;
    const num = parseFloat(value);
    if(num > 0){
      this.setState({sumPay: num});
    }
    else{
      this.setState({sumPay: 0});
    }
    this.updateBill();
  }

  render(){
    const onlyOneMember = this.state.members.length <= 1;
    let members = this.state.members.map(
      (m,index) =>
        <Member
          name={m.name}
          bills={m.bills}
          ncols={this.state.ncols}
          onChangeName={this.onChangeMemberName.bind(this, index)}
          onDel={this.onDelMember.bind(this, index)}
          onAddBill={this.onAddMemberBill.bind(this, index)}
          onChangeBill={this.onChangeMemberBill.bind(this, index)}
          disabled={onlyOneMember}
          pay={m.pay}
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
          <DummyMember 
            newMemberName={this.state.newMemberName}
            onChangeNewMemberName={this.onChangeNewMemberName.bind(this)}
            onAdd={this.onAddMember.bind(this)}
          />
          <Summary 
            ncols={this.state.ncols}
            sumBill={this.state.sumBill}
            sumPay={this.state.sumPay}
            onChangeSumPay={this.onChangeSumPay.bind(this)}
          />
        </tbody>
      </table>
      </div>
    );
  }
}

export default ShareBill;
