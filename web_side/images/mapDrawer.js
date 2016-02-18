var units = [];
var unitControls = [];
var unitVectors = [];

var curmarkers = [];
var markerControls = [];
var markerVectors = [];

var curVehicles = [];
var unitX = -1;
var unitY = -1;
var currentZoom = 1;

function removeAllUnits(units)
{
	if(!zooming)
	{
		if(units != null)
		{
			unitControls.forEach(function(entry) 
			{
				if(!zooming)
				{
					entry.destroy();
				}
			});
			unitControls = [];
			
			unitVectors.forEach(function(entry) 
			{
				if(!zooming)
				{
					entry.destroy();
				}
			});
			unitVectors = [];
		}
	}
}

function addVector(imageName, object, rotation, type, alpha, width, height, id_)
{
	vectors = new OpenLayers.Layer.Vector(
		"Simple Geometry",
		{
			styleMap: new OpenLayers.StyleMap({
				"default": {
					externalGraphic: imageName,
					graphicWidth: width,
					graphicHeight: height,
					rotation: "${angle}",
					fillOpacity: "${opacity}"
				},
				"select": {
					cursor: "crosshair"
				}
			})
		}
	);

	map.addLayers([vectors]);
	var features = [];
	var x = object.mapPosX;
	var y = object.mapPosY * -1 + 10;
	features.push(
			new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(x, y), {angle: rotation, opacity:alpha}
			)
		);
		
	vectors.addFeatures(features);
	vectors.features[0].id = id_;
	vectors.id = id_;

	var selectControl = new OpenLayers.Control.SelectFeature(
		vectors, {hover: true,
		highlightOnly: true,
		renderIntent: "temporary",
		eventListeners: {
			//beforefeaturehighlighted: report,
			//featurehighlighted: report,
			//featureunhighlighted: report
		}});
	map.addControl(selectControl);
	selectControl.activate();
	
	if(type == "unit")
	{
		unitControls.push(selectControl);
		unitVectors.push(vectors);
	}
	else if(type == "marker")
	{
		markerControls.push(selectControl);
		markerVectors.push(vectors);
	}
}

function drawAllUnits(units)
{
	if(!zooming)
	{
		if(units != null)
		{
			units.forEach(function(entry) 
			{
				if(!zooming)
				{
					var imageName = "";
					if(entry.side == "WEST")
					{
						imageName = "iconman_ca_blue.png";
					}
					else if(entry.side == "EAST")
					{
						imageName = "iconman_ca_red.png";
					}
					var report = function(e) {
						OpenLayers.Console.log(e.type, e.feature.id);
						var unitName = e.feature.id;
						
					};
					
					addVector(imageName, entry, entry.direction, "unit", 0.8, 32, 32, entry.name);
					
				}
			});
			this.units = units;
		}
	}
}
function getClickPosition(e) {
    unitX = e.clientX;
    unitY = e.clientY;
}
function unitMouseDown(e)
{
	if(e.clientX == undefined)
	{
		unitX = e.clientX;
		unitY = e.clientY;
	}
	else
	{
		unitX = e.offsetX;
		unitY = e.offsetY;
	}
}

function unitClick(img)
{
	if(units != null)
	{
		units.forEach(function(entry) 
		{
			if(img.id == entry.name)
			{
				createAlterUnitIframe(unitX, unitY, entry);
			}
		});
	}
}

