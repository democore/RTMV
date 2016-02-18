var iframeX = -1;
var iframeY = -1;
var curIFrame = null;
var curUnit = null;
var currentlyTeleporting = false;
var currentlyMoveCommand = false;
var isWindowOpen = false;

function createSpawnUnitIframe(x,y)
{
	isFirstPress = true;
	var iFrame = createIFrame(x,y);
	iFrame.id = "iFrameId";
	var doc = iFrame.contentWindow.document;
	doc.open();
	doc.write('<body><h1>Spawn Unit</h1></br>classname:</br></body>');
	doc.close();
	
	var input = doc.createElement("input");
	input.value = "B_Soldier_F";
	input.id = "classnameInput";
	input.innerHTML = "B_Soldier_F";
	doc.body.appendChild(input);
	
	doc.body.innerHTML += "</br>";
	
	var button = doc.createElement("Button");
	button.style.width = "100px";
	button.style.height = "30px";
	button.value = "Spawn";
	button.id = "abc";
	button.innerHTML = "Spawn";
	button.onclick = function()
	{
		isWindowOpen = false;
		var x = getLastIngameX();
		var y = getLastIngameY();
		spawnUnit(document.getElementById("iFrameId").contentWindow.document.getElementById("classnameInput").value, x, y);
		closeCurrentIFrame();
	};
	doc.body.appendChild(button);
	
}

function createAlterUnitIframe(x,y, unit)
{
	var iFrame = createIFrame(x,y);
	iFrame.id = "iFrameId";
	var doc = iFrame.contentWindow.document;
	doc.open();
	doc.write('<body><h1>Alter Unit</h1></br>unitname:' + unit.name + '</br></body>');
	doc.close();
	
	var tpButton = doc.createElement("Button");
	tpButton.value = "Teleport";
	tpButton.innerHTML = "Teleport";
	tpButton.id = "TPButton";
	tpButton.style.width = "100px";
	tpButton.style.height = "30px";
	tpButton.onclick = function()
	{
		tpButtonPressed();
	};
	doc.body.appendChild(tpButton);
	
	var moveButton = doc.createElement("Button");
	moveButton.value = "Give move Command";
	moveButton.innerHTML = "Give move Command";
	moveButton.id = "moveButton";
	//moveButton.style.width = "100px";
	//moveButton.style.height = "30px";
	moveButton.onclick = function()
	{
		moveButtonPressed();
	};
	doc.body.appendChild(moveButton);
	
	var followButton = doc.createElement("Button");
	followButton.value = "Auto Follow";
	followButton.innerHTML = "Auto Follow";
	followButton.id = "followButton";
	//moveButton.style.width = "100px";
	//moveButton.style.height = "30px";
	followButton.onclick = function()
	{
		followButtonPressed();
	};
	doc.body.appendChild(followButton);
	
	
	
	curUnit = unit;
}

function followButtonPressed()
{
	curFollowUnit = curUnit;
	closeCurrentIFrame();
}

function moveButtonPressed()
{
	//currentlyMoveCommand
	if(!currentlyMoveCommand)
	{
		document.getElementById("iFrameId").contentWindow.document.getElementById("moveButton").innerHTML = "Cancel";
	}
	else
	{
		document.getElementById("iFrameId").contentWindow.document.getElementById("moveButton").innerHTML = "Give move Command";
	}
	currentlyMoveCommand = !currentlyMoveCommand;
}
function tpButtonPressed ()
{
	if(!currentlyTeleporting)
	{
		document.getElementById("iFrameId").contentWindow.document.getElementById("TPButton").innerHTML = "Cancel";
	}
	else
	{
		document.getElementById("iFrameId").contentWindow.document.getElementById("TPButton").innerHTML = "Teleport";
	}
	currentlyTeleporting = !currentlyTeleporting;
}

function closeCurrentIFrame()
{
	if(curIFrame != null)
	{
		curIFrame.parentNode.removeChild(curIFrame);
		curIFrame = null;
	}
}

function createIFrame(x,y)
{
	isWindowOpen = true;
	closeCurrentIFrame();
	
	var ifrm = document.createElement("IFRAME"); 
	ifrm.style.zIndex = "999";//"z-index:9999";
	ifrm.style.width = "200px";
	ifrm.style.height = "250px";
	ifrm.style.position = "absolute";
	ifrm.style.top = (y + 20) + "px";
	ifrm.style.left = (x - (300 + 100)) + "px"; // + 100 wegen mittig
	ifrm.style.backgroundColor = "#FFFFFF";
	document.getElementById("map").appendChild(ifrm);
	
	curIFrame = ifrm;
	iframeX = x;
	iframeY = y;
	
	return ifrm;
}