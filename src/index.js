import React from 'react';
import ReactDOM from 'react-dom'; 
import "./index.less";
import "./components/lib.js";
import Nav from './components/nav.js';

class Page extends React.Component{
    componentDidMount() {
    }
    componentWillMount(){
    }
    render(){
        return (
        <div>
            <Nav></Nav>
            <div className="container">个人中心建设中！</div>
        </div>)
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);