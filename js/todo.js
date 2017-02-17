$(document).ready(function () {
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask(),
      RenameTasks();
    }
  });
});

function AddTask() {
    if ($("#search").val() != '') {
      NewTask(),
        RenameTasks();
    }
};

function NewTask() {
  $("<li/>", {
    "class": "new-task",
  })
    .appendTo('.todo-list')
    .append(
      $("<input/>", {
        "class": "ch-b",
        type: "checkbox"
      }),
      $("<label/>", {
        "class": "label-task",
        text: $("#search").val()
      }),
      $("<button/>", {
        "class": "destroy"
      })
    )
  $('#search').val('');
};

function RenameTasks() {
  var i = 1,
      quantitytasks = ($('li').length);
  while (i < quantitytasks) {
    while(i < 10){
      $('li')[i-1].id = "fred-0" + i,
        ++i
    }
    $('li')[i-1].id = "fred-" + i,
    ++i
  }
}
