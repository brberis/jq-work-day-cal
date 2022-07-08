// bind current date
var date = moment().format("dddd, MMMM Do");
$("#currentDay").text(date);

// enter working hours
var start = "09:00";
var end = "17:00";

// number of hours
var date = moment().format("YYYY-MM-DD");
var startHour = moment(date + ' ' + start);
var endHour = moment(date + ' ' + end);
var duration = moment.duration(endHour.diff(startHour));
var hours = duration.asHours();

for (var i = 0; i <= hours; i++) {
  var dateTime = date + " " + startHour.format("LT")
  var row = $("<div>").addClass("row").attr("data-datetime", dateTime);
  
  var timeCol = $("<div>").addClass("col-1 time-block hour");
  var timeSpan = $("<span>" + startHour.format("hA") + "</span>");
  
  var eventCol = $("<div>").addClass("col-10 future");
  // var eventSpan = $("<span>"); 

  var saveCol = $("<div>").addClass("col-1 saveBtn");
  var saveSpan = $("<span><i class='fa-solid fa-floppy-disk fa-lg'></i></span>");

  timeCol.append(timeSpan);
  row.append(timeCol);

  // eventCol.append(eventSpan);
  row.append(eventCol);

  saveCol.append(saveSpan);
  row.append(saveCol);
  $("#calendar").append(row);

  startHour.add(1, 'hours')
}

// event text was clicked
$("#calendar").on("click", ".col-10", function() {
  var text = $(this)
    .text()
    .trim();

  // replace  element with a new textarea
  var textInput = $("<textarea>")
    .val(text);
  $(this).append(textInput);

  // auto focus new element
  textInput.trigger("focus");
});
