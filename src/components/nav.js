import React from 'react';
import ReactDOM from 'react-dom';
import './nav.less';
import Dialog from "./dialog.js";
import "./lib.js";
class Nav extends React.Component{
	componentDidMount(){
		let user = lib.getUser();
		let src = window.location.href.split('/').reverse()[0];
		let menu = [{
			href : 'index.htm' ,
            title : '个人中心'
		}];
		if(this.props.data){
			menu = menu.concat(this.props.data);
		}
		if(user.type == 2){
			let teachers =  teacher_list.filter(function(teacher){
				return teacher.class_list.indexOf(lib.getUser().class1) > -1 
			});
			if(teachers.length == 1){
				menu.push({
					title : '我的作业',
					href : 'work.htm?teacher_id=' + teachers[0].teacher_id
				})
			}
			else{
				let subList = [];
				let item = {
					title : '我的作业<span>&#xe627;</span>',
					href : '#' 
				}
				for(var i=0;i<teachers.length;i++){
					subList.push({
						title : teachers[i].teacher_name,
						href : 'work.htm?teacher_id=' + teachers[i].teacher_id
					});
					if(src.indexOf('work.htm') > -1 && lib.getParam('teacher_id') == teachers[i].teacher_id){
						item = {
							href : src ,
							title : teachers[i].teacher_name + '<span>&#xe627;</span>'
						}
		        	}
				}
				item.list = subList;
				menu.push(item);
			}
		}
		if(user.type < 2){
			let item = {
				href : '#' ,
				title : '班级管理' + '<span>&#xe627;</span>'
			}
			item.list = [];
			teacher_list.filter(function(teacher){
				return teacher.teacher_id == lib.getUser().id
			}).map(function(teacher){
				teacher.class_list.map(function(class1){
					item.list.push({
						href : 'class.htm?class=' + class1,
						title : class1
					})
				})
			});
			if(src.indexOf('class.htm') > -1){
				item.href = src;
				item.title = decodeURIComponent(lib.getParam('class')) + '<span>&#xe627;</span>';
        	}
        	menu.push(item);
		}
		if(true){
			let item = {
				href : '#' , 
				title : '课程资料' + '<span>&#xe627;</span>',
				list : []
			}
			teacher_list.filter(function(teacher){
				return (user.type < 2 && teacher.teacher_id == user.id) || 
				user.type == 2 && teacher.class_list.indexOf(user.class1) > -1
			}).map(function(teacher){
				teacher.data_list.map(function(w){
					item.list.push({
						href : 'job.htm?name=' + w.name ,
						title : w.name
					});
				})
			});
			if(src.indexOf('job.htm') > -1){
				item.href = src;
				item.title = decodeURIComponent(lib.getParam('name')) + '<span>&#xe627;</span>';
        	}
			menu.push(item);
		}
		menu.push({
			href : 'question.htm' ,
            title : '题库'
		})

		for(var i=0; i<menu.length; i++){
			if(window.location.href.split('/').reverse()[0] == menu[i].href){
				menu[i].active = 'active';
			}
		}
		this.setState({
			user : lib.getUser() , 
			menu : menu
		})
	}
	logOut(){
		lib.get('login.php?method=logout' , {} , function(){
			window.location = 'login.htm';
		})
	}
	render() {
		if(!this.state){
			return (<div />)
		}
		let data = this.state.menu;

		return (
			<div>
				<div className='hd'>
					<div className='nav-panel'>
						<div className='nav'>
							<div className='logo'>
								<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" height="20" />
								Teach
							</div>
							<ul className='menu'>
								{
									data.map(function(item){
										return (
											<li className={item.active}>
												<a href={item.href} dangerouslySetInnerHTML={{__html : item.title}} ></a>
												{
													item.list ? (
														<div className='sub-menu'>
															{item.list.map(function(sub){
																return (
																	<div className='sub'>
																		<a href={sub.href} dangerouslySetInnerHTML={{__html : sub.title}}></a>
																	</div>
																)
															})}
														</div>
													) : ''
												}
												
											</li>	
										)
									})
								}
							</ul>
							<ul className='user'>
								<li><a className='login'>{this.state.user.username}</a></li>
								<li><a className='login-out' onClick={this.logOut}>退出</a></li>
							</ul>
						</div>
					</div>
				</div>
				<Dialog></Dialog>
			</div>
		);
	}
};

export default Nav


