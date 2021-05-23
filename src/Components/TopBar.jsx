import React from 'react';
import {Button,  Menu,Dropdown} from 'antd';
import TopMenu from './TopMenu';
import '../assets/css/TopBar.css';
import {UserOutlined} from '@ant-design/icons';

const loginMenu=(
  <Menu>
      <Menu.Item key='login'>登录</Menu.Item>
      <Menu.Item key='register'>注册</Menu.Item>
  </Menu>
);

class TopBar extends React.Component{

    render() {
        return(
            <div className="TopBar">
                <img className='logo' src={require('../assets/picture/logo.jpg').default} alt='logo'/>
                <div className='title'>
                    智慧医疗
                </div>
                <div style={{alignSelf: 'flex-end'}} className='Menu'><TopMenu/></div>
                <div className='User'>
                    <Dropdown overlay={loginMenu} trigger={['click']}>
                        <Button size='large' shape="circle" icon={<UserOutlined/>}/>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

export default TopBar