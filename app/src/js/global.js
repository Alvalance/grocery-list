// Handler when the DOM is fully loaded
var onLoad = function(){

    loadAJAX();

    function loadAJAX () {
        var req;
        // support some older versions of explorer
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        req.open('GET', 'data/data.json');
        req.onreadystatechange = function() {
            if ((req.status === 200) && (req.readyState === 4)) {
                    var grocList = JSON.parse(req.responseText);
                    console.log(grocList[0].category);
            } // ready
        } // onreadystatechange event
        req.send();
    } // loadAJAX
}; // onLoad

// support some Microsoft
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
}
