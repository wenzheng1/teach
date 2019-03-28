import React from 'react';
import ReactDOM from 'react-dom'; 
import "./job.less";
import "./components/lib.js";
import Nav from './components/nav.js';

class Page extends React.Component{
    componentDidMount() {
        let self = this;
        let user = lib.getUser();
        let list = [];
        teacher_list.filter(function(teacher){
            return (user.type < 2 && teacher.teacher_id == user.id) || 
            user.type == 2 && teacher.class_list.indexOf(user.class1) > -1
        }).map(function(teacher){
            teacher.data_list.map(function(work){
                if(work.name == lib.getParam('name')){
                    list = list.concat(work.work_list);
                }
            })
        });
        let item = {};
        for(var i=0; i<list.length; i++){
            if(item.name == list[i].name){
                item.num++;
            }
            else{
                item = list[i];
                item.num = 1;
            }
        }
        console.log(list);
        self.setState({
            list : list
        })
    }
    go(url){
        window.open(url);
    }
    render(){
        let self = this;
        if(!this.state){
            return <div />
        }
        return (
            <div>
                <Nav></Nav>
                <div className="container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className='name'>作业号</th>
                                <th className='filename'>文件名</th>
                                <th className='url' >访问地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map(function(item){
                                    if(item.num){
                                        return (
                                            <tr>
                                                <td className='name' rowSpan={item.num}>{item.name}</td>
                                                <td className='filename'>{item.filename}</td>
                                                <td className='url' onClick={self.go.bind(self , item.url)}>{item.url}</td>
                                            </tr>
                                        )
                                    }
                                    else{
                                        return (
                                            <tr>
                                                <td className='filename'>{item.filename}</td>
                                                <td className='url' onClick={self.go.bind(self , item.url)}>{item.url}</td>
                                            </tr>
                                        )
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

