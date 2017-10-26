<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>新增/编辑帮助</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>帮助管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">新增/修改帮助</small></h3>
            </div>
            <div class="ibox-content">
                <form id="frmAddCiphertext" class="form-horizontal">
                    <div class="row text-center m-b">
                        <h2>基本信息</h2>
                    </div>
                    <div id="typLength">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">标题：</label>
                            <div class="col-sm-9">
                                <input id="txtTitle" name="txtTitle" type="text" class="form-control" placeholder="请输入标题，50字以内" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">圈子：</label>
                            <div class="col-sm-9" id="circleselect">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">成员：</label>
                            <div class="col-sm-9" id="userselect">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">图片：</label>
                            <%--文件选择器组件--%>
                            <div id="objImaSelecter" class="col-sm-9">
                                <input id="fileSelector" type="file" multiple name="file" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">内容：</label>
                            <%--富文本编辑器--%>
                            <div class="col-sm-9"><div id="objEditer"></div></div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>信息流推送</h2>
                    </div>
                    <div id="objFeedPush" class="form-horizontal"></div>
                    <div class="hr-line-dashed"></div>
                    <div class="row text-center m-b">
                        <h2>手机设备推送</h2>
                    </div>
                    <div id="objMobilePush"></div>
                    <div class="hr-line-dashed"></div>
                    <%--操作区--%>
                    <div id="divAction" class="row m-t-lg text-center">
                        <button id="btnAudit" type="button" data-action="audit,add,edit,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-floppy-open"></i>&nbsp;&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</button>
                        <button id="btnCancel" type="button" data-action="audit,release,add,edit" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </form>
            </div>

        </div>
    </div>

<%--     富文本编辑器组件summernote
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet" />
    <link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    表单选择框组件
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    上传组件
    <link href="<%=basePath%>static/lib/bootstrap-fileinput/css/fileinput.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/fileinput.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-fileinput/js/locales/zh.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-suggest/bootstrap-suggest.js"></script>
    通知组件
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    表单验证组件
    <script src="<%=basePath%>static/lib/bootstrapValidator/bootstrapValidator.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    树组件
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    <script src="<%=basePath%>static/common/module/module.inputSelector.js?v=<%=StaticVersion%>"></script>

    对第三方组件的自定义插件扩展
    上传对接七牛
    <script src="<%=basePath%>static/common/helper.qiniu.js?v=<%=StaticVersion%>"></script>
    富文本编辑器对接七牛
    <script src="<%=basePath%>static/lib/toastr/customOptions.js?v=<%=StaticVersion%>"></script>
    扩展表单选择框组件的自动替换及切换功能面板插件
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>

    自定义组件
    推送组件
    <script src="<%=basePath%>static/common/module/module.push.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.js?v=<%=StaticVersion%>"></script>
    富文本编辑器组件
    <script src="<%=basePath%>static/common/module/module.editor.js?v=<%=StaticVersion%>"></script>
    文件上传组件
    <script src="<%=basePath%>static/common/module/module.fileUpload.js?v=<%=StaticVersion%>"></script> --%>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>static/page/CM/circleHelpHandle.js?v=<%=StaticVersion%>"></script>
</body>
</html>
