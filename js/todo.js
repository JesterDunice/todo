var lb;

$(document).ready(function () {
  // input name of task and added after press key "Enter" or button "Add task"
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      RenameTasks();
      Counters();
    }
  });

  // check/uncheck all tasks
  $('#ctrl-cb').click(function () {
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
    } else $('#ctrl-cb').prop("checked", false);
    Counters()
  });

  // add task
  $('#add-task').click(function () {
    if ($("#search").val() != '') {
      NewTask();
      RenameTasks();
    }
  });
  // Counters of tasks
  Counters();

  //events on ul
  // delete task
  $('ul').on('click', '.destroy', function () {
    $(this).parent().remove();
    // reset ctrl checkbox to unchecked
    if ($('ul input:checkbox').length === 0) {
      $('#ctrl-cb').prop("checked", false);
    } else {
      CtrlCheck();
      RenameTasks();
    }
    Counters();
  });
  // check/uncheck ctrl checkbox
  $('ul').on('click', '.cb', CtrlCheck);
  // delete all completed tasks
  $('#del-completed').click(function () {
    $('.todo-list input:checked').parent().remove();
    // reset ctrl checkbox to unchecked
    if ($('ul input:checkbox').length === 0) {
      $('#ctrl-cb').prop("checked", false);
    } else {
      RenameTasks();
    }
    Counters();
  });
  // rename after dbclk on name of task
  $('ul').on('dblclick', '.label-task', function () {
    //window.lb = $('.label-task').index(this);
    window.lb = $(this);
    $(this).attr("contenteditable", true);
    $(this).focus();
    $('.label-task').keydown(function (event) {
      if ((event.keyCode == 13)) {
        $(window.lb).attr("contenteditable", false);
      }
    });
  });
  // click outside of editable label
  $(document).mouseup(function (event){   // событие клика по веб-документу
    var lab = window.lb;       // тут указываем ID элемента
    if (!$(lab).is(event.target)                 // если клик был не по нашему блоку
      && $(lab).has(event.target).length === 0){ // и не по его дочерним элементам
      $(lab).attr("contenteditable", false); // меняем его аттрибут
    }
  });
  // show only completed
  $('#Only-completed').on('click', function(){
    $('.hidden-li').each(function (i) {
      $(this).toggleClass("hidden-li");
    });
    $('ul input:checkbox').each(function (i) {
      if ($(this).prop("checked") === false){
        $(this).parent().toggleClass("hidden-li");
      }
    });
  });
  // show only not completed
  $('#Only-not-completed').on('click', function(){
      $('.hidden-li').each(function (i) {
        $(this).toggleClass("hidden-li");
      });
        $('ul input:checked').each(function (i) {
      $(this).parent().toggleClass("hidden-li");
      });
  });
  // show all
  $('#All').on('click', function(){
    $('.hidden-li').each(function (i) {
      $(this).toggleClass("hidden-li");
    });
  });
});

// add new task
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
        "class": "destroy",
        text: "x"
      }))
  //clear input text area
  $('#search').val('');
}

function RenameTasks() {
  $('li').each(function(i){
    $(this).attr("id", "fred-" + (i + 1));
});
}

function CtrlCheck() {
  if ($('ul input:checked').length === $('ul input:checkbox').length) {
    $('#ctrl-cb').prop("checked", true);
  } else {
    $('#ctrl-cb').prop("checked", false);
  }
  Counters();
}

function Counters() {
  var a = $('ul input:checkbox').length,
    b = $('ul input:checked').length,
    c = a - b;
  $('#all-counter').text("All: " + a);
  $("#comp-counter").text("Completed: " + b);
  $("#notcomp-counter").text("Not completed: " + c);
};