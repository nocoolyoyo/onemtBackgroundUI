/**
 * Created by xiegy on 2017/5/8.
 */
//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'toastr', 'sweetalert', 'module.push', 'fancybox'], function (bs, $, helper, toastr, swal) {
    var module = {
        push: require('module.push')
    };
//页面所用到配置
page.CONFIG = {
    GET_INFO_API: helper.url.getUrlByMapping("admin/circle/find_circle_detail.shtml"),                		//获取圈子接口
    AUDIT_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),           					//圈子审核接口
    DELETE_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                     			//删除圈子接口
    UPDATE_URL: helper.url.getUrlByMapping("admin/circlesAdd.shtml"),                   					//在审核状态进入修改圈子url
    ACTION_LIST: {"show": "show", "trash": "trash", "audit": "audit", "release": "release"},                //页面的所有状态集合
    DELETE_STATUS: 2,       //删除的状态码
    REPLY_STATUS: 1,        //恢复的状态码
    PASS_STATE: 1,          //审核通过的状态码
    NOPASS_STATE: 4,         //审核不通过的状态码
    WAIT_AUDIT_STATE: 2,      //待审核状态码
    DRAFT_STATE: 3            //草稿箱状态码
};

//数据相关
page.action = helper.url.queryString("action") || page.CONFIG.ACTION_LIST.show;
page.id = helper.url.queryString("id");
page.ref = decodeURIComponent(helper.url.queryString("ref"));
page.info = {data: {}};

//常用的jquery对象
page.$button = $("#divAction button");

