import im from '../config.js'
import GoEasyIM from 'goeasy-im';
import { Button, Input, Layout, Menu, Breadcrumb, Dropdown, message } from 'antd'
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
import axios from 'axios'
import './ToolbarButton/ToolbarButton.css';
import './ChatRoom.css'



const { Search } = Input;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;


class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {User: '', Receiver: '', Conversations: '', Messages: '', Message: '', allMessages: '', File: null, URL: null }
    };


    // on file select (from the pop up window)
    onFileChange = (e) => {
        this.setState({File: e.target.files[0]})
        this.setState({URL: URL.createObjectURL(e.target.files[0])})
        console.log(e.target.files[0])
        message.info('上传成功')
    }


    // choose the receiver using the menu
    chooseReceiver = ({key}) => {
        switch(key) {
            case "1":
                this.setState({Receiver: "专业医师"})
                this.setState({Messages: ""})
                break;
            case "2":
                this.setState({Receiver: "在线客服"})
                this.setState({Messages: ""})
                break;
            case "3":
                this.setState({Receiver: "问诊机器人"})
                this.setState({Messages: ""})
        }
    }
    // the menu for choosing the doctor/bot
    menu = (
    <Menu onClick={this.chooseReceiver}>
        <Menu.Item key="1">专业医师</Menu.Item>
        <Menu.Item key="2">在线客服</Menu.Item>
        <Menu.Item key="3">问诊机器人</Menu.Item>
    </Menu>
    )


    
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

    // set the receiver
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
    sendMessage = (value) => {
        value.preventDefault()
        if (this.state.Receiver==='') {
            message.info('请选择发送对象')

        } else if (this.state.File){
            // construct the imageMessage
            let image = this.state.File
            this.setState({File: null})

            let message = im.createImageMessage({
                file: image, //H5获得的图片file对象，Uniapp和小程序调用chooseImage，success时得到的res对象
                to : {
                    type : GoEasyIM.SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
                    id : this.state.Receiver,
                    data:{"avatar":"/www/xxx.png","nickname":"Neo"} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
                },
                onProgress: (event) => { console.log('file uploading:', event) } //获取上传进度
            });
            
            console.log('upload is OK')
            // send the message
            //发送单聊消息
            var promise = im.sendMessage(message)
            promise.then(()=>{
                message.info('发送成功')
            }).catch((error) => {
                console.log('The error is: ' + error.content)
            })

        } else if (this.state.Message) {
            var content = this.state.Message
            this.setState({Message: ''})
            
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
        
        
        
            if (this.state.Receiver==="问诊机器人") {
                const url = "http://10.112.196.28:5000"
                const data = {
                    sender: this.state.User,
                    question: content
                }
                axios.post(url, data).then((res) => {
                    console.log('robot sent succeeded.')
                })
            } 
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
            }).catch((error) => {
                console.log("Failed to send private message，code:" + error.code +",error"+error.content);
            });
        } else {
            message.info('不能发送空内容')
        }
    }

    // 選擇聊天對象
    chooseConversation = (e) => {
        this.setState({Receiver: e.currentTarget.id});
        // 標記為已讀

        //this.getMessages();
        var promise = im.markPrivateMessageAsRead(e.currentTarget.id);
        promise.then(function(result) {
            //会话列表结果
            // {
            //     code: 200,
            //     content: 'OK'
            // };
        }).then( () => {
            // get the messages after the receiver is chosen
            this.getMessages();
        }
        ).catch(function(error) {
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
                if (conversations.conversations[i].userId===this.state.Receiver && conversations.conversations[i].unread!==0) {
                    if (conversations.conversations[i].lastMessage.type==="image") {
                        message.info('received an image...')
                        let newMessage = {
                           timestamp: conversations.conversations[i].lastMessage.timestamp,
                           senderId: this.state.Receiver,
                           type: 'image',
                           payload: {url: conversations.conversations[i].lastMessage.payload.url}
                       }
                       Mess.push(newMessage);

    
                    } else {
                        let newMessage = {
                           timestamp: conversations.conversations[i].lastMessage.timestamp,
                           senderId: this.state.Receiver,
                           type: 'text',
                           payload: {text: conversations.conversations[i].lastMessage.payload.text}
                       }
                       Mess.push(newMessage);
                    }
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
        var payload;
        while (i < count) {
            if (this.state.Conversations[i].lastMessage.type==='image') {
                payload = "[图片]"
            } else if (this.state.Conversations[i].lastMessage.type==='text') {
                payload = this.state.Conversations[i].lastMessage.payload.text
            } else {
                payload = this.state.Conversations[i].lastMessage.payload.text
            }
            temp.push(
                <div id={this.state.Conversations[i].userId} onClick={this.chooseConversation}>
                <ChatItem 
                avatar="https://www.logosvgpng.com/wp-content/uploads/2021/05/proginov-logo-vector.png" 
                title={this.state.Conversations[i].userId} 
                subtitle={payload}
                unread={this.state.Conversations[i].unread}
                date={this.state.Conversations[i].lastMessage.timestamp}
                />
                </div>
            )
            i+=1;
        }
        return temp;
    }


    // get all the messages in the first place 
    getAllMessages = () => {

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
        }).catch((error) => {
            console.log("Failed to query private message, code:" + error.code + " content:" + error.content);
        });
    
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


    // render the whole page
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


                    <div className="messenger">
                        <div className="scrollable sidebar">
                        <Toolbar
                        title="消息列表"
                        leftItems={[
                          <ToolbarButton key="cog" icon="ion-ios-cog" />
                        ]}
                        rightItems={[
                          <Dropdown overlay={this.menu}>
                          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />                               
                          </a>
                        </Dropdown>
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
                        <TextArea showCount maxLength={100} onPressEnter={this.sendMessage} onChange={this.onChange} value={this.state.Message}/>
                        <div class='image-upload'>
                            <label for="file-input">
                                <i className="toolbar-button ion-ios-image" />
                            </label>
                            <input id="file-input" type="file" onChange={this.onFileChange} />
                        </div>
                        <img src={this.state.URL} />
                        </div>
                        </div>
                    </div>
                    
                </Content>
        </Layout>

        )
    }
}

export default ChatRoom;

