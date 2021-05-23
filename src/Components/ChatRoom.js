import im from '../config.js'
import GoEasyIM from 'goeasy-im';
import { Button, Input, Layout, Menu, Breadcrumb } from 'antd'
import React, { Component } from 'react'
import TopBar from './TopBar.jsx'
import Message from './Message'
import MessageList from './MessageList'
import ConversationList from './ConversationList'
import '../assets/css/Messenger.css'
import { ChatItem } from 'react-chat-elements'
// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import { MessageBox } from 'react-chat-elements';



const { Search } = Input;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;


class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {User: '', Receiver: '', Messages: []}
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
    onClick = (value) => {
        console.log("user: "+this.state.User)
        console.log("Receiver: "+this.state.Receiver)
        console.log("Message: "+this.state.Message)

        //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
        let textMessage = im.createTextMessage({
            text: value.target.value, //消息内容
            to : {
                type : GoEasyIM.SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasyIM.SCENE.GROUP
                id : this.state.Receiver,
                data:'{"avatar":"/www/xxx.png","nickname":"shit"}' //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
            }
        });

        //发送消息
        var promise = im.sendMessage(textMessage);

        promise.then(function(message) {
           console.log("Private message sent successfully.", message);
        }).catch(function(error) {
            console.log("Failed to send private message，code:" + error.code +",error"+error.content);
        });
        value.target.value = ""

    }

    getConversations = () => {
        var promise = im.latestConversations();
        promise.then(function(result) {
            console.log(result)
        }).catch(function(error) {
            console.log("Failed to get the latest conversations, code:" + error.code + " content:" + error.content);
        });
    
    }

    watchConversations = () => {
        var onConversationsUpdated = function(conversations) { 
            console.log(conversations)
        };

    //监听会话列表更新
        im.on(GoEasyIM.EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
    }

    
    render() {
        return (
            <Layout>
                <TopBar />
                <Content>
                    <div style={{margin: "20px"}}>
                    <Search
                    placeholder="input your user id"
                    enterButton="Login"
                    size="large"
                    onSearch={this.login}
                    />
                    </div>

                    <div style={{margin: "20px"}}>
                    <Search
                    placeholder="choose who you wanna send to"
                    enterButton="Confirm"
                    size="large"
                    onSearch={this.setSender}
                    />
                    </div>


                    <Button type="primary" onClick={this.getConversations}>getConversations</Button>
                    <Button type="primary" onClick={this.watchConversations}>watchConversations</Button>

                    <div className="messenger">
                        <div className="scrollable sidebar">
                        <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={1} />
                        <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                        <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                        <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                        <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                        </div>

                        <div className="scrollable content">
                        <MessageList />
                        <div style={{margin: "20px"}}>
                        <TextArea showCount maxLength={100} onPressEnter={this.onClick} />
                        </div>
                        </div>
                    </div>
                    
                </Content>
                <Footer>我草泥馬我要死了這個作業真的是太雞巴煩人了</Footer>
        </Layout>

        )
    }
}

export default ChatRoom;