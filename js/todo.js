var lb,
    PAGE_LENGTH = 5,
    ALL_TASK = 1,
    ACTIVE_TASK = 0,
    COMP_TASK = 0;


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

  // add task
  $('#add-task').click(function () {
    if ($("#search").val() != '') {
      NewTask();
      RenameTasks();
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
  $('#Completed').on('click', PageShowCompleted);
  /*function(){
    $('.hidden-li').each(function (i) {
      $(this).toggleClass("hidden-li");
    });
    $('ul input:checkbox').each(function (i) {
      if ($(this).prop("checked") === false){
        $(this).parent().toggleClass("hidden-li");
      }
    });
  });*/
  // show only not completed
  $('#Active').on('click', PageShowActive);
  /*function(){
      $('.hidden-li').each(function (i) {
        $(this).toggleClass("hidden-li");
      });
        $('ul input:checked').each(function (i) {
      $(this).parent().toggleClass("hidden-li");
      });
  });*/
  // show all
  $('#All').on('click', PageShowAll);
  /*function(){
    $('.hidden-li').each(function (i) {
      $(this).toggleClass("hidden-li");
    });
  });*/


  $('#ml').on('click', AddLinks);


  //pageshow
  $('.page-ctrl').on('click', '.page-links', PageShow);

});

// add new task
function NewTask() {
  if ($('li').length < 5){
  $("<li/>", {
    "class": "new-task page-vi"
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
      }))}
  else {$("<li/>", {
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
      }))}

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
  $("#notcomp-counter").text("Active: " + c);
  //AddLinks();
  ShowSwitch();
};



// create hlinks
function AddLinks(){
  var l = $('ul li').length,
      n = PAGE_LENGTH,
      m = Math.floor(l/n);  // количество полных старниц
  if ((l%n) != 0) { m++; } // проверка на неполную страницу в конце
  $('.page-ctrl a').remove();
  for(var i = 0; i < m; i++) {
    $("<a/>", {
      href: "#",
      "class": "page-links",
      text: i + 1
    }).appendTo('.page-ctrl');
  }
}

// show link page
function PageShow(event) {
  var a = $(event.target).index(),
      n = PAGE_LENGTH;
  $('.page-vi').each(function (i) {
    $(this).toggleClass("page-vi");
  });
  if (ALL_TASK === 1) {
    $('.new-task').each(function (i) {
      if (i >= (a * n) && i < (a * n + 5)) {
        $(this).toggleClass("page-vi");
      }
    })
    //PageShowAll();
  }
  if (ACTIVE_TASK === 1) {
    var b = 0,
        c = a * n;
    $('ul input:checkbox').each(function (i) {
      if (i >= (c) && i < (c + 5)) {
        if (($(this).prop("checked") === false) && (b < 5)) {
          $(this).parent().toggleClass("page-vi");
          b++;
        } else {c++;}
      }
    });
    //PageShowActive();
  }
  if (COMP_TASK === 1) {
    $('ul input:checked').each(function (i) {
      if (i >= (a * n) && i < (a * n + 5)) {
        $(this).parent().toggleClass("page-vi");
      }
      });
    //PageShowCompleted();
  }
}

// show switch function
function ShowSwitch(){
  if (ALL_TASK === 1){PageShowAll();}
  if (ACTIVE_TASK === 1){PageShowActive();}
  if (COMP_TASK === 1){PageShowCompleted();}
}


// show page All
function PageShowAll() {
  ALL_TASK = 1;
  ACTIVE_TASK = 0;
  COMP_TASK = 0;
  var a = $('li').index($('.page-vi')[0]),
      n = PAGE_LENGTH;
  AddLinks();
  $('.page-vi').each(function (i) {
    $(this).toggleClass("page-vi");
  });
  $('.new-task').each(function (i) {
    if (i >= (a) && i < (a + 5)) {
      $(this).toggleClass("page-vi");
    }
  })
}

// show page Completed
function PageShowCompleted() {
  ALL_TASK = 0;
  ACTIVE_TASK = 0;
  COMP_TASK = 1;
  var a = $('li').index($('.page-vi')[0]),
      l = $('ul input:checked').length,
      n = PAGE_LENGTH,
      m = Math.floor(l/n);  // количество полных старниц
  console.log(a);
  if ((l%n) != 0) { m++; } // проверка на неполную страницу в конце
  $('.page-ctrl a').remove();
  for(var i = 0; i < m; i++) {
    $("<a/>", {
      href: "#",
      "class": "page-links",
      text: i + 1
    }).appendTo('.page-ctrl');
  }
  $('.page-vi').each(function () {
    $(this).toggleClass("page-vi");
  });
  var b = 0;
  $('.new-task input:checkbox').each(function (i) {
    if (i >= (a) && i < (a + 5)) {
      if (($(this).prop("checked") === true) && (b < 5)) {
        $(this).parent().toggleClass("page-vi");
        b++;
      } else {
        a++;
      }
    }
  });
}

// show page Active
function PageShowActive() {
  ALL_TASK = 0;
  ACTIVE_TASK = 1;
  COMP_TASK = 0;
  var a = $('li').index($('.page-vi')[0]),
    l = ($('ul input:checkbox').length - $('ul input:checked').length),
    n = PAGE_LENGTH,
    m = Math.floor(l/n);  // количество полных старниц
  if ((l%n) != 0) { m++; } // проверка на неполную страницу в конце
  $('.page-ctrl a').remove();
  for(var i = 0; i < m; i++) {
    $("<a/>", {
      href: "#",
      "class": "page-links",
      text: i + 1
    }).appendTo('.page-ctrl');
  }
  $('.page-vi').each(function (i) {
    $(this).toggleClass("page-vi");
  });
  var b = 0;
  $('ul input:checkbox').each(function (i) {
    if (i >= (a) && i < (a + 5)){
    if (($(this).prop("checked") === false) && (b < 5)) {
      $(this).parent().toggleClass("page-vi");
      b++;
    } else {a++;}
    }
  })
}


