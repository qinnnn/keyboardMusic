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
    canvas = null
    constructor(view, width, height) {
        const app = new PIXI.Application({
            width: width,
            height: height,
            antialias: true, //抗锯齿
        });
        app.renderer.backgroundColor = 0x052bbc8; //修改背景颜色
        view.appendChild(app.view); //添加到dom上
        PIXI.loader
        .add("../keyboardMusic/image/cat.png")
        .load(setup)
        function setup(){
            let cat = new PIXI.Sprite(PIXI.loader.resources["../keyboardMusic/image/cat.png"].texture)
            app.stage.addChild(cat)
            cat.visible = false;
        }
        // const graphics = new PIXI.Graphics();

    }
    knockCanvas(keyCode) {//根据键盘按键触发动画绘制
        this.keyCode81()
    }
    keyCode81() { // q
        let that = this
        var Obj = function () {
            this.draw = function () {
                that.ctx.beginPath();
                that.ctx.rect(10, 10, 20, 20);
                that.ctx.fillStyle = 'rgba(#515123, 1)';
                that.ctx.fill();
            }
        }
        var obj = new Obj()
        obj.draw()
    }
}


/**
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

// Set to size of browser
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var centerX = canvas.width / 2,
    centerY = canvas.height / 2;

var squares = [],
    colors = ['242, 56, 90', '245, 165, 3', '74, 217, 217', '54, 177, 191'],
    totalSquares = randomNumber(190, 230);


for (var i = 0; i < totalSquares; i++) {

    var p = Math.random(),
        x = centerX,
        y = centerY;

    var square = new Square(x, y, colors[Math.floor(i % colors.length)], randomNumber(3, 14), randomNumber(0.5, 1));

    square.innerX = x;
    square.innerY = y;

    squares.push(square);
}

// Draw squares
function Square(x, y, color, size, alpha) {

    var _this = this;

    _this.x = x || null;
    _this.y = y || null;
    _this.color = color || null;
    _this.size = size || null;
    _this.alpha = alpha || null;

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.rect(_this.x, _this.y, _this.size, _this.size);
        ctx.fillStyle = 'rgba(' + _this.color + ', ' + _this.alpha + ')';
        ctx.fill();
    }

}

function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < squares.length; i++) {
        squares[i].draw(ctx);
    }

    requestAnimationFrame(loop);
}

loop();

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

var longestReturnDuration = 0,
    returnDuration = 0;

function tweenSquares(square) {

    returnDuration = 1.5 + Math.random();

    // Keep longest duration to use for delay
    if (returnDuration > longestReturnDuration) {
        longestReturnDuration = returnDuration;
    }

    TweenMax.to(square, 0.7 + Math.random(), {
        x: randomNumber(0, canvas.width),
        y: randomNumber(0, canvas.height),
        width: 20,
        delay: longestReturnDuration + 1,
        ease: Cubic.easeInOut,
        onComplete: function() {

            TweenMax.to(square, longestReturnDuration, {
                x: centerX,
                y: centerY,
                width: 5,
                ease: Cubic.easeInOut,
                onComplete: function() {
                    tweenSquares(square);
                }
            })
        }
    });
}

for (var i = 0; i < squares.length; i++) {
    tweenSquares(squares[i]);
}
**/