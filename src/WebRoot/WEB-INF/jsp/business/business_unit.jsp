<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>招商单位列表</title>
    <%--公用css、js库，含第三方和自有全站通用的，不含：组件和页面级别的静态资源，组件和页面级别的静态资源在最底下定义--%>
    <%@ include file="../include/amdInclude.jsp"%>
</head>
  <body class="gray-bg">
    <div class="wrapper wrapper-content animated fadeInRight dashboard-header">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h3>招商单位管理&nbsp;&nbsp;&nbsp;<small id="pageSubTitle">招商单位列表</small></h3>
            </div>
            <div class="ibox-content ">
                <div id="tableTools">
                    <%--搜索条件bar  start--%>
                    <form class="form-inline bars" onsubmit="return false">
			            <button type="button" class="btn btn-primary" id="btnAdd">新增</button>
                        <div class="input-group date m-b-xs">
                            <input id="startTime" class="form-control form_date" size="10" type="text" data-end="#endTime" value="" placeholder="创建日期-起" readonly />
                            <label for="startTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group date m-b-xs">
                            <input id="endTime" class="form-control form_date" size="10" type="text" data-start="#startTime" value="" placeholder="创建日期-止" readonly />
                            <label for="endTime" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>
                        </div>
                        <div class="input-group m-b-xs">
                            <input id="keyword" type="text" class="form-control" placeholder="请输入搜索关键字" />
                        </div>
                        <button id="btnSearch" type="button" class="btn btn-primary">搜索</button>
                        <button type="reset" class="btn btn-default">重置</button>
                    </form>
                    <%--搜索条件bar  end--%>
                </div>
                <div class="m-l-sm m-r-sm">
                    <%--表格容器--%>
                    <table id="tableList"></table>
                </div>
            </div>
        </div>
    </div>
  </body>

<%--     <!--日期控件-->
    <link href="<%=basePath%>static/lib/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/datetimepicker/datetimepicker.min.js"></script>
    表单控件
    <link href="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="<%=basePath%>static/lib/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
    弹窗控件
    <link href="<%=basePath%>static/lib/sweetalert/sweetalert.css" rel="stylesheet" />
    <script src="<%=basePath%>static/lib/sweetalert/sweetalert.min.js"></script>
    layer弹窗控件
    <link href="<%=basePath%>static/lib/layer/layer.css" rel="stylesheet">
    <script src="<%=basePath%>static/lib/layer/layer.js"></script> --%>
	<script src="<%=basePath%>static/page/business/business_unit.js?v=<%=StaticVersion%>"></script>
</html>
