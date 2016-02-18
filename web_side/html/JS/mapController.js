var minusX = 300;

function followUnit(unit)
{
	if(unit != null && document.getElementById("Enable_Follow").checked == true)
	{
		var bounds = unit.vectors.geometry.bounds;
		map.setCenter(new OpenLayers.LonLat(bounds.left,bounds.top), 16);
	}
}

function mapWasClicked ()
{
	//alert("x: " + mouseDownX + " y: " + mouseDownY);
	if(!isWindowOpen)
	{
		createSpawnUnitIframe(mouseDownX, mouseDownY);
	}
	else
	{
		if(currentlyTeleporting)
		{
			teleportUnit(curUnit,getLastIngameX() ,getLastIngameY());
			currentlyTeleporting = false;
		}
		else if(currentlyMoveCommand)
		{
			giveGroupWaypoint(curUnit, getLastIngameX() ,getLastIngameY());
			currentlyMoveCommand = false;
		}
		isWindowOpen = false;
		closeCurrentIFrame();
	}
}
var lastIngameX = 0;
var lastIngameY = 0;
function calcIngameX( x )
{
	lastIngameX = x/meterToPixel + leftAnpasser;
	return lastIngameX;
}

function calcIngameY( y )
{
	lastIngameY = ((curMapHeight - y ) / meterToPixel) + topAnpasser;
	return lastIngameY;
}

function getLastIngameX()
{
	return lastIngameX;
}

function getLastIngameY()
{
	return lastIngameY;
}

function getLastSelectedIngameX()
{
	return (((iframeX - minusX) + document.getElementById("overscroll").scrollLeft)/meterToPixel) + leftAnpasser;
}

function getLastSelectedIngameY()
{
	return ((curMapHeight - (iframeY + document.getElementById("overscroll").scrollTop)) / meterToPixel) + topAnpasser;
}

var mouseDownX = 0;
var mouseDownY = -1;

function mapMouseDown(e)
{
	if(e.offsetX == undefined)
	{
		mouseDownX = e.clientX;
		mouseDownY = e.clientY;
	}
	else
	{
		mouseDownX = e.offsetX;
		mouseDownY = e.offsetY;
	}
}

function mapMouseUp(e)
{
	if(e.offsetX == undefined)
	{
		if(mouseDownX == e.clientX && mouseDownY == e.clientY)
		{
			mapWasClicked();
		}
	}
	else
	{
		mouseDownX = e.offsetX;
		mouseDownY = e.offsetY;
	}
}