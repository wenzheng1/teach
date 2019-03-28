import React from 'react';
import ReactDOM from 'react-dom'; 
import "./class.less";
import "./components/lib.js";
import Nav from './components/nav.js';

class Page extends React.Component{
    componentWillMount() {
        let self = this;
        let teacher = {};
        for(var i=0; i<teacher_list.length; i++){
            if(teacher_list[i].class_list.indexOf(lib.getParam('class')) > -1){
                teacher = teacher_list[i];
            }
        }
        lib.get('/teach/get-work-by-class.json' , {'class1' : lib.getParam('class')} , function(json){
            console.log(json);
            self.setState({
                list : json.data ,
                teacher : teacher
            })
            setTimeout(function(){
                $('.score span').hover(function(){
                    if($(this).parent().hasClass('selected')){
                        return;
                    }
                    $(this).addClass('hover');
                    $(this).prevAll().addClass('hover');
                    $(this).nextAll().removeClass('hover');
                } , function(){
                    $(this).removeClass('hover');
                    $(this).prevAll().removeClass('hover');
                    $(this).nextAll().removeClass('hover');
                });
            } , 200);

        });
    }
    setScore(work , item , num , e){
        item.score = num;
        this.save(item.id , {work : work});
        $(e.target).addClass('selected');
        $(e.target).prevAll().addClass('selected');
    }
    save(id , data){
        let self = this;
        lib.post('/teach/save-work.json' , {
            id : id , 
            data : JSON.stringify(data)
        } , function(json){
        });
    }

    go(url){
        if(url){
            window.open(url);
        }
    }
    render(){
        let self = this;
        if(!this.state){
            return <div />
        }
        let list = [];
        this.state.list.sort(function(){
            return Math.random() - Math.random();
        });
        this.state.list.map(function(item){
            let work = JSON.parse(item.data || JSON.stringify({work : {}})).work ;
            let workList = work[self.state.teacher.teacher_id] || [{name : '' , url : ''}];
            let temp = {};
            workList.map(function(node , i){
                if(i == 0){
                    temp = node;
                    temp.num = 1;
                }
                else{
                    temp.num++;
                }
                node.id = item.id;
                node.username = item.username;
                if(node.key){
                    node.url = 'http://x.eat163.com/' + node.key;
                }
                node.work = work;
                list.push(node);
            });
        });
        return (
            <div>
                <Nav></Nav>
                <div className="container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className='id'>学号</th>
                                <th className='name'>姓名</th>
                                <th className='filename' >作业名</th>
                                <th className='url' >作业地址</th>
                                <th className='score'>评分</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map(function(item){
                                    let work = item.work;
                                    delete item.work;
                                    if(item.num){
                                        return (
                                            <tr>
                                                <td className='id' rowSpan={item.num}>{item.id}</td>
                                                <td className='name' rowSpan={item.num}>{item.username}</td>
                                                <td className='filename'>{item.name}</td>
                                                <td className='url' onClick={self.go.bind(self , item.url)}>{item.url}</td>
                                                <td className={'score ' + (item.score > 0 ? 'selected' : '')}>
                                                    <span className={item.score > 0 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 1)}>&#xe603;</span>
                                                    <span className={item.score > 1 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 2)}>&#xe603;</span>
                                                    <span className={item.score > 2 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 3)}>&#xe603;</span>
                                                    <span className={item.score > 3 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 4)}>&#xe603;</span>
                                                    <span className={item.score > 4 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 5)}>&#xe603;</span>
                                                </td>
                                            </tr>
                                            
                                        )
                                    }
                                    else{
                                        return (
                                            <tr>
                                                <td className='filename'>{item.name}</td>
                                                <td className='url' onClick={self.go.bind(self , item.url)}>{item.url}</td>
                                                <td className={'score ' + (item.score > 0 ? 'selected' : '')}>
                                                    <span className={item.score > 0 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 1)}>&#xe603;</span>
                                                    <span className={item.score > 1 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 2)}>&#xe603;</span>
                                                    <span className={item.score > 2 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 3)}>&#xe603;</span>
                                                    <span className={item.score > 3 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 4)}>&#xe603;</span>
                                                    <span className={item.score > 4 ? 'selected' : ''} onClick={self.setScore.bind(self , work , item , 5)}>&#xe603;</span>
                                                </td>
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



