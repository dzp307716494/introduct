var $ = require('./common/libs/zepto-modules/zepto');
require('./common/libs/zepto-modules/event');
require('./common/libs/zepto-modules/ajax');
require('./common/libs/zepto-modules/touch');

var Swiper = require('./common/libs/swiper/swiper.min.js');
var swiperAni = require('./common/libs/swiper/swiper.animate1.0.2.min.js');
var IScroll = require('./common/libs/iscroll/iscroll.js');

// edit index
$(".swiper-container").show();
$("#mainContainer").hide();

var swiper = new Swiper('.swiper-container',{
  onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
    swiperAni.swiperAnimateCache(swiper); //隐藏动画元素 
    swiperAni.swiperAnimate(swiper); //初始化完成开始动画
  }, 
  onSlideChangeEnd: function(swiper){ 
    swiperAni.swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
  }, 
  pagination: '.swiper-pagination',
  paginationClickable: true
  
});

var myScroll;


$("#enter").tap(function(){
	$(".swiper-container").hide();
	$("#mainContainer").show();
	myScroll = new IScroll('#wrapper', { mouseWheel: true });
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
})

function scroll(){
	myScroll = new IScroll('#scroll', { mouseWheel: true });
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

$('.footer-btn').tap(function(){
	$('#scroller').hide();
	$('#scroll').find('ul').html('');
	$(this).addClass('onit').siblings('.footer-btn').removeClass('onit')
	var sid=$(this).attr('id');
	if(sid=='me'){	
		$('#mainContainer').css('backgroundImage',"url(../images/blue.jpg)");
		$('#scroller').show();
		scroll();
	}
	
	
	if(sid=='skill'){
		$('#mainContainer').css('backgroundImage',"url(../images/black.jpg)")
		$.post('http://localhost:8000/'+sid,function(data){
			var num=data.length,string='';
			for(var i=0;i<num;i++){
				string+='<li class="skill"><div><img src="./images/'+i+'.jpg"/></div><div><p>'+data[i].category+'</p><p>'+data[i].name+'</p><p>'+data[i].time+'</p><p>'+data[i].level+'</p></div></li>'
			}
			$('#scroll').find('ul').html(string);
			scroll();
			myScroll.refresh();
		})
	}
	
	
	if(sid=='work'){
		$('#mainContainer').css('backgroundImage',"url(../images/computer.jpg)")
		$.post('http://localhost:8000/'+sid,function(data){
			var num=data.length,string='';
			for(var i=0;i<num;i++){
				string+='<li class="work"><div><img src="./images/trig.svg"/></div><div><p>'+data[i].time+'</p><p>'+data[i].name+'</p></div></li>'	
			}
			$('#scroll').find('ul').html(string);
			scroll();
			myScroll.refresh();
		})
		
	}
	if(sid=='project'){
		$('#mainContainer').css('backgroundImage',"url(../images/black.jpg)")
		$.post('http://localhost:8000/'+sid,function(data){
		var string='';
			for(var i=0;i<2;i++){
				string+='<div class="banner"><img src="./images/banner'+i+'.jpg" /></div>'
				string+='<li class="project"><h3>'+data[i].name+'</h3><p>'+data[i].category+'</p><p>'+data[i].detail+'</p></li>'	
			}
			
			$('#scroll').find('ul').html(string);
			scroll();
			myScroll.refresh();
		})
	}
	
	
	
	/*$.post('http://localhost:8000/project',function(data){
		myScroll = new IScroll('#wrapper', { mouseWheel: true });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			var num=data.length,string='';
			for(var i=0;i<num;i++){
				string+='<li>'+data[i].detail+'</li>'
				string+='<li>'+data[i].description+'</li>'
				string+='<li>'+data[i].detail+'</li>'
				string+='<li>'+data[i].detail+'</li>'
			}
			$('#scroller').find('ul').html(string);
		})*/
	myScroll.refresh();
})
