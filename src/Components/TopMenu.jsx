import React from 'react';
import {Link} from 'react-router-dom';
import { Menu } from 'antd';

import {HomeOutlined} from '@ant-design/icons';
import MenuItem from 'antd/lib/menu/MenuItem';

var storage = window.localStorage;


class TopMenu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current:storage.getItem("TopBarKey"),
        }
    }

    handleClick = e => {
        this.setState({
            current:e.key,
        });
        storage.setItem("TopBarKey",e.key);
    };

    render() {
        return(
            <div className="TopMenu">
                <Menu onClick={this.handleClick} selectedKeys={[window.location.pathname]}  mode="horizontal">
                    <MenuItem key = "/" icon={<HomeOutlined/>}>
                        <Link to = "/"> 首页 </Link>
                    </MenuItem>
                    <MenuItem key = "/1" icon={<HomeOutlined/>}>
                        <Link to = "/1"> 模块1 </Link>
                    </MenuItem>
                    <MenuItem key = "/2" icon={<HomeOutlined/>}>
                        <Link to = "/ChatRoom"> 在线诊疗 </Link>
                    </MenuItem>
                    <MenuItem key = "/bbs" icon={<HomeOutlined/>}>
                        <Link to = "/"> 交流论坛 </Link>
                    </MenuItem>
                    <MenuItem key = "/" icon={<HomeOutlined/>}>
                        <Link to = "/"> 医疗资讯 </Link>
                    </MenuItem>
                </Menu>
            </div>
        )
    }
}

export default TopMenu