//每次调用$.get()或 $.post() 或$.ajax()时，会先调用ajaxPredilter函数
//在该函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
  //在发起真正的ajax请求之前，统一拼接请求的根路径
  option.url = "http://127.0.0.1:3007" + option.url;
});
