import { Loading } from './tool.js'
import { defaultMusicSrc } from './defaultData.js'

//全局属性
var musicSrc = "../music/"; //音频存放地址 上线后可能改(大概)

var resourcesAddress = { //资源存放地址 初始加载用的
    img: [
        "https://vpzone-xfojsycixf.netdna-ssl.com/wp-content/themes/twentyfourteen-child/images/Virtual_Piano_The_Original_Music_App.png"
    ],
    music: defaultMusicSrc
};
var defaultDirectory = "default"; //音乐默认目录
var canvasDom = null; //画布dom
var musicEventState = false; //音乐事件状态

//初始化函数
function init() {
    loadingResources();//资源加载
    canvasCreate(); //画布创建

}

window.onload = init;

//页面加载
function loadingResources() {
    new Loading({
        data: resourcesAddress,
        complete: function () {
            // console.log("完成")
            //隐藏loading
            document.querySelector("#loading").className="music-loading music-loading--none";
            //显示菜单
            document.querySelector("#menu").className="music-menu";
        },
        ongoing: function (progress) {
            // console.log(progress)
        }
    }).start()
}

//画布创建
function canvasCreate() {
    let windowWidth = document.body.offsetWidth; //获取当前页面宽度
    let windowHeight = document.body.offsetHeight; //获取当前页面高度

}

//开始
function startMusic(){
    
}

//返回
function endMusic(){

}