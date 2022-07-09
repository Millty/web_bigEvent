$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initArtCateList();

  //获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  var indexAdd = null;
  //添加类别按钮绑定点击事件
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  //通过代理的形式，为form-add表单绑定submit事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addCates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增文章类别失败");
        }
        initArtCateList();
        layer.msg("新增文章类别成功");
        //根据索引关闭对应的弹出层
        layer.close(indexAdd);
      },
    });
  });

  var indexEdit = null;
  $("tbody").on("click", "#btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "编辑文章分类",
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  //修改分类的表单绑定submit事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updateCate",
      data: $(this).serialize(),

      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改文章类别失败");
        }
        layer.msg("修改文章类别成功");
        layer.close(indexEdit);
      },
    });
  });

  //删除按钮
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        type: "GET",
        url: "/my/article/deletecate/" + id,

        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章类别失败");
          }
          layer.msg("删除文章类别成功");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
