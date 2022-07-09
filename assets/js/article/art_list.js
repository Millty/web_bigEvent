$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  //定义美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  //定义一个查询的参数对象，将请求参数对象提交到服务器

  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };

  initTable();
  initCate();

  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,

      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章数据失败");
        }

        //使用模板引擎渲染页面数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage();
      },
    });
  }

  //initCate();
  //
  function initCate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败");
        }
        //\
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  //筛选表单绑定submit
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();

    //
    q.cate_id = cate_id;
    q.state = state;

    initTable();
  });

  //定义渲染分页的方法
  function renderPage(total, first) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //分页切换触发jump回调函数
      jump: function (obj) {
        //把最新的页码值，赋值到q这个查询参数对象中
        q.pagenum = obj.curr;

        q.pagesize = obj.limit;

        //根据最新的q重新获取数据列表并渲染表格
        if (!first) {
          initTable();
        }
      },
    });
  }

  $("tbody").on("click", ".btn-delete", function () {
    var len = $(".btn-delete").length;
    var id = $(this).attr("data-id");
    console.log("aa");
    //是否删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,

        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败");
          }
          layer.msg("删除文章成功");
          //判断该页是否还有剩余数据

          if (len === 1) {
            //如果len=1 证明删除完毕后页面上就没有任何数据了
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
