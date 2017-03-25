//1、缓存技术使用 暂时采用localstorage
//2、节点的存储 body代理，方便开发接入
//3、获取的便利性  get整体页面数据
//4、页面不同，根据页面pathname为key
//5、获取页面值非实时时，延迟处理。
/***
 * @author lowinwu
 * @description 引入直接使用
 * 获取值 $.storedata.get();
 * 设置值 $.storedata.set({aa:'test'});
 */
define(function(require,exports,module){
   
	//优先使用数据库，其次使用本地缓存
	var storage = $.storage;
	
	
	var _getStoreKey = function(){
		return location.pathname;
	}
	/**
	 * {pathName:{hash:{},hash2:{}}}
	 */
	var _setItem = function(key,val){
		var obj = _getItem()||{};//整体数据
		obj[key] = val;
		storage.setItem(_getStoreKey(),obj,true);
	}
	/**
	 * 获取整个page数据
	 */
	var _getItem = function(){
		var obj = storage.getItem(_getStoreKey(),true)||{};
		return obj;
	}
	
	
	  /**
     * @argument options {type:1//整个页面值，2当前页面值}
     */
    var _getPageData = function(type){
        type = type || 1;
        var global_data =  _getItem();
        if( type  == 1){
            return global_data ;
        }else if(type == 2){//当前页面数据
            return global_data[location.hash]
        }
    }
	
    /**
     * 入口页面
     */
    var _initPageData = function(){
    	delegate();
    }
    
    //事件获取
    var  delegate = function(){
    	
        $("body").delegate("input,textarea,select","change",function(e){
        	var obj = _getEleKeyVal(e);
        	_setItem(obj.key,obj.val);
        });
        
        
        //节点获取数据延迟
        $("body").delegate("input","blur",function(e){
         	setTimeout(function(){
                var obj = _getEleKeyVal(e);
                _setItem(obj.key,obj.val);
         	},0);
        });
    }
    
    /**
     * 获取页面元素值
     */
    var _getEleKeyVal = function(e){
    	var val,el    = $(e.currentTarget),
    	    xtype = el.attr("type");
    	    
    	if(xtype == "radio"){//找到为on的id，并将name设置为该id
            val = el.attr("id");
        }else{
        	 val = el.val()
        }
    	return {
    		key : el.attr("name")||el.attr("id"),
    		val : val
    	}
    }
  
    
    /**
     * 设置整个页面值
     * @argument type 1 整体页面值，2当前页面的值
     */
    var _setPageData = function(obj){
    	var storeObj = $.storedata.get()
    	$.map(obj,function(v,k){
    		storeObj[k] = v;
    	});
    	storage.setItem(_getStoreKey(),storeObj,true);
    }
    
    
    _initPageData();
    
	return {
       get  : _getPageData,
       set  : _setPageData
    }
});