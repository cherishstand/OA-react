import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import {Link, browserHistory} from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBaclIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Add from 'material-ui/svg-icons/content/add';
import Search from '../public/Search';
import Template from '../public/template';
import MenuTotal from '../public/MenuTotal';
import { CONFIG } from '../../constants/Config';
import {Tool} from '../../constants/Tools';
import { is, fromJS} from 'immutable';
const styles={
    textColor:{
        color: '#7888af',
        padding: '0',
    },
    back:{
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 4,
        boxShadow:'rgba(0, 0, 0, 0.117647) 0px 1px 6px',
    },
    head: {
        textAlign: 'center',
        height: 45,
        lineHeight: '45px',
        backgroundColor:'rgb(255, 255, 255)',
    },
    title:{
        height: 45,
        lineHeight: '45px',
        overflow: 'initial',
        color: 'rgb(33, 33, 33)',
        fontSize: 18
    }
}
class Head extends Component {
    render() {
        return(
            <AppBar
                style={styles.head}
                titleStyle={styles.title}
                title={<MenuTotal items={CONFIG.customer} path = {this.props.path}/>}
                iconStyleRight={{marginTop: 0}}
                iconStyleLeft={{marginTop: 0, marginRight: 0}}
                iconElementLeft={<Link to={browserHistory}><IconButton><ArrowBaclIcon color="#5e95c9"/></IconButton></Link>}
                iconElementRight={<IconButton><Add color="#5e95c9"/></IconButton>}
            />
        )
    }
}
class Lists extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render(){
        return(
            <List  >
                {this.props.datas.map((data, index) => (
                    <Link to={`/customer/${data.accountid}`} key={index}>
                        <ListItem
                            style={styles.back}
                            key={index}
                            primaryText={
                                <p><span style={styles.textColor}>{data.accountname}</span></p>
                            }
                            innerDivStyle={{padding: 8}}
                            secondaryText={
                                <p>
                                    <span style={styles.account_no}>S{data.account_no}&nbsp;&nbsp;{data.createdtime.substr(0, 10)}</span><br />
                                    <span>金额：<span>&nbsp;&nbsp;&nbsp;&nbsp;&yen;</span>{data.discount_rate}</span>
                                </p>
                            }
                            secondaryTextLines={2}
                        />
                    </Link>
                ))}
            </List>
        )
    }
}
class Customer extends Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            data: [],
            currentPage: 1,
            totalPage: 2,
            limit: 8,
            shouldUpdata: true
        }
        this.getNextPage = (currentPage) => {
            if(!this.state.shouldUpdata) {
                return
            }
            this.state.shouldUpdata = false
            this.props.getDate('/customer', {page: currentPage, type: 'all'}, (res) => {
                this.state.currentPage = currentPage;
                this.state.shouldUpdata = true;
                if(res.code === 200) {
                    this.setState({data: this.state.data.concat(res.data)})
                } else {
                    console.log(res.code);
                }
            }, 'nextPage')
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillReceiveProps(nextProps){
        let { data } = nextProps.state;
        this.state.data = data.data || [];
        this.state.currentPage = data.current || 1;
        this.state.totalPage = data.pages || 1;
    }
    render() {
        const {currentPage, totalPage, shouldUpdata} = this.state
        if(currentPage < totalPage) {
            Tool.nextPage(this.refs.container, currentPage, totalPage, this.getNextPage, shouldUpdata)
        }
        return (
            <div>
                <div className="fiexded">
                    <Head path={this.props.location.pathname} />
                    <Search title='请输入客户名称或地址'/>
                </div>
                <div style={{backgroundColor: '#efeef4',paddingTop: '93px'}} ref='container'>
                    <Lists ref='container' datas = {this.state.data}/>
                </div>
            </div>
        );
    }
}
export default Template({
    component: Customer,
    url: 'customer'
});
