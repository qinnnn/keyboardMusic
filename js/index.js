import {
    log,
    Loading,
    MusicPlay,
    KeyboardKnockDom
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
var knockState = true; //播放音乐时右侧的键盘栏目

//dom事件绑定
var $loading = document.querySelector("#loading"), // 加载控制
    $menu = document.querySelector("#menu"), // 菜单控制
    $start = document.querySelector("#start"), //开始按钮
    $about = document.querySelector("#about"), //关于按钮
    $returnButtom = document.querySelector("#return-buttom"), //返回按钮
    $volumeIcon = document.querySelector("#volume-icon"), // 音量控制
    $return = document.querySelector("#return"), // 返回菜单控制
    $volumeArticle = document.querySelector("#volume-article"), // 音量进度
    $volumeChoice = document.querySelector("#volume-choice"), // 音量按钮
    $volumeModel = document.querySelector("#volume-model") // 音量控件

//初始化函数
function init() {
    loadingResources(); //资源加载
    canvasCreate(); //画布创建
    registrationEvents(); //注册触发事件
    keyboardEvents(); //注册键盘事件
}
//初始化加载
window.onload = init;

//页面加载
function loadingResources() {
    new Loading({
        data: resourcesAddress,
        complete: function (item) {
            saveMusic(item); //保存音乐对象
            // 显示菜单
            //隐藏loading
            $loading.className = "music-loading music-loading--none";
            //显示菜单
            $menu.className = "music-menu music-menu--in";
        },
        ongoing: function (item, progress) {
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
    $start.addEventListener("click", () => startMusic())
    //返回按钮
    $returnButtom.addEventListener("click", () => endMusic())
    //声音图标
    $volumeIcon.addEventListener("click", () => updateVolume())
    //声音图标显示声音进度
    $volumeIcon.addEventListener("mouseover", () => {
        $volumeModel.className = "music-return-model music-return-model--unfold"
    })
    $volumeIcon.addEventListener("mouseout", () => {
        $volumeModel.className = "music-return-model"
    })
    //音量进度点击
    $volumeArticle.addEventListener("click", (e) => clickVolume(e))
}

//开始
function startMusic() {
    //隐藏菜单栏
    $menu.className = "music-menu music-menu--none";
    //显示返回按钮
    $return.className = "music-return music-return--in";
    //开启键盘事件音乐触发
    musicEventState = true
}

//返回
function endMusic() {
    //显示菜单栏
    $menu.className = "music-menu music-menu--in";
    //隐藏返回按钮
    $return.className = "music-return music-return--none";
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
            if (now - lastTime > timer) { //节流处理
                lastTime = now;
                let stateObject = { //设置播放参数对象
                    musicVolume: musicVolume, //音量
                    silenceState: silenceState //是否静音
                }
                //调用播放的方法
                MusicPlay(musicDataList, stateObject, e.keyCode, e.shiftKey).then(
                    () => {
                        console.log("播放成功")
                        //调用键盘敲击操作dom
                        if(knockState){
                            KeyboardKnockDom(e.keyCode,e.shiftKey)
                        }
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
function saveMusic(item) {
    if (item.type == "music") {
        musicDataList[item.key] = item
    }
}

//图标点击，切换静音
function updateVolume() {
    if (silenceState) {
        //修改为非静音
        silenceState = false; 
        //修改音量进度
        let volume = (musicVolume * 100).toFixed(2)
        $volumeChoice.style.left = volume -3 + "px"
        //修改图标
        $volumeIcon.className = "music-return-volume__icon music-return-volume__icon--open"
    } else {
        //修改为静音
        silenceState = true; 
        //修改音量进度
        $volumeChoice.style.left = "-3px"
        //修改图标
        $volumeIcon.className = "music-return-volume__icon music-return-volume__icon--close"
    }
}

//音量进度点击
function clickVolume(e){
    //修改音量进度
    $volumeChoice.style.left = e.offsetX + "px"
    //修改声音大小
    musicVolume = (e.offsetX/100).toFixed(2)
    if(e.offsetX>0){
        //修改图标
        $volumeIcon.className = "music-return-volume__icon music-return-volume__icon--open"
    }else{
        //修改图标
        $volumeIcon.className = "music-return-volume__icon music-return-volume__icon--close"
    }
}
