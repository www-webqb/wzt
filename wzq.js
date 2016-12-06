$(function(){
	var s=0;
    var firtime=0;
	var canvas1=$('#canvas1').get(0);
	var ctx1=canvas1.getContext('2d');
	var canvas=$('#canvas').get(0);
	var ctx=canvas.getContext('2d');
	var sep=40;
	var sc=4;
	var bc=18;
	var qizis={};
	var audio=$("#audio").get(0);
	var AI=false;
	var gameState="pause";
	var kb={};
	var flag=true;
	var flag2=false;
	var kg1 = true
	var kg2 = true
	
	//进入游戏播放
	var jryx=$(".spy .jryx");
	jryx.on("click",function(){
		audio1.play();
		$(".jryx").css("background","#fff")
		$(".db").css("display","block");
	})
	
	
	
	//秒表部分
    
	ctx1.save();
	function miao(){
		ctx1.clearRect(0, 0, 170, 170);
		ctx1.save();
		ctx1.translate(85,85);
		ctx1.rotate(Math.PI / 180 * 6 *s)
		ctx1.beginPath();
		ctx1.arc(0,0,10,0,Math.PI*2);
		ctx1.moveTo(0,-10);
		ctx1.lineTo(0,-80);
		ctx1.closePath();
		ctx1.stroke();
		ctx1.restore();
		s+=1;
		if(s==61){
			s=0;
		}
	}
	miao();
	ctx1.restore();
	
	
	
	
	
	
	
	//下棋部分
	
	//0.5的偏移量获取xy
	ctx.save();
	function lam(x){
		return(x+0.5)*sep+0.5;
	}
	function yuan(x,y){
		ctx.save();
		ctx.translate(lam(x),lam(y));
		ctx.beginPath();
		ctx.arc(0,0,sc,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	function qipan(){
		ctx.save();
		ctx.beginPath();
		for (var i=0;i<15;i++) {
			ctx.moveTo(lam(0),lam(i));
			ctx.lineTo(lam(14),lam(i));
			ctx.moveTo(lam(i),lam(0));
			ctx.lineTo(lam(i),lam(14));
		}
		ctx.stroke();
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kb[q(i,j)]=true;
				console.log(kb[q(i,j)])
			}
		}
		ctx.closePath();
		ctx.restore();
		yuan(3,3);
		yuan(3,11);
		yuan(7,7);
		yuan(11,3);
		yuan(11,11);
		
	}
	 qipan();
	
	function qizi(x,y,color){
		ctx.save();
		ctx.translate(lam(x),lam(y));
		ctx.beginPath();
		ctx.arc(0,0,bc,0,Math.PI*2);
		if (color==="black") {
			var g=ctx.createRadialGradient(-6,-6,0,0,0,25);
			g.addColorStop(0.05,"#eee");
			g.addColorStop(1,"black");
			ctx.fillStyle=g;
		} else{
			var g=ctx.createRadialGradient(-6,-6,0,0,0,25);
			g.addColorStop(0.1,"#fff");
			g.addColorStop(1,"#ccd");
			ctx.fillStyle=g;
		}
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=3;
		ctx.shadowBlur=4;
		ctx.shadowColor="rgba(0,0,0,0.5)"
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		qizis[x+'_'+y]=color;
		gameState="play";
		delete kb[q(x,y)];
	}
	//棋谱
	function qipu(){
		ctx.save();
		ctx.font='20px/1 微软雅黑';
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		var i=1;
		for (var k in qizis) {
			var arr=k.split('_');
			if (qizi[k]==='#fff') {
				ctx.fillStyle='black';
			}else{
				ctx.fillStyle='#fff';
			}
			ctx.fillText(i++,lam(parseInt(arr[0])),lam(parseInt(arr[1])));
		}
		ctx.restore();
		$("<img>").attr('src',canvas.toDataURL()).appendTo(".box");
		$("<a>").attr('href',canvas.toDataURL()).attr("download","qipu.png").appendTo(".box");
	}
	
	
	//点击棋谱消失
	var djxs=$(".djxs");
	djxs.on("click",function(){
		$(".box").css("display","none");
	})
	//点击棋谱出现；
	var djcx=$(".qp");
	djcx.on("click",function(){
		qipu()
		$(".box").css("display","block")
	})
	
	
	function q(x,y){
		return x+'_'+y;
	}
	function panduan(x,y,color){
		var i;var r=1;
		i=1; while (qizis[q(x+i,y)]===color){r++;i++;}
		i=1; while (qizis[q(x-i,y)]===color){r++;i++;}
		var lie=1;
		i=1; while (qizis[q(x,y-i)]===color){lie++;i++;}
		i=1; while (qizis[q(x,y+i)]===color){lie++;i++;}
		var zx=1;
		i=1; while (qizis[q(x+i,y+i)]===color){zx++;i++;}
		i=1; while (qizis[q(x-i,y-i)]===color){zx++;i++;}
		var yx=1;
		i=1; while (qizis[q(x+i,y-i)]===color){yx++;i++;}
		i=1; while (qizis[q(x-i,y+i)]===color){yx++;i++;}
		return Math.max(r,lie,zx,yx);
	}
	
    
	
	
	
	//人工智能部分
	
	function intel(){
		var max=-Infinity;
		var pos={};
		for(var k in kb){
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"black");
			if(q>max){
				max=q;
				pos.x=x;
				pos.y=y;
			}
		}
		var max2=-Infinity;
		var pos2={};
		for(var k in kb){
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"#fff");
			if(q>max2){
				max2=q;
				pos2.x=x;
				pos2.y=y;
			}
		}
		
		if(max>max2){
			return pos;
		}else{
			return pos2;
		}
	}
	function hclick(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		
		if(qizis[x+"_"+y]){
			return;
		}
		if (AI) {
			qizi(x,y,"black");
            if(panduan(x,y,"black")>=5){
            	$(canvas).off("click");
            	$(".info").addClass('active').find("span").eq(0).html("黑棋").end();
            }
            var p=intel();
            qizi(p.x,p.y,"#fff");
            if(panduan(p.x,p.y,"#fff")>=5){
            	$(canvas).off("click");
            	$(".info").addClass('active').find("span").eq(0).html("白棋").end();
            }
            return false;
		}
		//点击判断落下棋子
	    if (flag) {
	    	audio.play();
	    	qizi(x,y,"black")
//	    	ctx1.clearRect(0,0,170,170);
	    	$(".h").css("background","red")
	    	$(".b").css("background","black")
	    	kg2 = true
			kg1 = false
            if(panduan(x,y,"black")>=5){
            	$(canvas).off("click");
            	$(".info").addClass('active').find("span").eq(0).html("黑棋").end();
            }
	    	
	    } else{
	    	audio.play();
	    	qizi(x,y,"#fff")
//	    	ctx1.clearRect(0,0,170,170);
	    	$(".b").css("background","red")
	    	$(".h").css("background","#fff")
	    	kg2 = false;
			kg1 = true;
			if(panduan(x,y,"#fff")>=5){
            	$(canvas).off("click");
            	$(".info").addClass('active').find("span").eq(0).html("白棋").end();
            }
	    }
	    flag=!flag;
	    flag2=true;
	    s=0;
		var t=setInterval(function(){
			if(flag2){
				miao();
			}
		},1000)
	}
    $(canvas).on("click",hclick);
    
    
    //再来一局
    var again=$('.again');
	again.on("click",function(){
		again.css("background","#ffe4c4")
		window.location.reload();
	});
	//退出
	 var cancel=$('.cancel');
	cancel.on("click",function(){
		cancel.css("background","#ffe4c4")
		window.close();
	});
	
	
	
	//AI部分
	//gameState游戏状态
	$(".chioce").find('div').eq(0).on("click",function(){
		if(gameState==="play"){
			return;
		}
		$(".chioce").find('div').removeClass("red");
		$(".chioce").find('div').eq(0).addClass("red");
		
		AI=false;
	})
	$(".chioce").find('div').eq(1).on("click",function(){
		if(gameState==="play"){
			return;
		}
		$(".chioce").find('div').removeClass("red");
		$(".chioce").find('div').eq(1).addClass("red");
		//console.log(1)
		AI=true;
		//console.log(AI)
	})
	//$(".rj").on("click",function(){
		//if(gameState==="play"){
			//return;
		//}
		//$(".rrs").removeClass("red");
		//$(this).addClass("red");
		//AI=true;
	//})
	
	
	//$(".rrs").on("click",function(){
		//if(gameState==="pause"){
			//return;
		//}
		//$(".rj").removeClass("red");
		//$(this).addClass("red");
		//AI=false;  
	//})
	
	
	

	
	ctx.restore();
	
})
