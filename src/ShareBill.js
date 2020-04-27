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
    const dummy = props.dummy;
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
        <td><input type="text" name="text" value={name} onChange={onChangeName}/></td>
        {bills}
        <td><input type="integer" name="number" value='' min="0" onChange={onAddBill}/></td>
        <td>{billPrice}</td>
        <td>pay</td>
        <td>discount</td>
      </tr>
    );
  }
}

function DummyMember(props){
    const ncols = (props.ncols);
    return (
    <tr>
      <td></td>
      <td><input type="text" name="text" value=''/></td>
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
    };

    this.onAddMember = this.onAddMember.bind(this);
    this.onDelMember = this.onDelMember.bind(this);
    this.onAddMemberBill = this.onAddMemberBill.bind(this);
    this.onChangeMemberName = this.onChangeMemberName.bind(this);
  }

  onAddMember(name){
    this.state.members.push({name:name, bills:[]});
    // this.setState(this.state.members);
  }

  onDelMember(index){
    let members = this.state.members;
    members.splice(index, 1);
    this.setState({members: members});
  }

  onChangeMemberName(index, event){
    let members = this.state.members;
    let member = members[index];
    member.name = event.target.value;
    this.setState({members: members});
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
      this.setState({members: members, ncols: ncols});
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
      this.setState({members: members, ncols: ncols});
    }
    else{
      const num = parseInt(value);
      member.bills[index] = num;
      this.setState({members: members});
    }
  }

  renderCols(){
    let html = [];
    for(let i=0; i<(this.state.ncols+1); ++i){
      html.push(<th>{'价格'+(i+1)}</th>);
    }
    return html;
  }

  render(){
    const onlyOneMember = this.state.members.length <= 1;
    const members = this.state.members.map(
      (m,index) =>
        <Member
          name={m.name}
          bills={m.bills}
          ncols={this.state.ncols}
          onChangeName={this.onChangeMemberName.bind(index)}
          onDel={this.onDelMember.bind(index)}
          onAddBill={(e)=>this.onAddMemberBill(index, e)}
          onChangeBill={(e)=>this.onChangeMemberBill(index, e)}
          disabled={onlyOneMember}
          dummy={false}
        />
    );
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
          {members}
          <DummyMember ncols={this.state.ncols}/>
        </tbody>
      </table>
      </div>
    );
  }
}

export default ShareBill;
