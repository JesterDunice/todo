var lb;
var PAGE_LENGTH = 5;
var CURRENT_PAGE = 1;
var PAGE_NUMBER = 0;
var STATE_ACTIVE = 0;
var STATE_COMPLETED = 0;
var STATE_ALL = 1;

var tasks = [];


$(document).ready(function () {
  // input name of task and added after press key "Enter" or button "Add task"
  $("#search").keyup(function (event) {
    if (($("#search").val() != '') && (event.keyCode == 13)) {
      NewTask();
      RenameTasks();
      Counters();
      // tasks.push({name: "", checked: false, id: ""});
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
  $('#Completed').on('click', SetCurPage);
  $('#Completed').on('click', ShowCompl);

  // show only not completed
  $('#Active').on('click', SetCurPage);
  $('#Active').on('click', ShowActive);

  // show all
  //$('#All').on('click', SetCurPage);
  $('#All').on('click', ShowLi);

  // numeric links
  $('.page-links-list').on('click', '.page-links', PageShow);

  // arrows links
  $('.page-ctrl').on('click', '.border-links', PageShowArrows);

});

// add new task
function NewTask() {
  $("<li/>", {
    "class": "new-task"
  }).appendTo('.todo-list')
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
  tasks = [];
  $('li').each(function(i){
    $(this).attr("id", "fred-" + (i + 1));
    tasks.push({name: "all" + (i + 1), checked: $(this).children('.cb').prop('checked'), id: this.id});
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
    c = $('ul input:not(:checked)').length;
  $('#all-counter').text("All: " + a);
  $("#comp-counter").text("Completed: " + b);
  $("#notcomp-counter").text("Active: " + c);
  //AddLinks();
  SwitchShow();
};

// show numeric linked page
function PageShow(event) {
  var a = $(event.target).index(),
    n = PAGE_LENGTH;
  CURRENT_PAGE = a + 1;
  if (STATE_ALL === 1){ShowLi();}
  else if (STATE_ACTIVE === 1){ShowActive();}
  else if (STATE_COMPLETED === 1){ShowCompl();}
}

// show arrows linked page
function PageShowArrows() {
  var a = $(event.target).attr('id'),
    n = PAGE_LENGTH;
  switch (a) {
    case 'first':
      CURRENT_PAGE = 1;
      break;
    case 'prev':
      if (CURRENT_PAGE > 1){
        CURRENT_PAGE = CURRENT_PAGE - 1;
      } else {CURRENT_PAGE = 1;}
      break;
    case 'next':
      if (CURRENT_PAGE < PAGE_NUMBER){
        CURRENT_PAGE = CURRENT_PAGE + 1;
      } else {CURRENT_PAGE = PAGE_NUMBER;}
      break;
    case 'last':
      CURRENT_PAGE = PAGE_NUMBER;
  }
  if (STATE_ALL === 1){ShowLi();}
  else if (STATE_ACTIVE === 1){ShowActive();}
  else if (STATE_COMPLETED === 1){ShowCompl();}
}

// show current state
function SwitchShow() {
  if (STATE_ALL === 1){ShowLi();}
  else if (STATE_ACTIVE === 1){ShowActive();}
  else if (STATE_COMPLETED === 1){ShowCompl();}
  $('.hidden-bl').toggleClass("hidden-bl");
  if (!(PAGE_NUMBER > 1)){$('.border-links').toggleClass("hidden-bl")}
}

// set current page
function SetCurPage() {
  CURRENT_PAGE = 1;
}

// show current page
function ShowLi() {
  // Add link
  PAGE_NUMBER = Math.ceil($('li').length / PAGE_LENGTH);
  $('.page-links-list a').remove();
  if (PAGE_NUMBER > 1) {
    for (var i = 0; i < PAGE_NUMBER; i++) {
      // create hlinks
      $('.page-links-list').append('<a href="#" class="page-links">' + (i + 1) + '</a>');
    }
  }

  $('.page-links-lrg').toggleClass('page-links-lrg');
  if ($('.page-vi').length === 0 && (CURRENT_PAGE > 1)) {
    CURRENT_PAGE--;
  }
  $('.page-vi').toggleClass('page-vi');
  $('li').slice((CURRENT_PAGE - 1) * PAGE_LENGTH, CURRENT_PAGE * PAGE_LENGTH).toggleClass('page-vi');
  var b = $('.page-links').get(CURRENT_PAGE - 1);
  $(b).toggleClass('page-links-lrg');

  STATE_ACTIVE = 0;
  STATE_COMPLETED = 0;
  STATE_ALL = 1;
}

// show all completed
function ShowCompl() {
  // Add link
  PAGE_NUMBER = Math.ceil($('ul input:checked').length / PAGE_LENGTH);
  $('.page-links-list a').remove();
  if (PAGE_NUMBER > 1) {
    for (var i = 0; i < PAGE_NUMBER; i++) {
      // create hlinks
      $('.page-links-list').append('<a href="#" class="page-links">' + (i + 1) + '</a>');
    }
  }
  $('.page-links-lrg').toggleClass('page-links-lrg');
  if ($('.page-vi').length === 0 && (CURRENT_PAGE > 1)) {
    CURRENT_PAGE--;
  }
  $('.page-vi').toggleClass('page-vi');
  $('ul input:checked').slice((CURRENT_PAGE - 1) * PAGE_LENGTH, CURRENT_PAGE * PAGE_LENGTH).parent().toggleClass('page-vi');
  var b = $('.page-links').get(CURRENT_PAGE - 1);
  $(b).toggleClass('page-links-lrg');

  STATE_ACTIVE = 0;
  STATE_COMPLETED = 1;
  STATE_ALL = 0;
}

// show all active
function ShowActive() {
  // Add link
  PAGE_NUMBER = Math.ceil($('ul input:not(:checked)').length / PAGE_LENGTH);
  $('.page-links-list a').remove();
  if (PAGE_NUMBER > 1) {
    for (var i = 0; i < PAGE_NUMBER; i++) {
      // create hlinks
      $('.page-links-list').append('<a href="#" class="page-links">' + (i + 1) + '</a>');
    }
  }

  $('.page-links-lrg').toggleClass('page-links-lrg');
  if ($('.page-vi').length === 0 && (CURRENT_PAGE > 1)) {
    CURRENT_PAGE--;
  }
  $('.page-vi').toggleClass('page-vi');
  $('ul input:not(:checked)').slice((CURRENT_PAGE - 1) * PAGE_LENGTH, CURRENT_PAGE * PAGE_LENGTH).parent().toggleClass('page-vi');
  var b = $('.page-links').get(CURRENT_PAGE - 1);
  $(b).toggleClass('page-links-lrg');

  STATE_ACTIVE = 1;
  STATE_COMPLETED = 0;
  STATE_ALL = 0;
}




