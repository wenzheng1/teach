import React from 'react';
import ReactDOM from 'react-dom'; 
import "./work.less";
import "./components/lib.js";
import Nav from './components/nav.js';

class Page extends React.Component {
    componentDidMount() {
        let self = this;
        let method = 'get-work';
        let p = {};
        if(lib.getParam('id')){
            method = 'get-work-by-id';
            p={
                id : lib.getParam('id')
            };
        }
        lib.get('/teach/get-my-work.json' , {} , function(json){
            let state = {};
            state.data = JSON.parse(json.data || '{}');
            if(!state.data.work){
                state.data.work = {}
            };
            if(!state.data.work[lib.getParam('teacher_id')]){
                state.data.work[lib.getParam('teacher_id')] = [];
            }
            console.log(state.data);
            self.setState(state);
        });
    }
    upload(item , e){
        let self = this;
        let user = lib.getUser();
        if(e.target.files.length > 0){
            var file = e.target.files[0];
            console.log(file);
            if(file.size > 15 * 1000 * 1000 && user.type > 0){
                return lib.alert('文件尺寸过大' , '对不起，单个文件最大支持15M');
            }
            var data = new FormData();
            let key = '';
            if(item.key && (item.key.split('.').reverse()[0] == file.name.split('.').reverse()[0])){
                key = item.key;
            }
            else{
                key = new Date().getTime() % 100000000 + '' + parseInt(Math.random() * 1000)  + '.' + file.name.split('.').reverse()[0].toLocaleLowerCase();
            }
            if(!item.key){
                let workList = self.state.data.work[lib.getParam('teacher_id')];
                item = {
                    name : file.name , 
                    key : key ,
                    status : 0 ,
                    time : new Date().format('yyyy-MM-dd hh:mm:ss')
                };
                workList.push(item);
            }
            else if(item.key != key){
                item.key = key;
            }
            item.status = 0;
            self.setState(self.state);
            data.append('key' , key);
            data.append('policy' , 'eyJleHBpcmF0aW9uIjoiMjA2Ni0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==');
            data.append('OSSAccessKeyId' , 'LTAImRM0DKxCPkdL');
            data.append('signature' , 'sjudNgSMRQr5fJlqMBmX78Mhy80=');
            data.append('success_action_status' , '200');
            data.append('file', file);
            $.ajax({
                url: 'http://img99.oss-cn-zhangjiakou.aliyuncs.com/',
                type: 'POST',
                cache: false,
                data: data,
                processData: false,
                contentType: false,
                xhr:function(){
                    var xhr = $.ajaxSettings.xhr(); 
                    if(xhr.upload){ 
                        xhr.upload.addEventListener('progress',function(e){
                            item.status = e.loaded / e.total * 100;
                            self.setState(self.state);
                            // pic.status = e.loaded / e.total;
                            // self.setState({pics : self.state.pics});
                            // console.log(pic.status);
                        }, false);   
                    }  
                    return xhr;
                },
            }).done(function(res) {
                // self.state.finishNum++;
                // pic.src = 'http://x.eat163.com/' + key ;
                // self.setState({pics : self.state.pics});
                // self.upload();
                // self.updatePics();
            }).fail(function(res) {
                console.log(res);
            }); 
        }
    }
    editString(e){
        $(e.currentTarget).find('div').hide();
        $(e.currentTarget).find('input').show()[0].focus();
    }
    blur(e){
        $(e.currentTarget).prev().show();
        $(e.currentTarget).hide();
    }
    input(item , key , e){
        item[key] = e.target.value;
        this.setState(this.state);
    }
    save(){
        let self = this;
        lib.post('/teach/save-work.json' , {
            id : lib.getUser().id , 
            data : JSON.stringify(this.state.data)
        } , function(json){
            if(json.code == 0){
                lib.alert('提示框' , '恭喜你，保存成功!');
            }
            else{
                lib.alert('提示框' , json.msg);
            }
        });
    }
    go(item){
        window.open('http://x.eat163.com/' + item.key);
    }
    delRow(list , i){
        let self = this;
        lib.confirm('温馨提示' , '确定要删除该文件吗，删除后，无法恢复！' , '删除' , function(){
            list.splice(i , 1);
            self.setState(self.state);
        });
        
    }
    up(list , i){
        let temp = list[i];
        list[i] = list[i-1];
        list[i-1] = temp;
        this.setState(this.state);
    }
    down(list , i){
        let temp = list[i];
        list[i] = list[i+1];
        list[i+1] = temp;
        this.setState(this.state);
    }
    render(){
        let self = this;
        if(!this.state){
            return <div />
        }
        let list = this.state.data.work[lib.getParam('teacher_id')];
        return (
            <div>
                <Nav></Nav>
                <div className="container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className='del'></th>
                                <th className='id'>ID</th>
                                <th className='name'>Name</th>
                                <th className='url'>URL</th>
                                <th className='time'>上传时间</th>
                                <th className='op'></th>
                                <th className='up'></th>
                                <th className='down'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map(function(item , i){
                                    return (
                                        <tr>
                                            <td className='del' title='删除这行' onClick={self.delRow.bind(self , list  , i)}>&#xe623;</td>
                                            <td className='id'>{i + 1}</td>
                                            <td className='name' onClick={self.editString}>
                                                <div>{item.name}</div>
                                                <input className="form-control" placeholder={item.name} onBlur={self.blur} 
                                                    onInput={self.input.bind(self , item ,  'name')} value={item.name} />
                                            </td>
                                            <td className='url' onClick={self.go.bind(self , item)}>
                                                {'http://x.eat163.com/' + item.key}
                                                <div className='mask' style={{width : (100 - item.status) + '%'}}></div>
                                            </td>
                                            <td className='time'>{item.time}</td>
                                            {
                                                (lib.getParam('id') && lib.getUser().type > 0) ? <td /> : (
                                                    <td className='op'>
                                                        <button type="button" className="btn btn-primary" >
                                                            修改作业
                                                        </button>
                                                        <input type="file" name="file" onChange={self.upload.bind(self , item)} />
                                                    </td>
                                                )
                                            }
                                            {
                                                i > 0 ? (<td className='up' title='上移' onClick={self.up.bind(self , list , i)}>&#xe645;</td>) : (<td className='up' />)
                                            }
                                            {
                                                i < list.length - 1 ? (<td className='down' title='下移' onClick={self.down.bind(self , list , i)}>&#xe644;</td>) : (<td className='down' />)
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>    
                    </table>
                </div>
                {
                    (lib.getParam('id') && lib.getUser().type > 0) ? '' : (
                        <div className='ft'>
                            <div className='bg'></div>
                            <button type="button" className="btn btn-default" >
                                上传作业
                                <input type="file" name="file" onChange={this.upload.bind(self , {})} />
                            </button>
                            <button type="button" className="btn btn-default" onClick={this.save.bind(this)}>保存</button> 
                        </div>
                    )
                }
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);







