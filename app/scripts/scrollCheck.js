var scrollStream = Rx.Observable.fromEvent(document, 'scroll').startWith(0).throttle(1000);
var timerStream = Rx.Observable.interval(4000).startWith(0).map(function (ev) {
  var parent = document.querySelector('#ozfeed');
  var parentOffset = parent.offsetTop;
  while(parent.offsetParent) {
    parent = parent.offsetParent;
    parentOffset + = parent.offsetTop;
  }
  var positions = Immutable.Seq(Array.prototype.slice.call(document.querySelectorAll('li.feed-update')))
    .map(function ($el) {
      return {
        top: parentOffset + $el.offsetTop,
        height: $el.clientHeight,
        html: $el.innerHTML
      };
    });
  return positions;
});
var combinedStream = scrollStream.combineLatest(timerStream, function (a, b) {
  var filterCB = function (el) {
    var top = window.pageYOffset - window.innerHeight * 0.2;
    var height = window.innerHeight + window.innerHeight * 0.4;
    return (el.top > top) && (el.top + el.height < top + height);
  };
  return b.filter(filterCB).map(function (a) {return a.html;}).toArray();
}).distinct();
combinedStream.subscribe(function (a) {
  chrome.runtime.sendMessage({
    type: 'xhr',
    data: a
  });
});