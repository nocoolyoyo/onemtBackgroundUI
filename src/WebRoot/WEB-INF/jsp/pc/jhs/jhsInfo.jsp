<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>查看江湖事</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../../include/staticInclude.jsp"%>
</head>
<body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight article">
        <div class="ibox float-e-margins">
            <div class="ibox-content col-md-offset-1 col-md-10">
                <div id="divLabelPanel" class="pull-left">
                    <span id="lblState" data-tip="江湖事发布到信息流中的状态" class="label label-inverse">发布状态加载中...</span>
                    <span id="lblStatus" data-tip="已删除的江湖事将进入垃圾箱" class="label label-inverse">垃圾箱状态加载中...</span>
                </div>
                <div id="divEditPanel" class="pull-right m-l-lg"></div>
                <div id="divCreatePanel" class="pull-right m-l-lg" ></div>
                <div id="typLength">
                    <%--长文--%>
                    <div id="divLengthImagesCon" class="form-group" style="width:100%;height:auto;overflow:hidden;margin:50px 0 25px 0;display:none">
                        <label class="col-sm-2 control-label h1">封面：</label>
                        <div class="col-sm-9" id="divLengthImages"></div>
                    </div>
                    <div class="text-center article-title"><h1 id="txtTitle"></h1></div>
                    <blockquote id="txtSummary" class="m-b-lg text-left"></blockquote>
                    <div id="txtContent"></div>
                </div>
                <div id="typShort" class="article-title">
                    <%--短文--%>
                    <div id="txtShortContent" class="text-left font-18" style="word-wrap:break-word"></div>
                    <div id="divShortImages" class="m-t-lg text-left"></div>
                </div>
                <%--相关链接--%>
                <div class="row">
                    <label class="col-sm-2 control-label text-right">相关链接：</label>
                    <div class="col-xs-10 col-md-9" id="articleContainer">
                        
                    </div>
                </div>
                <hr />
                <div class="row text-center m-b">
                    <h2>信息流推送</h2>
                </div>
                <div id="objFeedPush" class="form-horizontal"></div>
                <div class="hr-line-dashed"></div>
                <div class="row text-center m-b">
                    <h2>手机设备推送</h2>
                </div>
                <div id="objMobilePush" class="form-horizontal"></div>
                <hr />
                <%--操作区--%>
                <div id="divAction" class="row m-t-lg text-center">
                    <button id="btnAuditPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-primary dim m-l"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;审核通过</button>
                    <button id="btnAuditNoPass" type="button" data-action="audit" disabled="disabled" class="btn btn-lg btn-danger dim m-l"><i class="fa fa-ban"></i>&nbsp;&nbsp;审核不通过</button>
                    <button id="btnBackout" type="button" data-action="release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-arrow-circle-right"></i>&nbsp;&nbsp;撤&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</button>
                    <button id="btnEdit" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="glyphicon glyphicon-edit"></i>&nbsp;&nbsp;编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辑</button>
                    <button id="btnDelete" type="button" data-action="audit,show,release" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</button>
                    <button id="btnReply" type="button" data-action="trash" disabled="disabled" class="btn btn-lg btn-warning dim m-l"><i class="fa fa-reply"></i>&nbsp;&nbsp;恢&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复</button>
                    <button id="btnCancel" type="button" data-action="audit,show,release,trash" class="btn btn-lg btn-default dim m-l"><i class="fa fa-close"></i>&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                </div>
            </div>
        </div>
    </div>
    <%--通知组件--%>
    <link href="<%=basePath%>static/lib/toastr/css/toastr.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/toastr/js/toastr.min.js"></script>
    <%--表单选择框组件--%>
    <link href="<%=basePath%>static/lib/iCheck/custom.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/iCheck/icheck.min.js"></script>
    <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    <%--树组件--%>
    <link href="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-treeview/bootstrap-treeview.js"></script>
    <%--富文本编辑器组件summernote--%>
    <link href="<%=basePath%>static/lib/summernote/summernote.css" rel="stylesheet" />
    <%--<link href="<%=basePath%>static/lib/summernote/summernote-bs3.css" rel="stylesheet" />--%>
    <script src="<%=basePath%>static/lib/summernote/summernote.min.js"></script>
    <script src="<%=basePath%>static/lib/summernote/summernote-zh-CN.js"></script>
    <%--查看图片组件--%>
    <link href="<%=basePath%>static/lib/fancyBox-2.1.5/source/jquery.fancybox.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/fancyBox-2.1.5/source/jquery.fancybox.js"></script>
    <%--弹窗控件--%>
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    <%--layer弹窗控件--%>
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script>
    <%--文章选择组件--%>
    <script src="<%=basePath%>static/common/module/module.articleSelector.js"></script>
    
    <%--扩展表单选择框组件的自动替换及切换功能面板插件--%>
    <script src="<%=basePath%>static/lib/iCheck/icheck-toggle.js?v=<%=StaticVersion%>"></script>

    <%--自定义组件--%>
    <%--推送组件--%>
    <script src="<%=basePath%>static/common/module/module.push.js?v=<%=StaticVersion%>"></script>
    <script src="<%=basePath%>static/common/module/module.multSelector.js?v=<%=StaticVersion%>"></script>

    <%--页面css及js文件--%>
    <script src="<%=basePath%>js/jhs/jhsInfo.js?v=<%=StaticVersion%>"></script>
</body>
</html>
