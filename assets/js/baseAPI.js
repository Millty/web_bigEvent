//每次调用$.get()或 $.post() 或$.ajax()时，会先调用ajaxPredilter函数
//在该函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
  //在发起真正的ajax请求之前，统一拼接请求的根路径
  option.url = "http://127.0.0.1:3007" + option.url;

  //统一为有权限的接口设置，设置headers请求头
  if (option.url.indexOf("/my/") !== -1) {
    option.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  //全局统一挂载complete回调函数
  option.complete = function (res) {
    //在complete回调函数中，可以使用res.responseJSON拿到服务器想响应回来的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "No authorization token was found"
    ) {
      //强制清空token
      localStorage.removeItem("token");
      //强制跳转登录页面
      location.href = "/login.html";
    }
  };
});
