//工具 组件

export { Loading }

//数据加载工具
class Loading {
    /**
     * @param {*} options 
     * data 示例数组: {img:[],music:[]}
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
        imageList.forEach((imgUrl) => {
            if (imgUrl) {
                let $img = new Image();
                $img.src = imgUrl;
                $img.onload = () => {
                    $img.onload = null;
                    this.count++;
                    this.progress = (this.count / this.loadingNum).toFixed(2);
                    if (this.count >= this.loadingNum) {
                        this.completeCallBack && this.completeCallBack();
                    } else {
                        this.ongoingCallBack && this.ongoingCallBack(this.progress);
                    }
                };
            }
        });
    }
    loadingMusic() { //加载music
        let musicList = this.data.music || []
        musicList.forEach((musicUrl) => {
            if (musicUrl) {
                let $music = new Audio();
                $music.src = musicUrl;
                $music.addEventListener("canplaythrough", () => {
                    $music.removeEventListener("canplaythrough", () => { })
                    this.count++;
                    this.progress = (this.count / this.loadingNum).toFixed(2);
                    if (this.count >= this.loadingNum) {
                        this.completeCallBack && this.completeCallBack();
                    } else {
                        this.ongoingCallBack && this.ongoingCallBack(this.progress);
                    }
                })
                $music.load();
            }
        });
    }
}