var bgImageArray = ["underground1.jpg", "underground3.jpg", "underground4.jpg", "underground5a.jpg", "underground5b.jpg", "underground5c.jpg", "underground6.jpg", "underground7.jpg", "underground8.jpg", "underground9.jpg"],
base = "https://intlrail.s3.amazonaws.com/images/",
secs = 5;
bgImageArray.forEach(function(img){
    new Image().src = base + img; 
    // caches images, avoiding white flash between background replacements
});

function backgroundSequence() {
  window.clearTimeout();
  var k = 0;
  for (i = 0; i < bgImageArray.length; i++) {
    setTimeout(function(){ 
      document.documentElement.style.background = "url(" + base + bgImageArray[k] + ") no-repeat center center fixed";
      document.documentElement.style.backgroundSize ="cover";
    if ((k + 1) === bgImageArray.length) { setTimeout(function() { backgroundSequence() }, (secs * 1000))} else { k++; }      
    }, (secs * 1000) * i)  
  }
}
backgroundSequence();