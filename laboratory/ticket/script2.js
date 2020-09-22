var disco = document.createElement('canvas');
	disco.id = "disco_ball";
	disco.width  = 144;
	disco.height = 144;

setTimeout(init1, 1000);
setTimeout(init2, 2000);

function init1() {
  disco.className += " disco-init1";  
}

function init2() {
  disco.className += " disco-init2";  
}


