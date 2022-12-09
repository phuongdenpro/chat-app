export function converDate(date) {
  var created_date = new Date(date);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = created_date.getFullYear();
  var month = created_date.getMonth() + 1;
  var date = created_date.getDate();
  var hour = created_date.getHours();
  var min = created_date.getMinutes();
  var sec = created_date.getSeconds();
  var time =
    date + "," + month + " " + year + " " + hour + ":" + min + ":" + sec;

  var toString = "" + hour + ":" + (min < 10 ? "0" + min : min);
  var toStringDMY =
    "" +
    (date < 10 ? "0" + date : date) +
    " / " +
    (month < 10 ? "0" + month : month) +
    (new Date().getFullYear() == year ? "" : " / " + year);
  return {
    months,
    year,
    month,
    date,
    hour,
    min,
    sec,
    time,
    toString,
    toStringDMY,
  };
}
