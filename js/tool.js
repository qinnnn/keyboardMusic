//工具 组件

export {
    log,
    Loading,
    MusicPlay,
    LetterToKeyboard,
    KeyboardToLetter,
    CreateCanvas,
}

//日志打印 （偷懒）
function log(value) {
    console.log(value)
}

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
        imageList.forEach((imgUrl, key) => {
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
                        this.ongoingCallBack && this.ongoingCallBack(item, this.progress);
                    }
                    $img = null; //销毁
                };
            }
        });
    }
    loadingMusic() { //加载music
        let musicList = this.data.music || {}
        for (let musicUrl in musicList) {
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
                        this.ongoingCallBack && this.ongoingCallBack(item, this.progress);
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
function MusicPlay(musicDataList, stateObject, keyCode, shiftKey = false) {
    return new Promise((resplve, reject) => {
        let key = "a" + keyCode
        if (shiftKey) {
            key = "b" + keyCode
        }
        if (musicDataList[key]) {
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
        } else {
            reject("无此音乐文件");
        }
    });
}

/**
 * 键盘按键转字母
 * @param {*} keyCode 
 */
function KeyboardToLetter(keyCode, shiftKey = false) {
    let obj = {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
    }
    if (obj[keyCode + ""]) {
        if (shiftKey) {
            return obj[keyCode + ""]
        } else {
            return obj[keyCode + ""].toLowerCase()
        }
    }
    return ""
}

/**
 * 字母转键盘按键
 * @param {*} keyCode 
 */
function LetterToKeyboard(keyCode) {
    let obj = {
        "A": "65",
        "B": "66",
        "C": "67",
        "D": "68",
        "E": "69",
        "F": "70",
        "G": "71",
        "H": "72",
        "I": "73",
        "J": "74",
        "K": "75",
        "L": "76",
        "M": "77",
        "N": "78",
        "O": "79",
        "P": "80",
        "Q": "81",
        "R": "82",
        "S": "83",
        "T": "84",
        "U": "85",
        "V": "86",
        "W": "87",
        "X": "88",
        "Y": "89",
        "Z": "90",
        "0": "48",
        "1": "49",
        "2": "50",
        "3": "51",
        "4": "52",
        "5": "53",
        "6": "54",
        "7": "55",
        "8": "56",
        "9": "57",
    }
    return obj[keyCode.toUpperCase()]
}

//创建画布及动画
class CreateCanvas {
    /**
     * @param {*} view 画布存放的地方
     * @param {*} width 画布宽度
     * @param {*} height 画布高度
     */
    app = null
    width = 0
    height = 0
    constructor(view, width, height) {
        this.width = width
        this.height = height
        this.app = new PIXI.Application({
            width: width,
            height: height,
            antialias: true, //抗锯齿
        });
        this.app.renderer.backgroundColor = 0x052bbc8; //修改背景颜色
        view.appendChild(this.app.view); //添加到dom上
    }
    knockCanvas(keyCode) {//根据键盘按键触发动画绘制
        this.keyCode81()
    }
    createRandom(min = 0, max = 1,decimal = 0){ //随机数创建 min最小数 max最大数 decimal小数位数
       let random = Math.random() * ( max - min + 1 ) + min;
        return parseInt(random.toFixed(decimal))
    }
    createColor(){ //随机返回颜色
        return '0x'+(Math.random()*0xffffff<<0).toString(16); 
    }
    keyCode81() { // q
        // let rectangle = new PIXI.Graphics();
        // rectangle.x = this.width/2;
        // rectangle.y = this.height/2;
        // rectangle.beginFill(0x66CCFF,1);
        // rectangle.drawCircle(0, 0, 64);
        // rectangle.alpha = 0
        // rectangle.endFill();
        // this.app.stage.addChild(rectangle);
        // TweenMax.fromTo(rectangle, 3,{alpha:0}, {alpha:1,onComplete:()=>{
        //     TweenMax.to(rectangle, 3,  {alpha:0,x:200, y:100,onComplete:()=>{
        //         this.app.stage.removeChild(rectangle)
        //     }});
            
        // }});
        let color = this.createColor()
        let circleList = []
        let circleNum = this.createRandom(40,45)
        let initAngle = this.createRandom(60,80)
        let initAngle2 = this.createRandom(0,10)
        let size = this.createRandom(4,6)
        for(let i=0;i<circleNum;i++){
            let rectangle = new PIXI.Graphics();
            rectangle.x = this.width/2;
            rectangle.y = this.height/2;
            rectangle.beginFill(color);
            rectangle.drawCircle(i*14, 0, size);
            rectangle.rotation = (((i*23)+initAngle)*Math.PI/180)+initAngle2;
            this.app.stage.addChild(rectangle);
            TweenMax.fromTo(rectangle, 0.5,{alpha:0,width:0,height:0}, {alpha:1,width:size+(i*0.2),height:size+(i*0.2),delay:i*0.03,onComplete:()=>{
                TweenMax.to(rectangle, 0.5,  {delay:1.5,alpha:0,width:0, height:0,onComplete:()=>{
                    this.app.stage.removeChild(rectangle)
                }});
            }});
        }
    }
}
