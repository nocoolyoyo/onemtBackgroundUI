//初始化页面对象
var page = {};
require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
page.unitid = helper.url.queryString("unitid");
//页面所用到配置
page.CONFIG = {
    GET_LIST_API: helper.url.getUrlByMapping("admin/business/find_business_id.shtml"),                  //查询招商单位项目列表接口
    SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/business/update_business_id.shtml"),    		//提交审核接口
    DELETE_API: helper.url.getUrlByMapping("admin/business/update_business_id.shtml"),                  //删除招商单位项目接口
    HANDLE_URL: helper.url.getUrlByMapping("admin/businessunitprojectadd.shtml"),                       //新增/审核/修改招商单位项目url
    SHOW_URL: helper.url.getUrlByMapping("admin/shangjireinfo.shtml"),                                  //查看/审核url
    AUDIT_STATE: 2,          //提交审核状态值
    DELETE_STATUS: 2,       //删除的状态码
    REPLY_STATUS: 1,        //恢复的状态码
    NOPASS_STATE: 4,        //未通过的状态码
    STATE_LIST: {"1": "已发布", "2": "待审核", "3": "草稿", "4": "审核未通过"},
    TYPE_LIST: {"wait": {type: "wait", param: "status=1&state=2", title: "待审核招商单位项目", action: "audit"},
        "draft": {type: "draft", param: "status=1&state=3,4", title: "招商单位项目草稿箱", action: ""},
        "trash": {type: "trash", param: "status=2", title: "招商单位项目垃圾箱", action: ""},
        "all": {type: "all", param: "status=1&unitid="+page.unitid, title: "招商单位项目", action: ""}
    }      //页面全部状态
};
page.type = helper.url.queryString("type") || page.CONFIG.TYPE_LIST.all.type;
page.typeInfo = page.CONFIG.TYPE_LIST[page.type];

//存储页面table对象
page.$tool = $('#tableTools');
page.$table = $('#tableList');

/**
 * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
 */
page.refresh = function () {
    $("#btnSearch").click();
};

//页面级的帮助对象集合
page.derive = {
    //获取表单参数用于搜索
    getParams: function (params) {
        params.start_time = helper.convert.formatTimestamp($("#startTime").val());
        params.end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
        params.ustart_time = helper.convert.formatTimestamp($("#delStartTime").val());
        params.uend_time = helper.convert.formatTimestamp($("#delEndTime").val(), {day: 1});
        params.title = $("#keyword").val();
        params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
        params.y = params.limit;    //服务端分页，每页记录数

        return params;
    },

    //获取提供给表格位置的自适应浏览器的高度，最小高度500
    getAdaptTableHeight: function () {
        var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
        return height >= 500 ? height : 500;
    }
};

//页面事件
page.eventHandler = {
    //打开新增招商单位项目
    showAdd: function () {
        helper.win.open({name: "新增招商单位项目", url: page.CONFIG.HANDLE_URL+"?unitid="+page.unitid});
    },

    //打开审核
    showAudit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var state = rowDate.state;
        var action = "audit";
        if(state=="1")
        	action = "release";
        helper.win.open({name: "审核招商单位项目", url: page.CONFIG.SHOW_URL + "?action=" + action + "&id=" + id+"&unitid="+page.unitid});
    },

    //打开编辑
    showEdit: function (id) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        var state = rowDate.state;
        var action = "audit";
        if(state=="1")
        	action = "release";
        helper.win.open({name: "编辑招商单位项目", url: page.CONFIG.HANDLE_URL + "?action=" + action + "&id=" + id+"&unitid="+page.unitid});
    },

    //提交审核/删除/恢复招商单位项目
    doHandler: function (id, data, api, label) {
        var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
        swal({
            title: "您确定要{0}选中的信息吗？".Format(label),
            text: rowDate.title,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: label,
            cancelButtonText:'取消',
            closeOnConfirm: false
        }, function () {
            swal({title: label + "中，请稍候", type: "info", showConfirmButton: false});
            $.ajax({
                url: api,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        swal({title: label+ "成功", text: "1s后自动消失...", type: "success", timer: 1000});
                        page.$table.bootstrapTable('remove', {
                            field: "id",
                            values: id
                        });
                        page.$table.bootstrapTable('removeByUniqueId', id);
                        page.$table.bootstrapTable('refresh');
                    }else{
                        swal(label + "失败", ret.errMsg, "error");
                    }
                },
                error:function(ret) {
                    swal(label + "失败", "请稍候再重试或联系管理员", "error");
                }
            });
        });
    },

    //提交审核招商单位项目
    submitAudit: function (id) {
        var data = {
            "id": id,
            "state": page.CONFIG.AUDIT_STATE
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "提交审核");
    },

    //删除招商单位项目
    delete: function (id) {
        var data = {
            "id": id,
            "status": page.CONFIG.DELETE_STATUS
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
    },

    //恢复招商单位项目
    reply: function (id) {
        var data = {
            "id": id,
            "status": page.CONFIG.REPLY_STATUS
        };
        page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "恢复");
    },

    //招商单位项目状态为审核拒绝时刻显示拒绝原因
    showTip: function (el) {
        layer.tips($(el).data("tip"), el, {tips: 3});
    }
};


