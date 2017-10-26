<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>榜样再次推送</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link href="<%=basePath%>css/font-awesome.css" rel="stylesheet">
    <link href="<%=basePath%>css/animate.css" rel="stylesheet">
    <link href="<%=basePath%>css/style.css" rel="stylesheet">
    <link href="<%=basePath%>css/bootstrap.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/iCheck/custom.css" rel="stylesheet">
    <link href="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.css" rel="stylesheet">
    <link href="<%=basePath%>css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <style type="text/css">
      .user_push{width:700px;height:auto;overflow:hidden;}
      .user_push .top_warpper{width:100%;heigth:60px}
      .user_push .top_warpper .img{display:inline-block;vertical-align: top;}
      .user_push .top_warpper .info{display:inline-block;line-height:20px}
      .content-warpper{margin-top:15px;height:auto;overflow:hidden}
      .content-warpper .line{height:30px;line-height:30px;margin-top:10px}
      .content-warpper .line.date-line{height:34px}
      .content-warpper .other{padding-left:20px}
      .date-line .layer-date{vertical-align: top}
      .content-warpper .other .other-line{height:30px;;line-height:30px}
      .content-warpper .other .other-select{padding-left:20px}
      .padding-five{padding:0 5px}
      .hidden{display:none}
      .chamber-info{display:inline-block;padding:0}
      .chamber-info li{display:inline-block;list-style-type: none;margin-left:10px;background:#ccc}
      .chamber-info li:first{padding-left:0}
      .rowa{margin-top:20px;position: relative;min-height:34px;overflow:hidden}
      .rowa .col-md-3{width:60px;padding:0;float:left;height:34px;line-height:34px;position:absolute;left:0;top:0;text-align:right}
      .rowa .col-md-9{margin-left:60px;padding:0 10px 0 0}
      .checkbox.i-checks{display:inline-block}
      .top-number{width:50px;text-align:center}
    </style>
  </head>
  <body>
    <div id="user_push">
      <div class="content-warpper">
        <input id="push_val" type="hidden" value="0" />
        <input id="push_user_val" type="hidden" value="0" />
        <div class="radio i-checks" data-value="0" data-name="push">
            <label><input type="radio" checked="" value="option1" name="a"> <i></i> 默认推送：</label>无
        </div>
        <div class="radio i-checks" data-value="1" data-name="push">
            <label><input type="radio" value="option2" name="a"> <i></i> 额外推送</label>
        </div>
        
        <div class="other">
          <div class="radio i-checks" data-value="0" data-name="push-user">
            <label><input type="radio" value="option1" name="b"> <i></i> 全部用户</label>
	      </div>
	      <div class="radio i-checks" data-value="1" data-name="push-user">
	        <label><input type="radio" value="option2" name="b"> <i></i> 部分用户</label>
	      </div>
          <div class="other-select">
            <div class="rowa">
              <div class="col-md-3">商会：</div>
              <div class="col-md-9">
                <ul id="chamber_info" class="chamber-info"></ul>
                <button type="button" class="btn btn-w-m btn-success" id="select_chamber">选择商会</button>
              </div>
            </div>

            <div class="rowa">
             <div class="col-md-3">行业：</div>
             <div class="col-md-9">
                 <ul id="position_info" class="chamber-info"></ul>
                 <button type="button" class="btn btn-w-m btn-success" id="select_position">选择行业</button>
             </div>
            </div>

            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">地区：</div>
	              <div class="col-md-9">
	                  <ul id="region_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_region">选择地区</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">籍贯：</div>
	              <div class="col-md-9">
	                  <ul id="native_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_native">选择籍贯</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">用户组：</div>
	              <div class="col-md-9">
	                  <ul id="users_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_users">选择用户组</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">用户：</div>
	              <div class="col-md-9">
	                  <ul id="user_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_user">选择用户</button>
	              </div>
	          </div>
            </div>
            <div class="other-select-line">
              <div class="rowa">
	              <div class="col-md-3">圈子：</div>
	              <div class="col-md-9">
	                  <ul id="circle_info" class="chamber-info"></ul>
	                  <button type="button" class="btn btn-w-m btn-success" id="select_circle">选择圈子</button>
	              </div>
	          </div>
            </div>
          </div>
        </div>
        <div class="line date-line">
          <div class="checkbox i-checks" style="margin:2px 0" data-value="1" data-name="top">
            <label class="place-top">
               <input type="checkbox" value=""> <i></i> 小置顶
            </label>
          </div>
          <input type="text" value="3" class="top-number" id="top_number">
          <span>时间</span>
          <input placeholder="开始日期" class="form-control layer-date" id="start1">
          <span class="padding-five">到</span>
          <input placeholder="结束日期" class="form-control layer-date" id="end1">
        </div>
        <div class="line date-line">
          <div class="checkbox i-checks" style="margin:2px 0" data-value="2" data-name="top">
            <label class="place-top">
             <input type="checkbox" value=""> <i></i> 大置顶
            </label>
          </div>
          <span>时间</span>
          <input placeholder="开始日期" class="form-control layer-date" id="start2">
          <span class="padding-five">到</span>
          <input placeholder="结束日期" class="form-control layer-date" id="end2">
        </div>
      </div>
    </div>
    <div style="margin-top:25px;padding-left:50px">
      <button class="btn btn-success" type="button" id="push_again">确定推送</button>
      <button class="btn btn-default" type="button" style="margin-left:50px">取消</button>
    </div>
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>js/bootstrap.min.js"></script>
    <script src="<%=basePath%>js/plugins/layer/laydate/laydate.js"></script>
    <script src="<%=basePath%>js/public.js"></script>
    <script src="<%=basePath%>js/MSelector.js"></script>
    <script src="<%=basePath%>vendor/tree-multi-select/jquery.tree-multiselect.js"></script>
    <script src="<%=basePath%>js/CitySelector.js"></script>
    <script src="<%=basePath%>js/TSelector.js"></script>
    <script src="<%=basePath%>js/plugins/iCheck/icheck.min.js"></script>
    <!-- Bootstrap table -->
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
	<script src="<%=basePath%>js/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <script src="<%=basePath%>js/push.js"></script>
    <script src="<%=basePath%>js/plugins/sweetalert/sweetalert.min.js"></script>
    <script type="text/javascript">
    
    var _obj_id = GetQueryString('id'),
        _obj_type = GetQueryString('obj_type'),
        _title = GetQueryString('title'),
        _summary = GetQueryString('summary'),
        _image = GetQueryString('image');
    /*function getNodeId(dom) {
  	  var arr = [];
  	  for(var i = 0; i < dom.length; i++){
  		  arr.push(dom.eq(i).attr('data-id'));
  	  }
  	  return arr.join(',');
    }
    function getNodeText(dom) {
  	  var arr = [];
  	  for(var i = 0; i < dom.length; i++){
  		  arr.push(dom.eq(i).text());
  	  }
  	  return arr.join(',');
    }
    function getValueTime(val){
      if(!val) return '';
  	  return new Date(val).getTime();
    }*/
    /*$('#push_again').on('click',function(){
    	var iframeCon = $('#user_push');
  	    var placeTop = iframeCon.find('label.place-top');
  	    var _type = '',_smalltop = '',_bigtop = '';
  	    if(placeTop.eq(0).find('.icheckbox_square-green').hasClass('checked')){
  		    _type = 1;
  		    _smalltop = 0;
  	    }else{
  		    _smalltop = 1;
  	    }
  	    if(placeTop.eq(1).find('.icheckbox_square-green').hasClass('checked')){
  		    _type = 2;
  		    _bigtop = 0;
  	    }else{
  		    _bigtop = 1;
  	    }
    	$.ajax({
        	url: '<%=basePath%>admin/common/commont_push.shtml',
        	data: {
        		obj_id: _obj_id,
        		obj_type: _obj_type,
        		title: _title,
        		summary: _summary,
        		image: _image,
        		is_default: iframeCon.find('#push_val').val(),
  			    all_user: iframeCon.find('#push_user_val').val(),
  			    sh_ids: getNodeId(iframeCon.find('#chamber_info li')),
  			    sh_names: getNodeText(iframeCon.find('#chamber_info li')),
  			    industry_ids: getNodeId(iframeCon.find('#position_info li')),
  			    industry_names: getNodeText(iframeCon.find('#position_info li')),
  			    region_ids: '',
  			    region_names: getNodeText(iframeCon.find('#region_info li')),
  			    nativeplace_ids: '',
  			    nativeplace_names: getNodeText(iframeCon.find('#native_info li')),
  			    usergroup_ids: getNodeId(iframeCon.find('#users_info li')),
  			    usergroup_names: getNodeText(iframeCon.find('#users_info li')),
  			    user_ids: getNodeId(iframeCon.find('#user_info li')),
  			    user_names: getNodeText(iframeCon.find('#user_info li')),
  			    circle_ids: getNodeId(iframeCon.find('#circle_info li')),
  			    circle_names: getNodeText(iframeCon.find('#circle_info li')),
  			    type: _type,
  			    small_top: _smalltop,
  			    display_position: iframeCon.find('#top_number').val(),
  			    smallstarttime: getValueTime(iframeCon.find('#start1').val()),
  			    smallendtime: getValueTime(iframeCon.find('#end1').val()),
  			    big_top: _bigtop,
  			    bigstarttime: getValueTime(iframeCon.find('#start2').val()),
  			    bigendtime: getValueTime(iframeCon.find('#end2').val())
        	},
            type: 'post',
  		    dataType: 'json',
		    success: function(res){
			  if(res.code == 0){
				  swal({
					  title: '推送成功',
					  type: 'success'
				  });
			  }else if(res.code == 1){
				  swal('推送失败',errMsg,'error');
			  }
		    },
		    error: function(xhr){
			  console.log(xhr);
		    }
        	
        });
    });*/
    </script>
  </body>
</html>
