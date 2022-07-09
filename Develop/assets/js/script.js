/**
* @author  Cristobal A Barberis
* @version 0.1, 06/06/22
*/

// office hours
var start = "09:00";
var end = "17:00";

// globals
var date = null;
var editing = false;
var editingDatetime = "";
var textInput = null;

// load events from local storage
var loadEvets = function () {
  var eventsFromStorage = JSON.parse(localStorage.getItem("events"));
  if (eventsFromStorage) {
    return eventsFromStorage;
  }else{
    return [];
  }
   
}
var events = loadEvets();

// day calendar builder 
var calendarBuilder = function(dateInput) {
  var valid = moment(dateInput, "YYYY-MM-DD", true).isValid();
  if (!dateInput){
      date = moment().format("YYYY-MM-DD");
  }else if(valid){
    date = dateInput;
  } else {
      date = moment(dateInput, "MM/DD/YYYY").format("YYYY-MM-DD");
  } 

  // show office hours
  var startHour = moment(date + ' ' + start);
  var endHour = moment(date + ' ' + end);
  var duration = moment.duration(endHour.diff(startHour));
  var hours = duration.asHours();

  // reset day calendar
  $("#calendar").empty();

  for (var i = 0; i <= hours; i++) {
    var dateTime = date + " " + startHour.format("LT")
    newDate = moment(dateTime, "YYYY-MM-DD hh:mm A");
    // apply new class if task is near/over due date
    if (moment().isBefore(newDate)) {
      eventColClass = "future";
    } else if (Math.abs(moment().diff(newDate, "hours")) < 1) {
      eventColClass = "present";
    } else {
      eventColClass = "past";
    }
    // rows constructor
    var row = $("<div>").addClass("row").attr("data-datetime", dateTime);
    var timeCol = $("<div>")
      .addClass("col-md-1 col-2  time-block hour")
      .attr("data-index", i); 
    var timeSpan = $("<span>" + startHour.format("hA") + "</span>");
    var eventCol = $("<div>")
      .addClass("col-md-9 col-7 p-0 description " + eventColClass)
      .attr("data-index", i)
      .attr("id", "event-detail");
    var thisEvent = events.find(x => x.date === dateTime);

    // add event if exist 
    if (thisEvent?.date === dateTime){
      eventColP = $("<p>")
      .addClass("description")
      .text(thisEvent.event);
      eventCol.append(eventColP);
    }
    var saveCol = $("<div>")
      .addClass("col-md-1 col-2 saveBtn")
      .attr("data-index", i);
    var saveSpan = $("<span><i class='fa-solid fa-floppy-disk fa-lg'></i></span>");
    var deleteCol = $("<div>")
      .addClass("col-1 deleteBtn")
      .attr("data-index", i);
    var deleteSpan = $("<span><i class='fa-solid fa-trash-can fa-lg'></i></span>");
  
    // append elements
    timeCol.append(timeSpan);
    row.append(timeCol);
    row.append(eventCol);
    saveCol.append(saveSpan);
    row.append(saveCol);
    deleteCol.append(deleteSpan);
    row.append(deleteCol);
    $("#calendar").append(row);
  
    startHour.add(1, 'hours')
  }
  editing = false;
}

// bind current date
var toThisDay = function(dateInput) {
  if (!dateInput){
    date = moment().format("dddd, MMMM Do");
  } else {
    date = moment(dateInput, "MM/DD/YYYY").format("dddd, MMMM Do");
  }
  $("#currentDay").text(date);
  $("input").attr("placeholder", moment(date, "dddd, MMMM Do").format("MM/DD/YYYY"));
  calendarBuilder(dateInput);
}
toThisDay();

// date-picker
$("#thisDate").on("click", function() {
  // get current text
  date = $(this).text().trim();
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").attr("readonly","readonly").val(date);
  $(this).replaceWith(dateInput);

  // enable jquery ui datepicker
  dateInput.datepicker({
    minDate: -30,
    onClose: function() {
      toThisDay(dateInput.val());
      // when calendar is closed, force a "change" event on the `dateInput`
      $(this).trigger("change");
    }
  });
  // automatically bring up the calendar
  dateInput.trigger("focus");
});

// add or edit event
$("#calendar").on("click", "#event-detail", function() {
  var text = $(this)
    .text()
    .trim();
  var index = $(this).attr("data-index");
  if (editing === false) {
    editing = true;
    activateBtns(index);
    $(this).empty();
    // append  element with a new textarea
    textInput = $("<textarea>")
      .val(text);
    $(this).append(textInput);
    // auto focus new element
    textInput.trigger("focus");
    editingDatetime = $(this).parent().attr("data-datetime")
  }
});

// force focus on blur
$("#calendar").on("blur", "#event-detail", function() {
  textInput.trigger("focus");
});

// activate buttons on edit
var activateBtns = function(index) {
  var saveBtnEl = $(".saveBtn[data-index="+index+"]");
  var deleteBtnEl = $(".deleteBtn[data-index="+index+"]");
  saveBtnEl.addClass("saveBtn-drag");
  deleteBtnEl.addClass("deleteBtn-drag");

  // on save
  saveBtnEl.on("click", function() {
    saveBtnEl.addClass("slow-drag");  
      var texteditEl = $("#event-detail[data-index="+index+"] textarea")
      var calEvent = textInput.val();
      // recreate p element
      var eventS = $("<p>")
        .addClass("description")
        .text(calEvent);
      // replace textarea with new content
      $(texteditEl).replaceWith(eventS);      
      hideButtons(saveBtnEl, deleteBtnEl);
      saveEvent(editingDatetime, calEvent)
  });

  // on delete
  deleteBtnEl.on("click", function() {
    saveBtnEl.addClass("slow-drag");  
    var eventDivEl = $("#event-detail[data-index="+index+"]")
    eventDivEl.empty();
    eventDivEl.blur();
    hideButtons(saveBtnEl, deleteBtnEl);
    deleteEvent(editingDatetime);
  });
}

// hide buttons
var hideButtons = function(saveBtnEl, deleteBtnEl) {
  saveBtnEl.removeClass("saveBtn-drag");
  deleteBtnEl.removeClass("deleteBtn-drag");
  setTimeout(function() {
    saveBtnEl.removeClass("slow-drag");
  }, "1000");
  editing = false;
}

// save event
var saveEvent = function(eventDate, eventDescription) {
  var eventEx = events.find(event => event.date === eventDate);
  if (eventEx) {
    events = events.filter(event => event.date != eventEx.date);
    events.push({date: eventDate, event: eventDescription});
  }else{
    events.push({date: eventDate, event: eventDescription});
  }
  localStorage.setItem("events", JSON.stringify(events));
  setTimeout(function() {
    calendarBuilder(date);
  }, "1000");
}

// delete event
var deleteEvent = function(eventDate) {
  events = events.filter(event => event.date != eventDate);
  localStorage.setItem("events", JSON.stringify(events));
  setTimeout(function() {
    calendarBuilder(date);
  }, "1000");
}

// update calendar every 30 min
setInterval(function () {
  calendarBuilder(date);
}, (1000 * 60) * 30);