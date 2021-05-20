import im from '../config.js'
import { Button, Input } from 'antd'
import React, { Component } from 'react'

const { Search } = Input;
const { TextArea } = Input;


class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {User: '', Receiver: '', Message: ''}
    };

    onSearch = (value) => {
        console.log(value);
    };
    
    login = (value) =>  {
        // construct the user info
        this.setState({User: value})
        var user = {
            id: value,  //当前用户的唯一标识符
            data:'{"nickname":"whatsoever"}' //当前用户的扩展数据, 任意格式的字符串或者对象，用于会话列表conversation.data和群消息的senderData
        }
        // connect to Goeasy
        var promise =  im.connect(user);

        promise.then(function() {
            console.log("Connection successful. And the userID is: "+value);
        }).catch(function(error) {
            console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
        });
    };

    // the button to send
    setSender = (value) => {
        console.log("the receiver is: " + value);
        this.setState({Receiver: value});
    };

    // textArea onChange
    // about the message to send
    onChange = (e) => {
        this.setState({Message: e.target.value});
    }

    // to send the message
    // onClick on Button
    onClick = () => {
        console.log("user: "+this.state.User)
        console.log("Receiver: "+this.state.Receiver)
        console.log("Message: "+this.state.Message)
    }

    render() {
        return (
            <div>
                <Search
                placeholder="input your user id"
                enterButton="Login"
                size="large"
                onSearch={this.login}
                />
                <Search
                placeholder="choose who you wanna send to"
                enterButton="Confirm"
                size="large"
                onSearch={this.setSender}
                />

                <TextArea 
                showCount maxLength={100} 
                onChange={this.onChange} 
                allowClear={true} 
                />
                
                <Button type="primary" onClick={this.onClick}>Send</Button>
            </div>

        )
    }
}

export default ChatRoom;