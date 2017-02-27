var lb;
var PAGE_LENGTH = 5;
var CURRENT_PAGE = 1;
var PAGE_NUMBER = 0;
var STATE = "all";          // show state var: "all", "active", "completed"

var tasks = [];


$(document).ready(function () {
  // input name of task and added after press key "Enter" or button "Add task"
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      RenameTasks();
      Counters();
    }
  });

  // initial counting of tasks
  Counters();

  // check/uncheck all tasks
  $('#ctrl-cb').click(function () {
    var cbox = $('ul input:checkbox').length,
        cdbox = $('ul input:checked').length;
    if (cbox > 0) {
      if (cdbox === cbox) {
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

  // add task button
  $('#add-task').click(function () {
    if ($("#search").val() != '') {
      NewTask();
      RenameTasks();
      Counters();
    }
  });

  //events on ul
  // delete task
  $('ul').on('click', '.destroy', function () {
    var a = $(this).parent().index();
    tasks.splice(a, 1);
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
    $('.todo-list input:checked').each(function () {
      var a = $(this).parent().index();
      console.log(a);
      tasks.splice(a, 1);
    })
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
  $('#Completed').on('click', SetCurPage);
 // $('#Completed').on('click', ShowCompl);

  // show only not completed
  $('#Active').on('click', SetCurPage);
  //$('#Active').on('click', ShowActive);

  // show all
  //$('#All').on('click', SetCurPage);
  $('#All').on('click', ShowLi);

  // numeric links
  $('.page-links-list').on('click', '.page-links', PageShow);

  // arrows links
 // $('.page-ctrl').on('click', '.border-links', PageShowArrows);

});

// add new task
function NewTask() {
  tasks.push({name: $("#search").val(), checked: false, id: 'fred' + (tasks.length + 1)});
  //clear input text area
  $('#search').val('');
}

function RenameTasks() {
  $(tasks).each(function(i){
    $(this).attr("id", "fred-" + (i + 1));
});
}

function CtrlCheck() {
  var a = $(this).parent().index();
  console.log(a);
  $(tasks[a]).attr('checked', true);
  //Counters();
}

function Counters() {
  var a = tasks.length,
      b = 0,
      c = 0;
  tasks.forEach(function (task) {
    if (task.checked === true){ b++;}
    else {c++;}
  });

  $('#all-counter').text("All: " + a);
  $("#comp-counter").text("Completed: " + b);
  $("#notcomp-counter").text("Active: " + c);

  if (b === a && b != 0){$('#ctrl-cb').prop("checked", true);}
  else {$('#ctrl-cb').prop("checked", false);}
  //AddLinks();
  //SwitchShow();
  ShowLi();
};

// set current page
function SetCurPage() {
  CURRENT_PAGE = 1;
}

// show numeric linked page
function PageShow(event) {
  var a = $(event.target).index(),
    n = PAGE_LENGTH;
  CURRENT_PAGE = a + 1;
  ShowLi();
}

// show current page
function ShowLi() {
  // Add link
  PAGE_NUMBER = Math.ceil($(tasks).length / PAGE_LENGTH);
  if ($('.new-task').length === 0 && (CURRENT_PAGE > 1)) {
    CURRENT_PAGE--;
  }
  $('.page-links-list a').remove();
  $('li').remove();
  if (PAGE_NUMBER > 1) {
    for (var i = 0; i < PAGE_NUMBER; i++) {
      // create hlinks
      $('.page-links-list').append('<a href="#" class="page-links">' + (i + 1) + '</a>');
    }
  }

  $('.page-links-lrg').toggleClass('page-links-lrg');

  //$('.page-vi').toggleClass('page-vi');
  tasks.slice((CURRENT_PAGE - 1) * PAGE_LENGTH, CURRENT_PAGE * PAGE_LENGTH).forEach(function (task) {
    var a = false;
    if (task.checked === true){a = true}
    else {a = false}
    $("<li/>", {
      "class": "new-task"
    }).appendTo('.todo-list')
      .append(
        $("<input/>", {
          "class": "cb",
          type: "checkbox",
          checked: a
        }),
        $("<label/>", {
          "class": "label-task",
          text: task.name
        }),
        $("<button/>", {
          "class": "destroy",
          text: "x"
        }))
  });


  var b = $('.page-links').get(CURRENT_PAGE - 1);
  $(b).toggleClass('page-links-lrg');

  STATE = "all";
}





