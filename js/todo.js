$(document).ready(function () {
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      RenameTasks();
    }
  });
});

function AddTask() {
    if ($("#search").val() != '') {
      NewTask();
      RenameTasks();
    }
};

function NewTask() {
  $("<li/>", {
    "class": "new-task"
  })
    .appendTo('.todo-list')
    .append(
      $("<input/>", {
        "class": "cb",
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
    $('li')[i - 1].id = "fred-" + i;
      ++i;
  }
}

function CheckAll() {
  var i = 0,
    quantitytasks = ($('input:checkbox').length) - 1;
  while (i < quantitytasks) {
    $('input:checkbox')[i].checked = true;
    ++i
  }
}
