(function () {
    //模拟数据
    //页面刚加载就读取本地存储的歌曲列表
    let data=localStorage.getItem('mList')?
    JSON.parse(localStorage.getItem('mList')):[];
// //获取元素
//     let start=document.querySelector(".start");
// let audio=document.querySelector("audio");
// //给audio设置播放路径
//     audio.src=data[0].url;
//     start.addEventListener('click',function () {
//         // console.log(data[0].url);
//         audio.play();
//     });
 let    searchData=[];
    let searchList=[];
    let start=document.querySelector('.start');
    let audio=document.querySelector('audio');
    let next=document.querySelector(".next");
    let prev=document.querySelector(".prev");
    let nowBars=document.querySelector(".nowBars");
    let ctrlBtn=document.querySelector(".ctrl-btn");
    let nowTimeSpan=document.querySelector(".nowTime");
    let totalTimeSpan=document.querySelector(".totalTime");


    let songSinger=document.querySelector(".ctrl-bars-box span");
    let logoImg=document.querySelector(".logo img")
    let ctrlBars=document.querySelector(".ctrl-bars");


    let modeBtn=document.querySelector(".mode");
    let infoEl=document.querySelector(".info");
    let listBox=document.querySelector(".play-list-box ul");

    //变量
    let index=0;//标识当前播放歌曲索引let

let rotateDeg=0;//记录封面专辑角度
    let timer=null;//保存定时器
    let  modeNum=0;//0 顺序播放 1 单曲循环 2 随机播放     播放模式
let    infoTimer =null;


//加载播放列表
    function  loadPlayList() {
    if(data.length) {
        let str = '';//用来累计播放项
        //加载播放列表
        for (let i = 0; i < data.length; i++) {
            str += '<li>';
            str += '<i>×</i>'
            str += '<span>' + data[i].name + '</span>';
            str += '<span>';
            for (let j = 0; j < data[i].ar.length; j++) {
                str += data[i].ar[j].name+' ';
            }
            str += '</span>'

            str += '</li>';

        }

        listBox.innerHTML=str;
    }
}
    loadPlayList();
//请求服务器
    $('.search').on('keydown',function (e) {
       if(e.keyCode===13){
           //按下了回车j键
           $.ajax({
               //服务器请求地址
               url:'https://api.imjad.cn/cloudmusic/',
               //参数
               data:{
                   type:'search',
                   s:this.value
               },
               success:function (data) {
                   searchData=data.result.songs;
                   // console.log(data.result.songs);
                   var str='';
                   for(var i=0;i<searchData.length;i++){
                       str +='<li>';
                       str +='<span class="left song">'+ searchData[i].name +'</span>';
                       str +='<span class="right song">';
                       for(var j=0;j< searchData[i].ar.length;j++){
                      str +=searchData[i].ar[j].name+'  ';
                       }
                       str +=' </span>';
                       str +='</li>';

                   }

              $('.searchUl').html(str);


               },
               error:function (err) {
                   console.log(err);
               }
           });
           this.value='';

       }
    });
    //点击搜索列表
    $('.searchUl').on('click','li',function () {
data.push(searchData[$(this).index()]);
localStorage.setItem('mList',JSON.stringify(data));
        loadPlayList();
        index =data.length-1;
        init();
        play();

    });

//切换播放列表
function checkPlayList(){
    let playList=document.querySelectorAll('.play-list-box li');
for(let i=0; i<playList.length;i++){
    playList[i].className='';
}
    playList[index].className='active';
}
//加载播放歌曲的数量
function loadNum() {
   $('.play-list').html(data.length);

}
    loadNum();
//格式化时间
    function formatTime(time) {
        return time >9 ? time : '0'+time;
    }
// console.log(playList);
//提示框提示
    function info(str) {
        infoEl.innerHTML=str;
        $(infoEl).fadeIn();
        clearInterval(infoTimer)
        // style.display='block';
       infoTimer = setTimeout(function () {
            $(infoEl).fadeout();
            // infoEl.style.display='none';
        },1000)
    }
//点击播放列表
$(listBox).on('click','li',function () {
index =$(this).index();
init();
play();

});

    $(listBox).on('click','i',function (e) {

       data.splice($(this).parent().index(),1);
        localStorage.setItem('mList',JSON.stringify(data));
        loadPlayList();
        e.stopPropagation();
    });
// 0没有声音 1声音最大
// audio.volume=0.5;
    //初始化播放
    function init(){
        //给audio设置播放路径
        rotateDeg=0;
        checkPlayList();
        $('.mask').css({

            background: 'url("'+ data[index].al.picUrl +'")',
            // backgroundSize:'100%',

        });
        audio.src='http://music.163.com/song/media/outer/url?id='+data[index].id+'.mp3'
        let str='';
        str +=data[index].name+'---';
        for(let i=0; i< data[index].ar.length;i++){
            str +=data[index].ar[i].name +'  ';
        }
        songSinger.innerHTML=str;
        logoImg.src=data[index].al.picUrl;
    }
init();
//取不重复的随机数
    function  getRandomNum() {
        let randomNum=Math .floor(Math.random()* data.length);
        if(randomNum===index){
randomNum=getRandomNum();

        }
        return randomNum;
    }
//播放音乐
    function play(){
        audio.play();
        clearInterval(timer);
        timer= setInterval(function () {
            rotateDeg++;
            logoImg.style.transform='rotate('+rotateDeg+'deg)';
        },30);
        start.style.backgroundPositionY='-160px';
    }


    //播放和暂停
    start.addEventListener('click',function () {
        //检测歌曲是播放状态还是暂停状态
if(audio.paused){
       play();
        }else{
    //歌曲暂停的时候为true
    clearInterval(timer);
    audio.pause();
    start.style.backgroundPositionY='-199px';
        }
    });
    //下一曲
    next.addEventListener('click',function () {
        index++;
        index=index > data.length -1 ? 0: index;
        init();
        play();
    });
    //上一曲
    prev.addEventListener('click',function () {
        index--;
        index=index <0 ? data.length -1 : index;
        init();
        play();
    });
    //切换播放模式
 modeBtn.addEventListener('click',function () {
     modeNum++;
     modeNum=modeNum > 2 ? 0 : modeNum;
     switch (modeNum) {
         case  0:
             info('顺序播放');
             modeBtn.style.backgroundPositionX='0px' ;
             modeBtn.style.backgroundPositionY= '-336px';
             break;
         case  1:
             info('单曲播放');
             modeBtn.style.backgroundPositionX= '-64px';
             modeBtn.style.backgroundPositionY= '-336px' ;
             break;
         case  2:
             info('随机播放');
             modeBtn.style.backgroundPositionX='-64px' ;
             modeBtn.style.backgroundPositionY= '-241px';
             break;
     }
     
 })
//音乐准备完成
    audio.addEventListener('canplay',function () {
       let totalTime=audio.duration;
               let totalM=parseInt(totalTime / 60);
               let tatalS=parseInt(totalTime % 60);
               totalTimeSpan.innerHTML=formatTime(totalM)+':'+formatTime(tatalS);
               // console.log(totalS);
        audio.addEventListener('timeupdate',function () {
    let currentTime=audio.currentTime;
    let currentM=parseInt(currentTime / 60);
    let currentS=parseInt(currentTime % 60);
    nowTimeSpan.innerHTML=formatTime(currentM)+':'+formatTime(currentS);

    let barWidth=ctrlBars.clientWidth;
    let position = currentTime / totalTime * barWidth;
 nowBars.style.width=position +'px';
 ctrlBtn.style.left=position -8 +'px';
 if(audio.ended){
switch (modeNum) {
    //顺序播放
    case  0:
        next.click();
        break;
        //单曲循环
    case  1:
init();
play();
        break;
        //随机播放
    case  2:
index=getRandomNum();
init();
play();
        break;
}
 }
    // console.log(audio.currentTime);
})
        // console.log('我准备完成')
        // console.log(audio.duration);
    });
    ctrlBars.addEventListener('click',function (e) {
     audio.currentTime=e.offsetX / ctrlBars.clientWidth * audio.duration;
    });
    ctrlBars.addEventListener('mousedown', function () {
        window.addEventListener('mousemove',function (e) {
            // audio.currentTime=e.offsetX / ctrlBars.clientWidth * audio.duration;

        })

    })

})();