$(document).ready(function () {
    //初始化页面状态
    if(!page.CONFIG.TYPE_LIST[page.type]){
        page.typeInfo = page.CONFIG.TYPE_LIST.wait;
        page.type = page.typeInfo.type;
    }
    document.title = page.typeInfo.title;
    $("#pageSubTitle").html(page.typeInfo.title);

    //按照不同模块切换显示/隐藏
    $("[data-type]").each(function () {
        $(this).data("type") == page.type ? $(this).show() : $(this).hide();
    });

    //初始化日期控件
    $('.form_date').datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        minView: 2,
        forceParse: true
    }).on("click", function (e) {
        //设置日期控件前后日期的依赖
        var $this = $(e.target);
        if($this.attr("data-start")){
            $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
        }
        if($this.attr("data-end")){
            $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
        }
    });

    //表格初始化
    page.$table.bootstrapTable({
        //请求相关
        url: "{0}?{1}".Format(page.CONFIG.GET_LIST_API, page.typeInfo.param),  //AJAX读取列表数据的URL
        method: "get",                  //请求方式
        contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        dataType: "json",               //服务器返回数据类型
        cache: false,                   //不缓存数据
        queryParamsType: "limit",       //查询参数组织方式
        queryParams: function (params) {
            return page.derive.getParams(params);
        },

        //分页相关
        pagination: true,            //是否分页
        pageNumber:1,                //初始化加载第一页，默认第一页
        pageSize: 20,                //每页的记录行数（*）
        pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
        sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

        //表格总体外观相关
        height: page.derive.getAdaptTableHeight(),            //整个表格的高度
        detailView: false,      //是否显示父子表
        cardView: false,        //是否显示详细图
        undefinedText: "—",     //当数据为空的填充字符
        showColumns: true,      //是否显示筛选列按钮
        showRefresh: true,      //是否显示刷新按钮
        clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
        toolbar:'#tableTools',  //工具按钮的容器
        //classes: 'table table-hover table-no-bordered',
        //buttonsClass: 'default btn-outline',

        //表格内容相关设置
        idField:"id",       //当前行主键的id值
        uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
        dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        columns: [{
            field: 'title',
            title: '项目名称',
            align: 'left',
            formatter: function (value, row) {
                return '<a href="javascript:;" onclick="page.eventHandler.showAudit(' + row.id + ')">' + value + '</a>';
            }
        },{
            field: 'create_time',
            title: '创建时间',
            width: "150px",
            formatter: function(value){
                return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            field: 'update_time',
            title: page.type == page.CONFIG.TYPE_LIST.trash.type ? '删除时间' : '修改时间',
            width: "150px",
            formatter: function(value){
                return helper.convert.formatDate(value);
            },
            align: 'center'
        },{
            field: 'state',
            title: '状态',
            width: "100px",
            align: 'center',
            formatter: function(value, row, index){
                switch(value){
                    case 1: return '<span class="label label-primary">已审核</span>';break;
                    case 2: return '<span class="label label-warning">待审核</span>';break;
                    case 3: return '<span class="label label-success">草稿</span>';break;
                    case 4: return '<span class="label label-danger">审核失败</span>';break;
                    default: return "";
                }
            }
        },{
            field: ' ',
            title: '操作',
            align: 'center',
            width: "200px",
            formatter:function(value, row){
                var strHtml= '';
                strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑</button>';
                strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-danger" onclick="page.eventHandler.delete(' + row.id + ')">删除</button>';

                return strHtml;
            }
        }]
    });

    //回车搜索事件
    $("#keyword").keyup(function (event) {
        if(event.keyCode == 13)
            $("#btnSearch").click();
    });

    //新增招商单位项目操作
    $("#btnAdd").click(page.eventHandler.showAdd);

    //搜索
    $("#btnSearch").click(function(){
        var params = page.$table.bootstrapTable('getOptions');
        params = page.derive.getParams(params);

        page.$table.bootstrapTable('refresh',params);
    });

    $(window).resize(function () {
        page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
    })
});
});