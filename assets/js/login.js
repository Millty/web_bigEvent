$(function () {
  //点击注册
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  //点击登录
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //从 layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  //通过form.verify 函数自定义校验规则
  form.verify({
    //自定义一个pwd的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      //
      var pwd = $(".reg-box [name=pwd]").val();
      if (pwd !== value) {
        return "两次密码不一致";
      }
    },
  });

  //监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    //组织默认行为
    e.preventDefault();
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=pwd]").val(),
    };
    //发起ajax请求
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        //return console.log(res.message);
        return layer.msg(res.message);
      }
      layer.msg("注册成功");
      //模拟点击行为
      $("#link_login").click();
    });
  });

  //监听登录表单的提交事件
  $("#from_login").on("submit", function (e) {
    //组织默认提交
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $(this).serialize(),

      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }
        layer.msg("登录成功");
        //console.log(res.token);
        //将登录成功得到的token字符串，保存到localStorage中
        localStorage.setItem("token", res.token);

        //跳转到后台主页
        location.href = "/index.html";
      },
    });
  });
});
