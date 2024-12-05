$(function () {
  $(".carousel").carousel({
    pause: "true",
  });

  var statusKritikSaran = $("#kritiksaran-form").attr("statusKritikSaran");
  if (statusKritikSaran == 1) {
    $("html, body").animate(
      {
        scrollTop: $("#kritiksaran-form").offset().top - 300,
      },
      1000,
      "easeInOutExpo"
    );
    return false;
  }
});
