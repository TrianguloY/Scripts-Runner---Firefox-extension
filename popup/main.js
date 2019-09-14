/* initialize variables */

var li_container = document.querySelector('#container');



/*  add event listeners to buttons */

document.querySelector('#new').addEventListener('click', () => newScript());
document.querySelector('#import').addEventListener('click', importScripts);
document.querySelector('#export').addEventListener('click', exportScripts);


/* configure page */

restore();
window.addEventListener("unload", save);


////////////////////////////////////


/* Master functions */

function newScript(script){
	if(script==undefined) script = {};
	
	div_script = tmpl.content.cloneNode(true);
	
	/* listeners */
	
	div_script.querySelector('#run')
		.addEventListener('click', runScript);
	div_script.querySelector('#hide')
		.addEventListener('click', showScript);
	div_script.querySelector('#delete')
		.addEventListener('click', deleteScript);
	
	/* properties */
	
	div_script.querySelector('#title')
		.value = script.title || "";
	div_script.querySelector('#iframe')
		.checked = script.iframe || false;
	div_script.querySelector('#code')
		.value = script.code || "";
	if(script.hide){
		div_script.querySelector('#hideable')
			.style.display = "none";
	}
	
	li_container.prepend(div_script);
}


/* main listeners */

function exportScripts(){
	navigator.clipboard.writeText(serialize()).then(function() {
	  alert("Copied to clipboard");
	}, log);
}

function importScripts(){
	navigator.clipboard.readText().then(deserialize, log);
}

function save(){
	browser.storage.local.set({"save": serialize()});
}

function restore(){
	browser.storage.local.get("save").then(o=>deserialize(o.save), log);
}



/* Script listeners */

function clearAll(){
	li_container.innerHTML = '';
}

function deleteScript(e){
	script = getClosest(e.target, '#script');
	script.parentNode.removeChild(script);
}

function runScript(e){
	script = getClosest(e.target, '#script');
	var code = script.querySelector('#code').value;
	
	if(script.querySelector('#iframe').checked){
		browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
		.then(tabs => {
			browser.webNavigation.getAllFrames({tabId: tabs[0].id})
			.then( frames => {
				frameId = -1;
				frames.forEach( frame => {
					if(frame.frameId != 0){
						frameId = frame.frameId
					}
				});
				if(frameId == -1){
					alert("No frame in the page");
				}else{
					runInFrame(code, frameId);
				}
			}, log);
		},log)
	}else{
		runInFrame(code, 0);
	}
}

function showScript(e){
	script = getClosest(e.target, '#script');
	hideable = script.querySelector('#hideable');

	hideable.style.display = 
		hideable.style.display === "none"
		? "block"
		: "none";
}



/* Utility functions */

function runInFrame(code, id){
	browser.tabs.executeScript({
		code: code,
		frameId: id,
		//allFrames: true
	})
	.then(result => {
		//if(result != null) alert("Result:\n"+result);
	}, log);
}

function getClosest(elem, selector) {
	for ( ; elem !== null; elem = elem.parentElement ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

function log(error) {
	console.log(error);
	alert(error);
}





function serialize(){
	object = []
	li_container.querySelectorAll('#script').forEach( script =>
		object.push({
			code : script.querySelector('#code').value,
			title : script.querySelector('#title').value,
			iframe : script.querySelector('#iframe').checked,
			hide : script.querySelector('#hideable').style.display == "none"
		})
	);
	return JSON.stringify(object);
}

function deserialize(text){
	console.log(text);
	var list = JSON.parse(text);
	list.reverse();
	list.forEach(newScript);
}