//页面事件
page.eventHandler = {

    //初始化编辑模式下获取页面内容
    initPageInfo: function () {
        $.ajax({
            url: page.CONFIG.GET_INFO_API,
            type: 'POST',
            data: {id: page.id},
            dataType: 'json',
            success: function (res) {
                if(res.code == 0){
                    page.info.data = res.data;
                    page.assist.initDataBind();
                    return;
                }

                toastr.error("您查看的圈子不存在或发生错误!", "请稍候再重试或联系管理员！");
            },
            error: function () {
                toastr.error("您查看的圈子不存在或发生错误!", "请稍候再重试或联系管理员！");
            }
        });
    },

    audit: function (state) {
        //审核通过/未通过/撤回
        var label = "审核", msg = "", swalType = "";
        switch (state){
            case page.CONFIG.PASS_STATE:
                msg = "您确定通过该圈子的审核吗？";
                swalType = "warning";
                break;
            case page.CONFIG.NOPASS_STATE:
                msg = "请输入未通过的原因！";
                swalType = "input";
                break;
            case page.CONFIG.WAIT_AUDIT_STATE:
                label = "撤回";
                msg = "您确定撤回该圈子的发布吗？";
                swalType = "warning";
                break;
            default:
                return;
        }

        swal({
            title: msg,
            type: swalType,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText:'取消',
            inputPlaceholder: msg,
            closeOnConfirm: false
        }, function () {
            var data = {id: page.id, state: state,status:1};
            if(arguments[0] && typeof arguments[0] == "string")
                data.audit_opinion = arguments[0];

//            page.feedPush.getFormData(data);
//            page.mobilePush.getFormData(data);

            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.AUDIT_API,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    switch (parseInt(ret.code)){
                        case 0:
                            helper.win.changeQuoto({msg: label + "完成！", relation: page.ref});
                            break;
                        case 2:
                            //大置顶冲突
                            swal({title: label + "失败", text: ret.errMsg, type: "error"}, function () {
                                page.eventHandler.edit();
                            });
                            break;
                        default:
                            swal(label + "失败", ret.errMsg, "error");
                            break;
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    },

    //打开修改事件
    edit: function () {
        //跳转到审核状态下的修改页面
        var title = "编辑圈子";
        var url = page.CONFIG.UPDATE_URL + "?action=";
        if(page.action == page.CONFIG.ACTION_LIST.audit || page.action == page.CONFIG.ACTION_LIST.release){
            title = "审核编辑圈子";
            url += page.action;
        }else
            url += "edit";

        url += "&id=" + page.id + "&ref=" + encodeURIComponent(page.ref);

        helper.win.changeQuoto({relationTitle: title, relation: url});
    },

    //删除事件
    delete: function (status) {
        var label = "删除";
        if(status == page.CONFIG.REPLY_STATUS)
            label = "恢复";

        swal({
            title: "您确定要{0}该圈子吗？".Format(label),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: label,
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: page.CONFIG.DELETE_API,
                type : 'POST',
                data: {
                    id: page.id,
                    status: status
                },
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        helper.win.changeQuoto({msg: label + "成功！", relation: page.ref});
                    }else{
                        swal(label + "失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    }


};

//页面辅助类/方法/属性
page.assist = {
    //初始化数据绑定
    initDataBind: function () {

        var data = page.info.data;
        //文章内容
        var logo = data.logo ? data.logo : 'http://logo.static.shangbangbang.com/zhaoshangdanwei.png';
        $('#circleLogo').attr('src',logo);
        $('#circleName').text(data.title);
        $('#master').text(data.circle_zhu_name);
        if(data.circle_zhu_name==undefined||data.circle_zhu_name=='')
        	$('#master').text(data.master_name);
  	  var index = 1;
	  for(var i=0;i <data.circleMemberList.length;i++){
		  if(index === 1){
			  index++;
			  $('#members').append('<span class="label label-primary" style="margin-top:5px;margin-right:5px">'+data.circleMemberList[i].user_name+'</span>');	    
		  }else if(index === 2){
			  index++;
			  $('#members').append('<span class="label label-warning" style="margin-top:5px;margin-right:5px">'+data.circleMemberList[i].user_name+'</span>');
		  }else if(index === 3){
			  index++;
			  $('#members').append('<span class="label label-info" style="margin-top:5px;margin-right:5px">'+data.circleMemberList[i].user_name+'</span>');
		  }else if(index === 4){
			  index++;
			  $('#members').append('<span class="label label-danger" style="margin-top:5px;margin-right:5px">'+data.circleMemberList[i].user_name+'</span>');
		  }else if(index === 5){
			  index=1;
			  $('#members').append('<span class="label label-success" style="margin-top:5px;margin-right:5px">'+data.circleMemberList[i].user_name+'</span>');
		  }
	  }
	    $('#circleRules').text(data.rule);
	    $('#circleBrief').text(data.brief);
	    $('#circleDes').text(data.description);

        //加载完毕
        this.initFlag.INFO = 1;
        this.initComplete();
    },

    //页面初始化完成状态，全部=1表示初始化完成
    initFlag: {INFO: 0},

    //初始化全部完成后操作按钮才可用
    initComplete: function () {
        for(var k in this.initFlag){
            //初始化未完成
            if(!this.initFlag[k]) return;
        }

        page.$button.removeAttr("disabled");
        toastr.clear();
    },

    //变更页面按钮的状态（根据页面状态）
    setButtonShow: function () {
        page.$button.each(function () {
            if($(this).data("action").indexOf(page.action) == -1)
                $(this).hide();
            else
                $(this).show();
        });
        $("#divAction button:visible").eq(0).removeClass("btn-warning").addClass("btn-primary");
    },

    //变更各个操作按钮操作状态
    submitStatus: function ($btn, type) {
        if(type){
            //提交
            page.$button.attr("disabled", "disabled");
            toastr.info("提交中，请稍候...");
            return;
        }

        //提交完成/失败
        page.$button.removeAttr("disabled");
    }
};

//页面初始化
$(document).ready(function(){
    toastr.info("初始化加载中，请稍候...");

    //初始化页面渲染内容
    page.eventHandler.initPageInfo();

    //各小标签的提示符
    $("#divLabelPanel .label").mouseenter(function () {
        layer.tips($(this).data("tip"), this, {tips: 3});
    });

    //初始化各种状态下的按钮
    if(!page.CONFIG.ACTION_LIST[page.action])
        page.action = page.CONFIG.ACTION_LIST.show;
    page.assist.setButtonShow();

    //按钮操作各个事件
    //审核通过事件
    $("#btnAuditPass").click(function () {
        page.eventHandler.audit(page.CONFIG.PASS_STATE);
    });
    //审核不通过事件
    $("#btnAuditNoPass").click(function () {
        page.eventHandler.audit(page.CONFIG.NOPASS_STATE);
    });
    //撤销发布事件
    $("#btnBackout").click(function () {
        page.eventHandler.audit(page.CONFIG.WAIT_AUDIT_STATE);
    });

    //审核状态下跳转到修改（适用于局部小改的情况）
    $("#btnEdit").click(page.eventHandler.edit);

    //删除事件
    $("#btnDelete").click(function () {
        page.eventHandler.delete(page.CONFIG.DELETE_STATUS);
    });
    //恢复事件
    $("#btnReply").click(function () {
        page.eventHandler.delete(page.CONFIG.REPLY_STATUS);
    });
    //取消事件
    $("#btnCancel").click(helper.win.close);
});
});