var date = moment().format("dddd, MMMM Do");
$("#currentDay").text(date);
var date = new Date();
var start = "9:00";
var end = "17:00";

var startHour = moment(date + ' ' + start);
var endHour = moment(date + ' ' + end);
var duration = moment.duration(endHour.diff(startHour));
var hours = duration.asHours();
console.log(hours);
// for (var i = 0; i < array.length; i++) {
//   const element = array[i];
  
// }