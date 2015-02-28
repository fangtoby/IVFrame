# IVFrame

前端输入框验证框架 - IVFrame 0.1

 在表单程序中，在页面上需要很多的Js代码来验证表单，每一个field是否必须填写，是否 
只能是数字，是否需要ajax到远程验证,blablabla。 
如果一个一个单独写势必非常的繁琐，所以我们的第一个目标就是构建一个类似DSL的东西， 
用表述的语句而非控制语句来实现验证。 
其次一个个单独写的话还有一个问题就是必须全部验证通过才能提交，但是单独验证会因为 
这个特征而增加很多额外的控制代码，且经常会验证不全面。所以第二个目标就是能够全面 
的整合整个验证的过程。 
最后不能是一个无法扩展的一切写死的实现，必要的扩展性还是要的。

不依赖其它库与框架，运行运行环境ie5+,chrome,firefox,safari

HTML：

<input type="password" class="verify_frame" data-verify="LENGTH(5,20)&COMPARE(pwd_compare)"  placeholder="请输入密码" />
<input type="password" id="pwd_compare" class="" placeholder="请再次输入密码" />
<input type="text" class="verify_frame" data-verify="MOBILE" placeholder="请输入个人手机号码" />

引入框架

<script src="scripts/IVFrame.js"></script>

var _ivf = new IVFrame()

# Init IVFrame

初始化

_ivf.init({
			element:'verify_frame',
			errorClass:'input_error',
			debug:true
		})

使用判断是否通过验证

if(_ivf.verify()){
					//pass verify	
					console.log(_ivf.values)获取验证之后表单数据，使用ajax用于提交到后台
					console.log('pass verify')
}else{
					//verify error	
					console.log(_ivf.values)
					console.log('verify error')
}

拓展性-自定义添加验证模块

Add Modules - length 
	
_ivf.addModules('LENGTH','(n,x)',function(s,p,d){//s=>string,p=>param,d=>dom
			var msgDom = d.nextSibling
			msgDom.innerHTML = ''
			if(s){
				if(s.length > p[0] && s.length < p[1]){
					return true	
				}
			}
			if(d){
				msgDom.innerHTML = '密码长度必须 > '+ p[0]
			}
			return false
		})
		
Add Modules - compare  
	
_ivf.addModules('COMPARE','(t)',function(s,p,d){
			var dom = document.getElementById(p[0])
			var tValue = dom.value
			_ivf.util.removeClass( dom , _ivf._EL )
			
			if(s){
				if(tValue == s){
					return true	
				}
			}
			
			_ivf.util.addClass( dom , _ivf._EL )
			
			return false
	})
