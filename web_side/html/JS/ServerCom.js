var Server = "ultrawg.no-ip.biz";
var ws = null;
var completeMessage = "";

var didConnect = false;
var didTryToConnect = false;
var lastConnectTryTime = null;

var lastResponce;

function createConnection()
{
	ws = new WebSocket("ws://" + document.getElementById("ipInput").value + ":3000");
	document.getElementById('connectButton').disabled = true; 
	document.getElementById('connectButton').innerHTML = "Connecting"; 
	didTryToConnect = true;
	lastConnectTryTime = new Date().getTime();
     ws.onopen = function()
     {
		didConnect = true;
		getServerSettings();
		document.getElementById('connectButton').innerHTML = "Connected"; 
		//document.getElementById('connectButton').disabled = false; 
		//getAllUnits();
     };
     ws.onmessage = function (evt) 
     { 
		//setTimeout(function() {me.onMessageHandler(evt);}, 0);
        var received_msg = evt.data;
		
		if(received_msg.indexOf("gaui") == 0)
		{
			completeMessage = received_msg;
		}
		else
		{
			completeMessage = completeMessage.concat(received_msg);
		}
		
		if(completeMessage.indexOf("#END_OF_MSG#") != -1)
		{
			console.log(completeMessage);
			lastResponce = new Date().getTime();
			//got all units!
			//console.log(completeMessage);
			var regex = new RegExp("\\[*#*\\[-*(\\d+.\\d+),-*(\\d+.\\d+),-*(\\d+.\\d+)\\],\"(.+?)\",(.+?),(\\d+(?:\\.\\d+)?),(WEST|GUER|EAST),(\\d+(?:.\\d+)?),(.+?),#");
			//var regex_ = new RegExp("\\[\\[(\\d+.\\d+),(\\d+.\\d+),(\\d+.\\d+)\\],\"(.+?)\",(.+?),(\\d+(?:.\\d+)?),\"(WEST)\",(\\d+.\\d+),\"abc\",(.+?),\"#\"\\]");
			var myArray = [];
			//var myArray_ = [];
			//var units = [];
			var breaker = 30;
			var isFirst = true;
			var curCompleteMessage = completeMessage;
			var toRemoveUnits = [];
			completeMessage = completeMessage.replace("gaui", "");
			
			//find units that already were there!
			for(var i = 0; i < units.length; i++)
			{
				var curUnit = units[i];
				curUnit.wasFoundInUpdate = false;
			}
			
			while(completeMessage.length > breaker)
			{
				//var start = +new Date();  // log start timestamp
				
				myArray = regex.exec(completeMessage);
				try 
				{
					completeMessage = completeMessage.substring(myArray[0].length, completeMessage.length );
				}
				catch(err) {
					break;
				}
				//var end =  +new Date();  // log end timestamp
				//var diff = end - start;
				//console.log(diff);
				
				var waypointString = myArray[9];
				var waypointPattern = new RegExp("\\[*\\[(.+?),(.+?),(.+?)\\],*");
				var myWaypointArray = [];
				var waypoints = [];
				while(waypointString.length > 10)
				{
					try 
					{
						myWaypointArray = waypointPattern.exec(waypointString);
						waypointString = waypointString.substring(myWaypointArray[0].length, waypointString.length);
						var curWaypoint = new Waypoint(myWaypointArray[1], myWaypointArray[2]);
						curWaypoint.calcMapPos();
						waypoints.push(curWaypoint);
					}
					catch(err) {
						waypointString = "";
					}
				}
				
				
				didFindUnit = false;
				myArray[4] = myArray[4].replace("'","_");
				for(var i = 0; i < units.length; i++)
				{
					if(units[i].name == myArray[4])
					{
						didFindUnit = true;
						var curUnit = units[i];
						curUnit.wasFoundInUpdate = true;
						//detect if redraw is needed
						curUnit.needsRedraw = (myArray[1] != curUnit.x || myArray[2] != curUnit.y || myArray[8] != curUnit.direction);
						if(myArray[1] != curUnit.x || myArray[2] != curUnit.y)
						{
							//console.log("x or y were different for " + myArray[4]);
							curUnit.x = myArray[1];
							curUnit.y = myArray[2];
							curUnit.calcMapPos();
						}
						if(myArray[3] != curUnit.z)
						{
							curUnit.z = myArray[3];
						}
						if(myArray[4] != curUnit.name)
						{
							curUnit.name = myArray[4];
						}
						if(myArray[5] != curUnit.group)
						{
							curUnit.group = myArray[5];
						}
						if(myArray[6] != curUnit.damage)
						{
							curUnit.damage = myArray[6];
						}
						if(myArray[7] != curUnit.side)
						{
							curUnit.side = myArray[7];
						}
						if(myArray[8] != curUnit.direction)
						{
							curUnit.direction = myArray[8];
						}
						if(waypoints != curUnit.waypoints)
						{
							curUnit.waypoints = waypoints;
						}
						break;
					}
				}
				
				//TODO: find units that aren't there anymore
				
				if(!didFindUnit)
				{
					var unit = new Unit(myArray[1], myArray[2], myArray[3], myArray[4], myArray[5], myArray[6], myArray[7], myArray[8], waypoints);
					unit.name = unit.name.replace("'","_");
					units.push(unit);
					unit.calcMapPos();
				}
				
				if(completeMessage.length <= breaker)
				{
					break;
				}
			}
			
			for(var i = 0; i < units.length; i++)
			{
				var curUnit = units[i];
				if(curUnit.wasFoundInUpdate == false)
				{
					toRemoveUnits.push(curUnit);
					curUnit.needsRedraw = true;
				}
			}
			removeAllUnits(units);
			for(var i = 0; i < toRemoveUnits.length; i++)
			{
				var index = units.indexOf(toRemoveUnits[i]);
				units.splice(index, 1);
			}
			drawAllUnits(units);
			getAllMarkers();
			completeMessage = "";
			var curTime_ = new Date().getTime();
			//console.log("time to update: " + (curTime_ - lastResponce));
		}
		else if(completeMessage.indexOf("#END_OF_MSG_SS#") != -1)
		{
			var regex = new RegExp("\\[(.+?),(.+?),(.+?),(.+?),(.+?),(.+?),(.+?)\\]");
			var myArray = regex.exec(completeMessage);
			 console.log(completeMessage);
			var serverSettings = new ServerSettings(myArray[1], myArray[2], myArray[3], myArray[4], myArray[5], myArray[6], myArray[7]);
			displayServerSettings(serverSettings);
			completeMessage = "";
		}
		else if(completeMessage.indexOf("#END_OF_MSG_GM#") != -1)
		{
			var regex = new RegExp("\\[\\[(.+?),(.+?),.+?\\],(.+?),(.+?),(.+?)\\]");
			var myArray = [];
			var markers_ = [];
			var breaker = 20;
			while(completeMessage.length > breaker)
			{
				myArray = regex.exec(completeMessage);
				if(myArray != null && myArray.length > 0)
				{
					completeMessage = completeMessage.substring(myArray[0].length, completeMessage.length );
					var marker = new Marker(myArray[1], myArray[2], myArray[3], myArray[4], myArray[5]);
					marker.calcMapPos();
					markers_.push(marker);
				}
				else
				{
					completeMessage = "";
				}
			}
			removeAllMarkers(markers_);
			drawAllMarkers(markers_);
			completeMessage = "";
			getAllVehicles();
		}
		else if(completeMessage.indexOf("#END_OF_MSG_GV#") != -1)
		{
			var regex = new RegExp("\\[\\[(.+?),(.+?)\\],(.+?),(.+?)\\]");
			var myArray = [];
			var vehicles = [];
			var breaker = 20;
			while(completeMessage.length > breaker)
			{
				myArray = regex.exec(completeMessage);
				if(myArray != null && myArray.length > 0)
				{
					completeMessage = completeMessage.substring(myArray[0].length, completeMessage.length );
					var vehicle = new Vehicle(myArray[1], myArray[2], myArray[3], myArray[4]);
					vehicle.calcMapPos();
					vehicles.push(vehicle);
				}
				else
				{
					completeMessage = "";
				}
			}
			removeAllVehicles(vehicles);
			drawAllVehicles(vehicles);
			completeMessage = "";
		}
		else if(completeMessage.indexOf("#END_OF_MSG_FPS#") != -1)
		{
			var regex = new RegExp("\\[(\\d+.*\\d*)\\]");
			var myArray = [];
			myArray = regex.exec(completeMessage);
			var fps = myArray[1];
			var fpsElement = document.getElementById("fps");
			fpsElement.innerHTML = "Server FPS: " + fps;
		}
		
     };
     ws.onclose = function(evt)
     { 
        // websocket is closed.
        //alert("Connection is closed..."); 
     };
	 ws.onerror = function(evt)
	 {
		//createConnection();
		//alert("Error in WebSocket " + evt.data);
	 };
}

function getServerFps()
{
	ws.send("fps");
}

function spawnUnit(className, x, y)
{
    ws.send("c,\"" + className + "\",[" + x + "," + y + ",0]");
}

function teleportUnit(unit, x, y)
{
	ws.send("t,\"" + unit.name + "\",[" + x + "," + y + ",0]");
}

function getAllUnits()
{
	ws.send("gaui");
}

function getServerSettings()
{
	ws.send("ss");
}

function getAllMarkers()
{
	ws.send("gm");
}

function getAllVehicles()
{
	ws.send("gv");
}

function giveGroupWaypoint(unit, x, y)
{
	ws.send("w,\"" + unit.group + "\",[" + x + "," + y + ",0]");
}


