$(document).ready(function () {
  // input name of task and added after press key "Enter" or button "Add task"
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      RenameTasks();
    }
  });

  // check/uncheck all tasks
  $('#foo').click(function () {
    if ($('ul input:checkbox').length > 0) {
      if ($('ul input:checked').length === $('ul input:checkbox').length) {
        $('ul input:checked').each(function (i) {
          $(this).prop("checked", false);
        })
      } else {
        $('ul input:checkbox').each(function (i) {
          $(this).prop("checked", true);
        })
      }
    } else $('#foo').prop("checked", false);
  });

  // add task
  $('#add-task').click(function () {
    if ($("#search").val() != '') {
      NewTask();
      RenameTasks();
    }
  });
});

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
      }))

  // delete task
  $('.destroy').click(function () {
    $(this).parent().remove();
    // reset ctrl checkbox to unchecked
    if ($('ul input:checkbox').length === 0) {
      $('#foo').prop("checked", false);
    } else {
      CtrlCheck();
      RenameTasks();
    }
  });

  // check/uncheck ctrl checkbox
  $('.cb').on('click', CtrlCheck);

  // delete all completed tasks
  $('#del-all').click(function () {
    $('.todo-list input:checked').parent().remove();
    // reset ctrl checkbox to unchecked
    if ($('ul input:checkbox').length === 0) {
      $('#foo').prop("checked", false);
    } else {
      RenameTasks();
    }
  });

  //clear input text area
  $('#search').val('');

  // rename after dbclk on name of task
  $('.label-task').dblclick(function () {
    var n = $('.label-task').index($(this));
    console.log($(n));
    $('.label-task')[n].attr("contenteditable", true);
    $('.label-task')[n].keyup(function (event) {
      if (($('.label-task')[n].val() != '') && (event.keyCode == 13)) {
        $('.label-task')[n].attr("contenteditable", false);
      }
    });
  });

}

function RenameTasks() {
  $('li').each(function(i){
    $(this).attr("id", "fred-" + (i + 1));
  });
}

function CtrlCheck() {
  if ($('ul input:checked').length === $('ul input:checkbox').length) {
    $('#foo').prop("checked", true);
  } else {
    $('#foo').prop("checked", false);
  }
}

