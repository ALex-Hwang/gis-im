import im from '../config.js'
import GoEasyIM from 'goeasy-im';
import { Button, Input, Layout, Menu, Breadcrumb } from 'antd'
import React, { Component } from 'react'
import TopBar from './TopBar.jsx'
import Message from './Message'
import moment from 'moment';
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
import Compose from './Compose'



const { Search } = Input;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;


class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {User: '', Receiver: '', Conversations: '', Messages: '', Test: {}}
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
        const content = value.target.value
        value.target.value = ""

        let Mess= this.state.Messages;
        let newMessage = {
            timestamp: Date.now(),
            senderId: this.state.User,
            type: 'text',
            payload: {text: content}
        }
        if (!Mess) Mess = [];
        Mess.push(newMessage);
        this.setState({Messages: Mess});




        //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
        let textMessage = im.createTextMessage({
            text: content, //消息内容
            to : {
                type : GoEasyIM.SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasyIM.SCENE.GROUP
                id : this.state.Receiver,
                data:'{"avatar":"/www/xxx.png","nickname":"shit"}' //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
            }
        });


        //发送消息
        var promise = im.sendMessage(textMessage);

        promise.then((message) => {
           console.log("Private message sent successfully.", message);
           //this.getMessages();
        }).catch(function(error) {
            console.log("Failed to send private message，code:" + error.code +",error"+error.content);
        });

    }

    // 選擇聊天對象
    chooseConversation = (e) => {
        this.setState({Receiver: e.currentTarget.id});
        this.getMessages();
        // 標記為已讀
        var promise = im.markPrivateMessageAsRead(e.currentTarget.id);
        promise.then(function(result) {
            //会话列表结果
            // {
            //     code: 200,
            //     content: 'OK'
            // };
        }).catch(function(error) {
            console.log("Failed to mark as read, code:" + error.code + " content:" + error.content);
        });

    };

    // 获取对话列表
    getConversations = () => {
        var promise = im.latestConversations();
        promise.then((result) => {
            //console.log(result)
            this.setState({Conversations: result.content.conversations});

        }).catch(function(error) {
            console.log("Failed to get the latest conversations, code:" + error.code + " content:" + error.content);
        });
    }

    // 持续监听对话列表
    watchConversations = () => {
        var onConversationsUpdated = (conversations) => { 
            let Mess = this.state.Messages;
            console.log(conversations);
            let count = conversations.conversations.length;
            let i = 0;
            while (i < count) {
                console.log(conversations.conversations[i].userId)
                console.log(this.state.Receiver)
                if (conversations.conversations[i].userId===this.state.Receiver && conversations.conversations[i].unread!=0) {
                    let newMessage = {
                        timestamp: conversations.conversations[i].lastMessage.timestamp,
                        senderId: this.state.Receiver,
                        type: 'text',
                        payload: {text: conversations.conversations[i].lastMessage.payload.text}
                    }
                    Mess.push(newMessage);
                }
                i += 1;
            }
            this.setState({Messages: Mess})
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

    // not going to use for now
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
            //console.log(result.content)
            this.setState({Messages: result.content});
        }).catch(function (error) {
            console.log("Failed to query private message, code:" + error.code + " content:" + error.content);
        });
    
    }

    // 這是一個測試函數
    showMessages = () => {
        //console.log(this.state.Messages);
        console.log(this.state.Test);
    }

    // 渲染消息
    renderMessages = () => {
        if (!this.state.Messages) return;
        let i = 0;
        let messageCount = this.state.Messages.length;
        let tempMessages = [];
        
        
        while (i < messageCount) {
          let previous = this.state.Messages[i - 1];
          let current = this.state.Messages[i];
          let next = this.state.Messages[i + 1];
          let isMine = current.senderId === this.state.User;
          let currentMoment = moment(current.timestamp);
          let prevBySameAuthor = false;
          let nextBySameAuthor = false;
          let startsSequence = true;
          let endsSequence = true;
          let showTimestamp = true;
        
          if (previous) {
            let previousMoment = moment(previous.timestamp);
            let previousDuration = moment.duration(currentMoment.diff(previousMoment));
            prevBySameAuthor = previous.senderId === current.senderId;
            
            if (prevBySameAuthor && previousDuration.as('hours') < 1) {
              startsSequence = false;
            }
        
            if (previousDuration.as('hours') < 1) {
              showTimestamp = false;
            }
          }
      
          if (next) {
            let nextMoment = moment(next.timestamp);
            let nextDuration = moment.duration(nextMoment.diff(currentMoment));
            nextBySameAuthor = next.senderId === current.senderId;
        
            if (nextBySameAuthor && nextDuration.as('hours') < 1) {
              endsSequence = false;
            }
          }
      
          tempMessages.push(
            <Message
              key={i}
              isMine={isMine}
              startsSequence={startsSequence}
              endsSequence={endsSequence}
              showTimestamp={showTimestamp}
              data={current}
            />
          );
        
          // Proceed to the next message.
          i += 1;
        }
    
        return tempMessages;
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
                            <div className="message-list">
                        
                                <Toolbar
                                title={this.state.Receiver}
                                rightItems={[
                                <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
                                ]}
                                />
                            <div className="message-list-container">{this.renderMessages()}</div>
                            </div>


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