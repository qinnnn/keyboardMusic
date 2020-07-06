import {
    Loading,
    MusicPlay
} from './tool.js'
import {
    imgSrc
} from './imgData.js'
import {
    defaultMusicSrc,
} from './defaultData.js'

//全局属性
var musicSrc = "../music/"; //音频存放地址 上线后可能改(大概)
var musicDirectory = "default"; //音乐默认目录
var musicType = "mp3"; //音乐文件类型

var resourcesAddress = { //资源存放地址 初始加载用的
    img: imgSrc,
    music: defaultMusicSrc
};
var canvasDom = null; //画布dom
var musicEventState = false; //音乐键盘事件状态
var musicDataList = {}; //存一下加载完成的音乐对象
var musicVolume = 1; //音量
var silenceState = false; //是否静音

//初始化函数
function init() {
    loadingResources(); //资源加载
    canvasCreate(); //画布创建
    registrationEvents(); //注册触发事件
    keyboardEvents(); //注册键盘事件
}

window.onload = init;

//页面加载
function loadingResources() {
    new Loading({
        data: resourcesAddress,
        complete: function (item) {
            saveMusic(item); //保存音乐对象
            // 显示菜单
            //隐藏loading
            document.querySelector("#loading").className = "music-loading music-loading--none";
            //显示菜单
            document.querySelector("#menu").className = "music-menu music-menu--in";
        },
        ongoing: function (item,progress) {
            saveMusic(item); //保存音乐对象
            // console.log(progress)
        }
    }).start()
}

//画布创建
function canvasCreate() {
    let windowWidth = document.body.offsetWidth; //获取当前页面宽度
    let windowHeight = document.body.offsetHeight; //获取当前页面高度

}

//注册一系列的点击事件
function registrationEvents() {
    //开始按钮
    document.querySelector("#start").addEventListener("click", () => startMusic())
    //返回按钮
    document.querySelector("#return-buttom").addEventListener("click", () => endMusic())
}

//开始
function startMusic() {
    //隐藏菜单栏
    document.querySelector("#menu").className = "music-menu music-menu--none";
    //显示返回按钮
    document.querySelector("#return").className = "music-return music-return--in";
    //开启键盘事件音乐触发
    musicEventState = true
}

//返回
function endMusic() {
    //显示菜单栏
    document.querySelector("#menu").className = "music-menu music-menu--in";
    //隐藏返回按钮
    document.querySelector("#return").className = "music-return music-return--none";
    //关闭键盘事件音乐触发
    musicEventState = true
}

//键盘事件绑定
function keyboardEvents() {
    let lastTime = 0;
    let timer = 20;
    document.onkeydown = function (e) {
        e = e || window.event;
        if (musicEventState) { //判断当前是否可以播放声音
            let now = new Date().getTime();
            if(now-lastTime>timer){ //节流处理
                lastTime = now;
                let stateObject = { //设置播放参数对象
                    musicVolume: musicVolume,
                    silenceState: silenceState
                }
                //调用播放的方法
                MusicPlay(musicDataList,stateObject,e.keyCode,e.shiftKey).then(
                    () => {
                        console.log("播放成功")
                    },
                    (err) => {
                        console.log("播放失败:", err)
                    },
                )
            }
        }
    }
}

//保存音乐对象
function saveMusic(item){
    if(item.type == "music"){
        musicDataList[item.key] = item
    }
}