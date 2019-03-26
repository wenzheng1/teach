import React from 'react';
import ReactDOM from 'react-dom'; 
import "./login.less";
import "./components/lib.js";
import Dialog from './components/dialog.js';
class Page extends React.Component{
    componentDidMount() {
    }
    componentWillMount(){
        this.setState({
            login : {
                id : {value : '' , error : false},
                passwd : {value : '' , error : false}
            },
            register:{
                id : {value : '' , error : false} ,
                username : {value : '' , error : false} ,
                passwd : {value : '' , error : false},
                confirm : {value : '' , error : false},
                class1 : {value : '' , error : false}
            },
            type : 'login'
        })
    }
    input(item , e){
        item.error = false;
        item.value = e.target.value.trim().slice(0 , 20);
        this.setState(this.state);
    }
    inputId(item , e){
        item.error = false;
        let value = e.target.value.trim();
        if(isNaN(value)){
            return;
        }
        item.value = value.slice(0 , 20);
        this.setState(this.state);
    }
    check(){

    }
    register(){
        let self = this;
        let register = this.state.register;
        if(register.id.value == ''){
            register.id.error = 'has-error';
            register.id.errorText = '请输入学号';
            self.setState(self.state);
            return;
        }
        if(register.username.value == ''){
            register.username.error = 'has-error';
            register.username.errorText = '请输入用户名';
            self.setState(self.state);
            return;
        }
        if(register.passwd.value == ''){
            register.passwd.error = 'has-error';
            register.passwd.errorText = '请输入密码';
            self.setState(self.state);
            return;
        }
        if(register.confirm.value != register.passwd.value ){
            register.confirm.error = 'has-error';
            register.confirm.errorText = '两次密码输入不一致';
            self.setState(self.state);
            return;
        }
        if(register.class1.value == ''){
            register.class1.error = 'has-error';
            register.class1.errorText = '请选择班级';
            self.setState(self.state);
            return;
        }
        lib.post('/teach/register.json' ,  {
            id : register.id.value , 
            username : register.username.value , 
            passwd : register.passwd.value , 
            class1 : register.class1.value
        } , function(json){
            if(json.code == 0){
                lib.alert('注册成功' , '恭喜你，帐号：<span>'+self.state.register.username.value+'</span>注册成功，请使用该帐号进行登陆！');
                self.setState({
                    type : 'login'
                })
            }
            else if(json.code == 1062){
                register.id.error = 'has-error';
                register.id.errorText = '学号' + register.id.value + '已存在';
                self.setState(self.state);
            }
            else{
                lib.alert('注册失败' , '<span>' + json.code + '</span>');
            }
        })
    }
    login(){
        let self = this;
        let login = this.state.login;
        if(login.id.value == ''){
            login.id.error = 'has-error';
            login.id.errorText = '请输入学号';
            self.setState(self.state);
            return;
        }
        if(login.passwd.value == ''){
            login.passwd.error = 'has-error';
            login.passwd.errorText = '请输入密码';
            self.setState(self.state);
            return;
        }
        lib.get('/teach/login.json', {
            id : login.id.value ,
            passwd : login.passwd.value 
        } , function(json){
            if(json.code == 0){
                console.log('登陆成功');
                window.location = 'work.htm';
            }
            else if(json.code == 1){
                login.id.error = 'has-error';
                login.id.errorText = '学号不存在！';
                self.setState(self.state);
            }
            else if(json.code == 2){
                login.passwd.error = 'has-error';
                login.passwd.errorText = '密码错误！';
                self.setState(self.state);
            }
            console.log(json);
        })
    }
    changeType(type){
        this.setState({type : type});
    }
    render(){
        let self = this;
        let login = this.state.login;
        let register = this.state.register;
        let classList = [];
        for(var i=0;i<teacher_list.length;i++){
            classList = classList.concat(teacher_list[i].class_list);
        }
        return (
            <div>
                <Dialog />
                <div className='bg' style={{'backgroundImage' : 'url("http://x.eat163.com/5975721174.jpg?x-oss-process=image/resize,m_fill,w_1200")'}}></div>
                <div className='mask'></div>
                <div className='box'>
                    <div className='box-bg'></div>
                    <div className={'hd ' + this.state.type}>
                        <div onClick={this.changeType.bind(this , 'register')}>注册</div>
                        <div onClick={this.changeType.bind(this , 'login')}>登陆</div>
                    </div>
                    <div className='bd'>
                        {
                            this.state.type == 'login' ? 
                            (
                                <div>
                                    <div className={"form-group " + login.id.error}>
                                        <label>学号</label>
                                        <input className="form-control" placeholder="学号" value={login.id.value} 
                                        onChange={this.input.bind(this , login.id )} />
                                        <div>{login.id.errorText}</div>
                                    </div>
                                    <div className={"form-group " + login.passwd.error}>
                                        <label>密码</label>
                                        <input type='password' className="form-control" placeholder="密码" value={login.passwd.value} 
                                        onChange={this.input.bind(this , login.passwd )} />
                                        <div>{login.passwd.errorText}</div>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={this.login.bind(this)}>登陆</button>
                                </div>
                            )
                            :
                            (
                                <div>
                                    <div className={"form-group " + register.id.error}>
                                        <label>学号</label>
                                        <input className="form-control" placeholder="学号" value={register.id.value} 
                                        onChange={this.inputId.bind(this , register.id )} />
                                        <div>{register.id.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.username.error}>
                                        <label >用户名</label>
                                        <input className="form-control"  placeholder="请使用真实姓名注册" value={register.username.value} 
                                        onChange={this.input.bind(this , register.username )} />
                                        <div>{register.username.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.passwd.error}>
                                        <label >密码</label>
                                        <input type='password' className="form-control" placeholder="密码" value={register.passwd.value} 
                                        onChange={this.input.bind(this , register.passwd )} />
                                        <div>{register.passwd.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.confirm.error}>
                                        <label >确认密码</label>
                                        <input type='password' className="form-control" placeholder="密码" value={register.confirm.value} 
                                        onChange={this.input.bind(this , register.confirm )} />
                                        <div>{register.confirm.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.class1.error}>
                                        <label >班级</label>
                                        <select className="form-control type" onChange={this.input.bind(this , register.class1)}>
                                            <option value=''>请选择</option>
                                            { 
                                                [...(new Set(classList))].sort().map(function(class1 , key){
                                                    return (<option key={key} value={class1}>{class1}</option>)
                                                })
                                            }
                                        </select>
                                        <div>{register.class1.errorText}</div>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={this.register.bind(this)}>注册</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

