import GoEasyIM from 'goeasy-im';
import React, {Component} from 'react'

var options = {
    host:'hangzhou.goeasy.io', //应用所在的区域地址: [hangzhou.goeasy.io, 新加坡暂不支持IM，敬请期待]
    appkey: "BC-8332ff5fd38245cda40b044b8a01bb9c"    //common key        
}

//初始化
var im = GoEasyIM.getInstance(options);

var user = {
    id:'user000',  //当前用户的唯一标识符
    data:'{"avatar":"/www/xxx.png","nickname":"Neo"}' //当前用户的扩展数据, 任意格式的字符串或者对象，用于会话列表conversation.data和群消息的senderData
}

//连接GoEasy
var promise =  im.connect(user);

promise.then(function() {
    console.log("Connection successful.");
}).catch(function(error) {
    console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
});

console.log("test");

class HomePage extends Component {
    render() {
        return <h1>shit</h1>
    }
}

export default HomePage;