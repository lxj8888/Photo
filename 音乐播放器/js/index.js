(function () {
    //
    let data=localStorage.getItem('mList')?
        JSON.parse(localStorage.getItem('mList')):[];

    let searcData=[];
//获取元素
    var start=document.querySelector('.start');
    var audio=document.querySelector('audio');
    var next=document.querySelector('.next');
    var prev=document.querySelector('.prev');
    var nowBars=document.querySelector('.nowBars');
    var ctrlBtn=document.querySelector('.ctrl-bth');
    var nowTimeSpan=document.querySelector('.nowTime');
    var totalTimeSpan=document.querySelector('.totalTime');
    var ctrlBars=document.querySelector('.ctrl-bars');
    var modeBtns=document.querySelector('.mode');
    var infoEl=document.querySelector('.info');
    var body=document.querySelector('.body');


    var songSinger=document.querySelector('.ctrl-bars-box span');
    var logoImg=document.querySelector('.logo img');
    var listBox=document.querySelector('.play-list-box ul');


    //变量
     let  index= 0;//标识当前

  let rotateDeg= 0;//记录旋转
    let  tiemr = null;//
let  modeNum=0;//播放模式 0顺序 1单曲 2 随机
let infoTimer=null;

// for (let i=0; i<data.length; i++){
//     str += '<li>';
//     str += '<span>'+data[i].song+'</span>';
//     str += '<span>'+data[i].singer+'</span>';
//     str += '</li>'
//
// }


function loadPlayList(){
    if (data.length){
        let  str='';
        for (let i=0; i<data.length; i++){
            str += '<li>';
            str+='<i>×</i>';
            str += '<span>'+data[i].name+'</span>';
            str += '<span>';
                for(let j=0;j<data[i].ar.length; j++){
                    str+=data[i].ar[j].name+'  ';
                }
                   str +='</span>';

            str +='</li>'

        }

        listBox.innerHTML = str;
    }

}
loadPlayList();



//请求服务器
    $('.search').on('keydown',function (e) {
        if(e.keyCode===13){
            //按回车
            $.ajax({
                url:'https://api.imjad.cn/cloudmusic/',
                //参数
                data:{
                    type:'search',
                    s:this.value

                },
               success: function(data){
                    searcData =data.result.songs;
console.log(data.result.songs);
var str='';
for(var i=0;i<searcData.length;i++){
    str+='<li>';
    str+='<span class="left song">'+searcData[i].name +'</span>';
    str+= '<span class="right singer">';
    for (var j=0; j<searcData[i].ar.length;j++){
        str+=searcData[i].ar[j].name+'  ';
    }
        str+='</span>';
    str+='</li>';

}
$('.searchUI').html(str);
            },
            error: function (err){
     console.log(err);

            }
            });
            this.value='';
        }
    });

    $('.searchUI').on('click','li',function () {
       data.push(searcData[$(this).index()]);
       localStorage.setItem('mList',JSON.stringify(data));
       loadPlayList();
       index=data.length-1;
       init();
       play();

    })

//切换选择
function checkPlay(){
    let  playList=document.querySelectorAll('.play-list-box li');
    // playList[index].className='active';
    for (let i=0;i<playList.length; i++){
        playList[i].className='';

    }
    playList[index].className='active';

}
//加载播放歌曲数量
function loadNUM() {
    $('.play-list').html(data.length);
}
loadNUM();

function formatTime(time) {
    return time>9? time:'0'+time;
}


//
    function info(str) {
    infoEl.innerHTML=str;
    $(infoEl).fadeIn();
    clearInterval(infoTimer);
        infoTimer= setTimeout(function () {
$(infoEl).fadeOut();
    },1000)
    }

    $(listBox).on('click','li',function (e) {
        index =$(this).index();
        init();
        play();
    })

    $(listBox).on('click','i',function (e) {
        // index =$(this).index();
        data.splice($(this).parent().index(),1);
        localStorage.setItem('mList',JSON.stringify(data));
        loadPlayList();
        e.stopPropagation();

        // init();
        // play();
    })
    audio.volume=1;
// console.log(playList);
    //初始化
    function init(){
        rotateDeg =0;
        checkPlay();
        $('.mask').css({
            background: 'url("' + data[index].al.picUrl +'")',
            backgroundSize:'100%'
        })
        audio.src='http://music.163.com/song/media/outer/url?id='+ data[index].id +'.mp3';
        let str= '';
        str +=data[index].name + '----';
        for (let i=0; i<data[index].ar.length;i++){
str +=data[index].ar[i].name+'  ';
        }
        songSinger.innerHTML=str;
        logoImg.src =data[index].al.picUrl;
    }
    init();
//去不重复的随机·数
    function  getRandomNum() {
        let randomNum=Math.floor(Math.random() *data.length);
        if(randomNum===index){
            randomNum=getRandomNum();
        }
        return randomNum;
    }

function play(){
    audio.play();
    clearInterval(tiemr);
    tiemr = setInterval(function () {
        rotateDeg++;
        logoImg.style.transform = 'rotate('+rotateDeg+'deg)';
    },30);
    start.style.backgroundPositionY = '-159px';
}

    //给audio设置播放属性

    // audio.src =data[0].url;
    //播放暂停
    start.addEventListener('click', function () {
   //歌曲暂停时候为true
        if(audio.paused){
play();
        }else{
            audio.pause();

            start.style.backgroundPositionY = '-198px';
            clearInterval(tiemr);

        }

    })//下一曲

    next.addEventListener('click',function () {
   index++;
   index=index>data.length-1?0:index;
     init();
   play();
    });

    
    //上一曲
    prev.addEventListener('click',function () {
        index--;
        index= index> 0 ? data.length - 1:index;
        init();
        play();
    });
    
    
    //切换播放模式
    modeBtns.addEventListener('click',function () {
        modeNum++;
        modeNum=modeNum>2? 0:modeNum;
        switch (modeNum) {
            case 0:
                info('顺序播放');
                modeBtns.style.backgroundPositionX='0px';
                    modeBtns.style.backgroundPositionY='-336px';
                break;
            case 1:
                info('单曲播放');
                modeBtns.style.backgroundPositionX='-64px';
                    modeBtns.style.backgroundPositionY='-336px';
                     break ;
            case 2:
                info('随机播放');
                modeBtns.style.backgroundPositionX='-64px';
                modeBtns.style.backgroundPositionY='-240px';
                     break;

        }
    })
    audio.addEventListener('canplay',function () {
        let  totalTime=audio.duration;
        let totalM=parseInt(totalTime/60);
        let  totalS=parseInt(totalTime%60);
        totalTimeSpan.innerHTML=formatTime(totalM)+':'+formatTime(totalS);
        audio.addEventListener('timeupdate',function () {
            // console.log(1);
            let currentTime=audio.currentTime;
            let currentM =parseInt(currentTime/60);
            let currentS=parseInt(currentTime%60);
            nowTimeSpan.innerHTML=formatTime(currentM)+':'+formatTime(currentS);
             let barWidth=ctrlBars.clientWidth;
            let position =currentTime / totalTime * barWidth;
            nowBars.style.width=position+'px';
            ctrlBtn.style.left=position - 5 +'px';
            if(audio.ended){
                switch (modeNum) {
                    //顺序播放
                    case 0:
                        next.click();
                        break;
                    case 1:
                        init();
                        play();
                        break;
                    case  2:
                        // let  randomNum =Math.floor(Math.random()*data.length);
                        // if (randomNum===index){
                        //
                        // }
                        index=getRandomNum();
                        init();
                        play();
                        break;
                }
            }

        });

  ctrlBars.addEventListener('click',function (e) {
    audio.currentTime = e.offsetX /ctrlBars.clientWidth * audio.duration;
});
ctrlBars.addEventListener('mousedown',function () {
    body.style.userSelect='none';
    window.onmouseover =function (e) {

        audio.currentTime = e.offsetX / ctrlBars.clientWidth * audio.duration;


    }
});
ctrlBars.addEventListener('mouseup',function () {
    window.onmouseover=null;

})

        // console.log(audio.duration);
    })
})();
