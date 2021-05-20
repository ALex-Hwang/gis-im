import im from '../config.js'
import { Input } from 'antd'
import React, {Component} from 'react'

const { Search } = Input;

const onSearch = value => console.log(value);

/*
// Goeasy
var user = {
    id:'user000',  //当前用户的唯一标识符
    data:'{"nickname":"Neo"}' //当前用户的扩展数据, 任意格式的字符串或者对象，用于会话列表conversation.data和群消息的senderData
}

//连接GoEasy
var promise =  im.connect(user);

promise.then(function() {
    console.log("Connection successful.");
}).catch(function(error) {
    console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
});
*/
class ChatRoom extends Component {
    render() {
        return (
            <Search
            placeholder="input your user id"
            enterButton="Login"
            size="large"
            onSearch={onSearch}
            />
        )
    }
}

export default ChatRoom;