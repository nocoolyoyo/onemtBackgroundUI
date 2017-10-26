//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'toastrPlus', 'module.push.modal', 'datetimepicker', 'table', 'tableEditable'], function (bs, $, helper, swal, layer, toastr) {
    var module = {
        push: require('module.push.modal')
    };
  //页面所用到配置
    page.CONFIG = {
        GET_LIST_API: helper.url.getUrlByMapping("admin/circle/find_circle_list.shtml?state=1&status=1"),    	//查询已发布圈子列表接口
        SUBMIT_AUDIT_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),    			//取消发布接口（圈子审核接口）
        DELETE_API: helper.url.getUrlByMapping("admin/circle/audit_circle.shtml"),                     //删除圈子接口
        REWRITE_API: helper.url.getUrlByMapping("admin/circle/update_circle_common.shtml"),                     //修改文章活动数据(点赞等数量)
        PUSH_API: helper.url.getUrlByMapping("admin/common/commont_push.shtml"),                                //再次推送的接口
        COMMENT_URL: helper.url.getUrlByMapping("admin/circleCMAll.shtml"),                                     //内容管理
        Follower_URL: helper.url.getUrlByMapping("admin/circleFollowers.shtml"),								//关注的人
        RoleEdit_URL: helper.url.getUrlByMapping("admin/circleRoleEdit.shtml"),									//编辑角色
        HANDLE_URL: helper.url.getUrlByMapping("admin/circlesAdd.shtml"),                  				//修改圈子url ?action=release
        SHOW_URL: helper.url.getUrlByMapping("admin/circleAudit.shtml?action=release"),                      	//查看url
        OBJ_TYPE: 11,            //圈子的类型id
        WAIT_AUDIT_STATE: 2,   //待审核状态码（取消发布回到待审核）
        DELETE_STATUS: 2       //删除的状态码
    };

    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    page.feedPush = new Object();

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
            params.islength = $("#textType").val();
            params.create_start_time = helper.convert.formatTimestamp($("#startTime").val());
            params.create_end_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
            params.title = $("#keyword").val();
            params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
            params.y = params.limit;    //服务端分页，每页记录数

            return params;
        },

        //获取表格参数修改数量
        getNumParams: function (params,elem,newKey) {
            var id = $(elem).parents('tr').data('uniqueid');
            var row = page.$table.bootstrapTable('getRowByUniqueId',id);
            params.obj_id = row.id;
            params.obj_type = page.CONFIG.OBJ_TYPE;
            params[newKey] = params.value;
            return params;
        },

        //获取表格修改的选项
        getEditable: function (title, field) {
            var editable = {
                type: 'text',
                title: title,
                emptytext: '0',
                params: function (params) {
                    return page.derive.getNumParams(params, this, field);
                },
                url: page.CONFIG.REWRITE_API,   //修改的AJAX请求地址
                mode: 'popup',
                success: function (res, newValue) {
                    page.derive.successBack(this, res);
                },
                validate: function (value) {
                    return page.derive.validateNum(value);
                }
            };

            return editable;
        },

        //获取提供给表格位置的自适应浏览器的高度，最小高度500
        getAdaptTableHeight: function () {
            var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
            return height >= 500 ? height : 500;
        },
        //验证修改表格的数字类型
        validateNum: function (value) {
            value = $.trim(value);
            var pattern = /^\d+$/;
            if(value && !pattern.test(value)){
                return '请输入数字！';
            }
        },
        //表格修改成功后回调
        successBack:function(elem,res){
            res = $.parseJSON(res);
            if(res.code == 0) {
                toastr.success('修改成功');
                return;
            }

            toastr.error('修改失败', res.errMsg);
            var id = $(elem).parents('tr').data('uniqueid');
            page.$table.bootstrapTable('updateByUniqueId',id);
        },

        //再次推送
        doPush: function (id) {
            var data = {
                obj_id: id,
                obj_type: page.CONFIG.OBJ_TYPE
            };
            page.feedPush.getFormData(data);

            page.feedPush.$container.find("button").attr("disabled", "disabled");
            $.ajax({
                url: page.CONFIG.PUSH_API,
                type : 'POST',
                data: data,
                dataType : 'json',
                success : function(ret) {
                    if(ret.code == 0){
                        layer.closeAll();
                        toastr.success('再次推送提交成功，请等待审核！');
                        return;
                    }

                    swal("再次推送失败", ret.errMsg, "error");
                    page.feedPush.$container.find("button").removeAttr("disabled");
                },
                error:function(ret) {
                    swal("再次推送失败", "请稍候再重试或联系管理员", "error");
                    page.feedPush.$container.find("button").removeAttr("disabled");
                }
            });
        },
        //取消再次推送
        cancelPush: function () {
            layer.closeAll();
        }
    };

    //页面事件
    page.eventHandler = {
    	//打开新增圈子
    	showAdd: function () {
    		console.info("新增圈子");
    	    helper.win.open({name: "新增圈子", url: page.CONFIG.HANDLE_URL});
    	},
        //内容管理
        showComment: function (id) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            var title = rowDate.title + "-内容管理";
            helper.win.open({name: title, url: page.CONFIG.COMMENT_URL + "?circle_id=" + id});
        },
        //关注的人
        showFollower: function (id) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            var title = rowDate.title+ "-关注的人";
            helper.win.open({name: title, url: page.CONFIG.Follower_URL + "?circle_id=" + id});
        },
        //编辑角色
        showRoleEdit: function (id) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            var title = rowDate.title+ "-编辑角色";
            helper.win.open({name: title, url: page.CONFIG.RoleEdit_URL + "?circle_id=" + id});
        },
        //打开查看
        show: function (id) {
            helper.win.open({name: "查看圈子", url: page.CONFIG.SHOW_URL + "&id=" + id});
        },

        //打开编辑
        showEdit: function (id) {
            helper.win.open({name: "编辑圈子", url: page.CONFIG.HANDLE_URL + "?action=release&id=" + id});
        },

        //打开再次推送窗口
        showPush: function (id) {   //推送
            var row = page.$table.bootstrapTable('getRowByUniqueId', id);
            //初始化信息流推送组件
            var push = new module.push.modal({
                //窗口参数
                modal: {
                    objId: row.id,
                    objType: 11,
                    template: 'circles',
                    title: row.title,
                    image: row.logo,
                    brief: row.brief
                },
                defaultPush: {selected: 1, value: module.push.pushEnum.circle}
                //推送参数
                // readonly:params.readonly,
                // defaultPush: params.defaultPush,
                // range: params.range,
                // smallTop:params.smallTop,
                // bigTop: params.bigTop
            });
        },

        //删除/取消发布圈子
        doHandler: function (id, data, api, label) {
            var rowDate = page.$table.bootstrapTable('getRowByUniqueId', id);
            swal({
                title: "您确定要{0}选中的圈子吗？".Format(label),
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

        //取消发布圈子
        backout: function (id) {
            var data = {
                "id": id,
                "state": page.CONFIG.WAIT_AUDIT_STATE
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.SUBMIT_AUDIT_API, "撤回发布");
        },

        //删除圈子
        delete: function (id) {
            var data = {
                "id": id,
            	"obj_type": page.CONFIG.OBJ_TYPE,
                "status": page.CONFIG.DELETE_STATUS
            };
            page.eventHandler.doHandler(id, data, page.CONFIG.DELETE_API, "删除");
        }
    };


    $(document).ready(function () {
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
            url: page.CONFIG.GET_LIST_API,  //AJAX读取列表数据的URL
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
            minimumCountColumns: 2,

            columns: [{
                field: 'title',
                title: '名称',
                align: 'left',
                formatter: function (value, row) {
                    return '<a href="javascript:;" onclick="page.eventHandler.show(' + row.id + ')">' + value + '</a>';
                }
            },{
                field: 'circle_zhu_name',
                title: '圈主',
                width: "100px",
                align: 'center'
            },{
                field: 'circle_member',
                title: '成员',
                width: "200px",
                align: 'center'
            },{
                field: 'master_name',
                title: '创建人',
                width: "100px",
                align: 'center'
            },{
                field: 'create_time',
                title: '创建时间',
                width: "150px",
                formatter: function(value, row, index){
                    return helper.convert.formatDate(value);
                },
                align: 'center'
            },{
                field: ' ',
                title: '操作',
                align: 'center',
                width: "430px",
                formatter:function(value, row){
                    var strHtml= '&nbsp;<button type="button" class="btn btn-sm btn-info" onclick="page.eventHandler.showComment(' + row.id + ')">内容管理</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showFollower(' + row.id + ')">关注的人</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showRoleEdit(' + row.id + ')">编辑角色</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showPush(' + row.id + ')">推送</button>';
                    strHtml += '&nbsp;<button type="button" class="btn btn-sm btn-warning" onclick="page.eventHandler.showEdit(' + row.id + ')">编辑圈子</button>';
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
        //新增圈子操作
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