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
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import './ConversationList/ConversationList.css';
import { invalid } from 'moment';



const { Search } = Input;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;


class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {User: '', Receiver: '', Conversations: 0, Messages: ''}
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
        this.getConversations();
        this.watchConversations();
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

        //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
        let textMessage = im.createTextMessage({
            text: value.target.value, //消息内容
            to : {
                type : GoEasyIM.SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasyIM.SCENE.GROUP
                id : this.state.Receiver,
                data:'{"avatar":"/www/xxx.png","nickname":"shit"}' //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
            }
        });


        value.target.value = ""
        //发送消息
        var promise = im.sendMessage(textMessage);

        promise.then(function(message) {
           console.log("Private message sent successfully.", message);
        }).catch(function(error) {
            console.log("Failed to send private message，code:" + error.code +",error"+error.content);
        });

    }

    // 選擇聊天對象
    chooseConversation = (e) => {
        this.setState({Receiver: e.currentTarget.id});
        this.getMessages();
    };

    // 获取对话列表
    getConversations = () => {
        var promise = im.latestConversations();
        promise.then((result) => {
            console.log(result)
            this.setState({Conversations: result.content.conversations});

        }).catch(function(error) {
            console.log("Failed to get the latest conversations, code:" + error.code + " content:" + error.content);
        });
    }

    // 持续监听对话列表
    watchConversations = () => {
        var onConversationsUpdated = (conversations) => { 
            this.getConversations(); 
        };

    //监听会话列表更新
        im.on(GoEasyIM.EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
    }

    // 渲染对话列表
    renderConversations = () => {
        let i = 0;
        let temp = [];
        let count = this.state.Conversations.length
        while (i < count) {
            temp.push(
                <div id={this.state.Conversations[i].userId} onClick={this.chooseConversation}>
                <ChatItem 
                avatar="https://www.logosvgpng.com/wp-content/uploads/2021/05/proginov-logo-vector.png" 
                title={this.state.Conversations[i].userId} 
                subtitle={this.state.Conversations[i].lastMessage.payload.text}
                unread={this.state.Conversations[i].unread}
                date={this.state.Conversations[i].lastMessage.timestamp}
                />
                </div>
            )
            i+=1;
        }
        return temp;
    }

    // 獲取歷史紀錄
    getMessages = () => {
        var option = {
            friendId: this.state.Receiver,  //对方userId
            lastTimestamp: Date.now(), //查询发送时间小于（不包含）该时间的历史消息，可用于分页和分批拉取聊天记录，默认为当前时间
            limit: 10 //可选项，返回的消息条数，默认为10条，最多30条
        }
    
        //查询
        var promise = im.history(option);
    
        promise.then((result) => {
            //console.log("Query history successfully, result:\n " + JSON.stringify(result));
            console.log(result)
        }).catch(function (error) {
            console.log("Failed to query private message, code:" + error.code + " content:" + error.content);
        });
    
    }

    data = {
        id: 1,
        author: 'apple',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
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


                    <div className="messenger">
                        <div className="scrollable sidebar">
                        <Toolbar
                        title="消息列表"
                        leftItems={[
                          <ToolbarButton key="cog" icon="ion-ios-cog" />
                        ]}
                        rightItems={[
                          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
                        ]}
                        />


                        {this.renderConversations()}
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