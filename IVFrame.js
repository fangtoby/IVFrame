/*
html:
	<input type="password" class="verify_frame" data-verify="LENGTH(5,20)"  placeholder="请输入密码" />
js:
	var _ivf = new IVFrame()
			
	Add Self Extends Modules
	_ivf.addModules('LENGTH','(n,x)',function(s,p,d){//s=>string,p=>param,d=>dom
		if(s){
			if(s.length > p[0] && s.length < p[1]){
				return true	
			}
		}
		if(d){
			d.nextSibling.innerHTML = '密码长度必须 > '+ p[0];	
		}
		return false
	})
	
	//Init IVFrame
	_ivf.init({
		element:'verify_frame',
		error:'input_error'
	})
	
	if(_ivf.verify()){
		//pass verify	
	}else{
		//verify error	
	}

*/
(function(W,D){
	//IVF object function
	function ivf(){
	}
	
	ivf.prototype.version = '1.0.0'
	
	//init IVF
	ivf.prototype.init = function(cls){
		if(cls && cls.element){
			//target element class name
			this._CN = cls.element
			//defined split string by attribute of data-verify
			//and split verify and split param string
			this._EL = cls.errorClass || 'input_error_cls'
			this._AVN = cls.attrVName || 'data-verify'
			this._SVS = cls.splitVString || '&'
			this._BPS = cls.breakPString || '('
			this._SPS = cls.splitPString || ','
			this.debug = cls.debug || false
		}else{
			return false
		}
		
		var inputs = D.getElementsByTagName('input')
		//target array
		var verifys = []
		var _item = null
		//add util to this enviroment
		var util = this.util
		//add util to modules prototype
		this.modules.util = this.util
		
		for(var i=0;i<inputs.length;i++){
			_item = inputs[i]
			if(util.hasClass(_item,this._CN)){
				util.removeClass(_item, this._EL)
				verifys.push(_item)
			}
		}
		this.verifys = verifys
	}
	
	ivf.prototype.verify = function(){
		
		var vl = this.verifys.length
		
		if(vl == 0){
			return	true
		}
		this.values = []
		var util = this.util
		//verify note
		var pass = true
		
		for(var j=0;j<vl;j++){
			
			var rules = []
			var dom = this.verifys[j]
			var domVle = dom.value
			var domVry = dom.getAttribute(this._AVN)
			this.values.push(domVle)
			
			if(domVry){
				//"LENGTH(2,12)&INTER"
				//             ^
				rules = domVry.split( this._SVS )
				
				for(var k = 0;k<rules.length;k++){
					var rs = rules[k] 
					//LENGTH(2,12)
					//      ^
					//   this._BPS
					var i = rs.indexOf( this._BPS )
					var rl = rs.length
					var mn = ''
					var paramString = ''
					var param = []
					
					if(i != -1){
						mn = rs.substring(0,i)
						// ( 23 , 43 )
						// ^         ^
						//i+1       rl-1
						pString = rs.substring( i + 1 , rl - 1)
						// 23 , 43
						//    ^ 
						// this._SPS
						param = pString.split( this._SPS )
					}else{
						mn = rs	
					}
					if(this.modules[ mn ]){
						
						util.removeClass( dom , this._EL)
						
						if(!this.modules[ mn ]( domVle , param , dom)){
							util.addClass( dom , this._EL)
							pass = false
						}
					}
				}
			}
		}
		
		if(this.debug == true){
			console.log(this.verifys)
		}
		
		return pass
	}
	
	ivf.prototype.modules = {
		URL:function(s){
			if(this.util.isURL(s)){
				return true
			}
			return false
		},
		DATE:function(s){
			if(this.util.isDate(s)){
				return true
			}
			return false
		},
		MOBILE:function(s){
			if(this.util.isMobile(s)){
				return true
			}
			return false
		},
		EMAIL:function(s){
			if(this.util.isEmail(s)){
				return true
			}
			return false
		},
		INTER:function(s){
			if(this.util.isNum(s)){
				return true
			}
			return false
		}
	}
	/* Add Extends Modules
		_ivf.addModules('LENGTH','(n,x)',function(s,p,d){//s=>string,p=>param,d=>dom
			if(s){
				if(s.length > p[0] && s.length < p[1]){
					return true	
				}
			}
			if(d){
				d.nextSibling.innerHTML = 'Error Msg input value must big then'+ p[0];	
			}
			return false
		})
	*/
	ivf.prototype.addModules = function(name,param,func){
			if(this.modules[ name ]){
				return false	
			}else{
				if(typeof param === 'string'){
					this.modules[ name ] = func
				}else{
					this.modules[ name ] = param
				}	
			}
	}
	
	ivf.prototype.util = {
			splitStringBySpace:function(str){
				var cls = [];
				if(str){
					cls = str.split(' ');
				}
				return cls;
			},
			hasClass:function(obj,name){
				if(obj.className){
					var cls = this.splitStringBySpace(obj.className);
					for(var i=0;i<cls.length;i++){
						if(cls[i] === name){
							return true;	
						}	
					}
				}
				return false;
			},
			addClass:function(obj,cls){
				if(!this.hasClass(obj,cls)){
					var c = this.splitStringBySpace(obj.className);
					c.push(cls);
					obj.className = c.join(' ');
				}
			},
			removeClass:function(obj,cls){
				if(this.hasClass(obj,cls)){
					var clsArr = this.splitStringBySpace(obj.className);
					var newCls = [];
					for(var i = 0;i<clsArr.length;i++){
						if(clsArr[i] != cls){
							newCls.push( clsArr[i] );
						}
					}
					obj.className = newCls.join(' ');
				}
			},
			testLength:function(s,i,x){
				if(s != ''){
					if(i && x === 'undefined'){
						return (s.length >= i);	
					}
					if(i && x){
						return (s.length >= i) && (s.length <= x);
					}
				}
			},
			isNum:function(s){//数字
				if(s!=""){
					if(isNaN(s))
					{
					   return false;
					}
					return true;
				}
			},
            isTel:function(s)//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
            {
				//国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)" 
				 var pattern =/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
				 //var pattern =/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/; 
                 if(s!="")
                 {
                     if(!pattern.exec(s))
                     {
                     	return false;
                     }
					 return true;
                 }
            },
			isEmail:function(s)
          	{ 
				 var pattern =/^[a-zA-Z0-9_\-]{1,}@[a-zA-Z0-9_\-]{1,}\.[a-zA-Z0-9_\-.]{1,}$/;
				 if(s!="")
				 {
					 if(!pattern.exec(s))
					 {
						return false;
					 }
					 return true;
				 }
					
			},
			isMobile:function(s)//校验手机号码：必须以数字开头，除数字外，可含有“-”
          	{ 
				var reg0 = /^13\d{5,9}$/;
				var reg1 = /^153\d{4,8}$/;
				var reg2 = /^159\d{4,8}$/;
				var reg3 = /^0\d{10,11}$/;
				var my = false;
				if (reg0.test(s))my=true;
				if (reg1.test(s))my=true;
				if (reg2.test(s))my=true;
				if (reg3.test(s))my=true;
					if(s!="")
					{
						if (!my)
						{
						 	return false;
						}
						return true;
					}
			},
			isDate:function(s)//校验日期
          	{ 
            	 var pattern =/^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
                 if(s!="")
                 {
                     if(!pattern.exec(s))
                     {
                      	return false;
                     }
					 return true;
                 }   
			},
			isPostalCode:function(s)//校验(国内)邮政编码
          	{ 
             	var pattern =/^[0-9]{6}$/;
                 if(s!="")
                 {
                     if(!pattern.exec(s))
                     {
                      	return false;
                     }
					 return true;
                 }
			},
			isURL:function(s)//校验URL
          	{ 
				var strRegex = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
				var re = new RegExp(strRegex);
				if (re.test(s)) {
					return true;
				} else {
					 return false;
				}
			}
	}
	
	if(!W.IVFrame){
		W.IVFrame = ivf
	}
	
})(window,document);
