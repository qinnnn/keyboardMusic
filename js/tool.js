//工具 组件

export { Loading,MusicPlay }

//数据加载工具
class Loading {
    /**
     * @param {*} options 对象
     * data 示例对象: {img:[],music:[]}
     */
    constructor(options) {
        //当前进度
        this.progress = 0;
        //完成的回调
        this.completeCallBack = options.complete || null;
        //进行中的回调
        this.ongoingCallBack = options.ongoing || null;
        //加载的数据
        this.data = options.data || {}; //兼容 music img
        //当前加载资源数
        this.count = 0;
        //加载资源总数
        this.loadingNum = this.getLoadingNum(this.data) || 0
    }
    start() { // 加载启动函数
        this.loadingImg(); //启动加载img
        this.loadingMusic(); //启动加载music
        //可以后续进行加载内容的扩展
    }
    getLoadingNum(data) { //获取data内的资源总数
        let number = 0;
        for (let item in data) {
            if (data[item] instanceof Array) {
                number += data[item].length;
            }
        }
        return number;
    }
    loadingImg() { //加载img
        let imageList = this.data.img || []
        imageList.forEach((imgUrl,key) => {
            if (imgUrl) {
                let $img = new Image();
                $img.src = imgUrl;
                let item = {
                    type: "img",
                    value: $img,
                    key: key
                }
                $img.onload = () => {
                    $img.onload = null;
                    this.count++;
                    this.progress = (this.count / this.loadingNum).toFixed(2);
                    if (this.count >= this.loadingNum) {
                        this.completeCallBack && this.completeCallBack(item);
                    } else {
                        this.ongoingCallBack && this.ongoingCallBack(item,this.progress);
                    }
                    $img = null; //销毁
                };
            }
        });
    }
    loadingMusic() { //加载music
        let musicList = this.data.music || {}
        for(let musicUrl in musicList){
            if (musicList[musicUrl]) {
                let $music = new Audio();
                $music.src = musicList[musicUrl];
                let item = {
                    type: "music",
                    key: musicUrl,
                    src: musicList[musicUrl]
                }
                $music.addEventListener("canplaythrough", () => { //音频加载
                    $music.removeEventListener("canplaythrough", () => { })
                    this.count++;
                    this.progress = (this.count / this.loadingNum).toFixed(2);
                    if (this.count >= this.loadingNum) {
                        this.completeCallBack && this.completeCallBack(item);
                    } else {
                        this.ongoingCallBack && this.ongoingCallBack(item,this.progress);
                    }
                    $music = null; //销毁
                })
                $music.load();
            }
        }
    }
}

//根据键盘按键播放对应的音乐文件
/**
 * 
 * @param {*} musicDataList 音乐对象列表
 * @param {*} stateObject 音频设置对象
 * @param {*} keyCode 触发的按键
 * @param {*} shiftKey 是否有按住shift
 */
function MusicPlay(musicDataList,stateObject,keyCode,shiftKey = false){
    return new Promise((resplve,reject)=>{
        let key = "a"+keyCode
        if(shiftKey){
            key = "b"+keyCode
        }
        if(musicDataList[key]){
            let newAudio = new Audio();
            newAudio.muted = stateObject.silenceState; //是否静音
            newAudio.volume = stateObject.musicVolume; //音量设置

            newAudio.src = musicDataList[key].src; //设置播放的地址
            newAudio.autoplay = true; //加载完成后立即播放
            // newAudio.play(); //播放音频
            newAudio.addEventListener("ended", () => { //音频播放完毕
                newAudio.removeEventListener("ended", () => { })
                newAudio = null; //销毁
            })
            resplve();
        }else{
            reject("无此音乐文件");
        }
    });
}