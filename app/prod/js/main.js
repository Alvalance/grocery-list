var onLoad=function(){!function(){var t;t=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");t.open("GET","data/data.json"),t.onreadystatechange=function(){if(200===t.status&&4===t.readyState){var e=JSON.parse(t.responseText);console.log(e[0].category)}},t.send()}()};"complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?onLoad():document.addEventListener("DOMContentLoaded",onLoad);