function unitMouseOver(img)
{
	if(units != null)
	{
		var BreakException= {};
		try {
			units.forEach(function(entry) 
			{
				if(img.id == entry.name)
				{
					displayUnit(entry);
					
					var map = document.getElementById("zoomer");
					var c = document.getElementById("mapCanvas");
					var ctx = c.getContext("2d");
					ctx.clearRect ( 0 , 0 , curMapWidth , curMapHeight );
					ctx.beginPath();
					ctx.lineWidth=2;
					
					var lastWaypoint = null;
					entry.waypoints.forEach(function(waypoint)
					{
						if(lastWaypoint == null)
						{
							ctx.moveTo(entry.mapPosX - 300, entry.mapPosY);
							ctx.lineTo(waypoint.mapPosX - 300,waypoint.mapPosY);
							ctx.stroke();
						}
						else
						{
							ctx.moveTo(lastWaypoint.mapPosX - 300, lastWaypoint.mapPosY);
							ctx.lineTo(waypoint.mapPosX - 300,waypoint.mapPosY);
							ctx.stroke();
						}
						  var imageObj = new Image();

						  imageObj.onload = function() {
							ctx.drawImage(imageObj, waypoint.mapPosX - (300 + imageObj.width/2), waypoint.mapPosY - imageObj.width/2);
						  };
						  imageObj.src = 'waypoint_c_black.png';
						lastWaypoint = waypoint;
					});
					throw BreakException;
				}
			});
		} 
		catch(e) 
		{
			if (e!==BreakException) throw e;
		}
	}
}

function resetZoom()
{
	currentZoom = 1;
	var zoomLabel = document.getElementById("currentZoom");
	zoomLabel.innerHTML = "zoom: " + currentZoom;
	$('#zoomer').css({
                "-moz-transform": "scale(" + currentZoom + ")",
                width: $(window).width() / currentZoom
            });
}

function zoomMapIn()
{
	alert("Please be aware that when zoomed in or out, the commands sent to the server aren't calculated right anymore. So before you do so, Reset the zoom.");
	currentZoom *= 1.2;
	var zoomLabel = document.getElementById("currentZoom");
	zoomLabel.innerHTML = "zoom: " + currentZoom;
	$('#zoomer').css({
                "-moz-transform": "scale(" + currentZoom + ")",
                width: $(window).width() / currentZoom
            });
	document.getElementById("zoomer").left = 300;
	document.getElementById("zoomer").top = 0;
}

function zoomMapOut()
{
	alert("Please be aware that when zoomed in or out, the commands sent to the server aren't calculated right anymore. So before you do so, Reset the zoom.");
	currentZoom *= 0.8;
	var zoomLabel = document.getElementById("currentZoom");
	zoomLabel.innerHTML = "zoom: " + currentZoom;
	$('#zoomer').css({
                "-moz-transform": "scale(" + currentZoom + ")",
                width: $(window).width() / currentZoom
            });
	document.getElementById("zoomer").left = 300;
	document.getElementById("zoomer").top = 0;
}

function removeAllMarkers()
{
	markerControls.forEach(function(entry) 
	{
		if(!zooming)
		{
			entry.destroy();
		}
	});
	markerControls = [];
	
	markerVectors.forEach(function(entry) 
	{
		if(!zooming)
		{
			entry.destroy();
		}
	});
	markerVectors = [];
}

function drawAllMarkers(markers)
{
	markers.forEach(function(marker) 
	{
		addVector("images" + markerImages[marker.classname], marker, 0, "marker", 0.8, 32, 32, marker.identifier);
		/*var img = document.createElement("img");
		img.id = marker.identifier;
		img.style= "position:absolute; left:" + (marker.mapPosX)+ "px; top:" + (marker.mapPosY) + "px;";
		img.style.position = "absolute";
		img.style.left = (marker.mapPosX) + "px";
		img.style.top = (marker.mapPosY) + "px";
		var src = document.getElementById("zoomer");
		src.appendChild(img);
		
		var label = document.createElement("label");
		label.id = marker.identifier + "_text_";
		label.innerHTML = marker.text;
		src.appendChild(label);
		setMarkerImageForClassname(img,marker.classname);*/
	});
	curmarkers = markers;
}

function removeAllVehicles()
{
	for(var i=0; i < curVehicles.length; i++)
	{
		var vehicle = curVehicles[i];
		var src = document.getElementById(vehicle.id);
		if(src != null)
		{
			src.parentNode.removeChild(src);
		}
	}
				console.log("Removed all vehicles");
}

function drawAllVehicles(vehicles)
{
	curVehicles = vehicles;
	vehicles.forEach(function(vehicle) 
	{
		setVehicleImageForClassname(vehicle.id,vehicle.classname);
	});
}









