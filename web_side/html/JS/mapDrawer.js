var units = [];

var curmarkers = [];
var markerVectors = [];

var curVehicles = [];
var vehicleFeatures = [];

//the layers
var unitsAndVehiclesVectors = null;
var makerVectors = null;

var lastDrawNames = false;

var unitX = -1;
var unitY = -1;
var currentZoom = 1;

function removeAllUnits(units)
{
	if(units != null)
	{
		units.forEach(function(entry) 
		{
			if(entry.needsRedraw && entry.vectors != undefined && unitsAndVehiclesVectors != null)
			{
				unitsAndVehiclesVectors.getSource().removeFeature(entry.vectors);
				entry.waypointFeatures.forEach(function(waypoint)
				{
					unitsAndVehiclesVectors.getSource().removeFeature(waypoint);
				});
				entry.waypointFeatures = [];
			}
		});
	}
}

function addVector(objects, type, alpha, width, height)
{
	var vectors;
	
	if(type == "unit" || type == "vehicle")
	{
		vectors = unitsAndVehiclesVectors;
	}
	else if(type == "marker")
	{
		vectors = makerVectors;
	}
	var layers = map.getLayers();
	if(vectors == null)
	{
		var vectorSource = new ol.source.Vector();	
		vectors = new ol.layer.Vector({
			source: vectorSource
		});
		map.addLayer(vectors);
	}
	
	objects.forEach(function(object) 
	{
		var imageName;
		if(type == "unit")
		{
			if(object.side == "WEST")
			{
				imageName = "iconman_ca_blue.png";
			}
			else if(object.side == "EAST")
			{
				imageName = "iconman_ca_red.png";
			}
			else if(object.side == "GUER")
			{
				imageName = "iconman_ca_green.png";
			}
		}
		if(type == "vehicle")
		{
			if(vehicleImages[object.classname] != undefined)
			{
				imageName = "/images/" + vehicleImages[object.classname].toLowerCase();
				
			}
		}
		if(type == "marker")
		{
			imageName = "/images/" + markerImages[object.classname].toLowerCase()
		}
		if(imageName == undefined)
		{
			imageName = "";
		}
		if(imageName.indexOf("undefined") != -1)
		{
			imageName = "";
		}
		if(object.needsRedraw == true)
		{
			var x = object.mapPosX;
			var y = object.mapPosY;
			
			var iconFeature = new ol.Feature({
			  geometry: new ol.geom.Point([x, y]),
			  title: object.name,
			  object: object,
			  content: "<center>x:" + object.x+ "<br>y:" + object.y + "<br>damage:" + object.damage + 
			  "<br><button type='button' id='tpButton' class='btn btn-primary' data-loading-text='Teleport'>Teleport</button>" + 
			  "<br><button type='button' id='wpButton' class='btn btn-primary' data-loading-text='Add Waypoint'>Add Waypoint</button>" + 
			  "<br><button type='button' id='followButton' class='btn btn-primary' data-loading-text='Follow'>Follow</button></center>"
			});

			var iconStyle = new ol.style.Style({
			  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
				scale: width,
				opacity: alpha,
				src: imageName,
				rotation: object.direction * 0.0174532925
			  })),
			  text: getTextStyle(object.name, 30, type)
			});
			iconFeature.setStyle(iconStyle);
			
			if(x != undefined)
			{
				iconFeature.id = object.id;
				vectors.getSource().addFeature(iconFeature);
			}
				
			if(type == "unit")
			{
				if(followedUnit != null && followedUnit != undefined && document.getElementById('Enable_Follow').checked)
				{
					if(followedUnit.name == object.name)
					{
						map.getView().setCenter([x,y]);
					}
				}
				var waypoints = object.waypoints;
				if(waypoints != null && waypoints != undefined && waypoints.length > 0)
				{
					var lastWP = null;
					waypoints.forEach(function(waypoint)
					{
						var wpX = waypoint.mapPosX;
						var wpY = waypoint.mapPosY;
						
						var featureLine = null;
						if(lastWP == null)
						{
							featureLine = new ol.Feature({
								geometry: new ol.geom.LineString([[x,y],[wpX,wpY]])
							});
						}
						else
						{
							featureLine = new ol.Feature({
								geometry: new ol.geom.LineString([[lastWP.mapPosX,lastWP.mapPosY],[wpX,wpY]])
							});
						}
						var style = new ol.style.Style({
							fill: new ol.style.Fill({
								color: '#000000',
								weight: 4
							}),
							stroke: new ol.style.Stroke({
								color: '#000000',
								width: 2
							})
						});
						featureLine.setStyle(style);
						vectors.getSource().addFeature(featureLine);
						object.waypointFeatures.push(featureLine);
						
						lastWP = waypoint;
					});				
				}
				
				object.vectors = iconFeature;
				object.needsRedraw = false;
			}
			if(type == "marker")
			{
				markerVectors.push(iconFeature);
			}
			if(type == "vehicle")
			{
				object.vectors = iconFeature;
				vehicleFeatures.push(iconFeature);
			}
		}
	});
	
	if(type == "unit" || type == "vehicle")
	{
		unitsAndVehiclesVectors = vectors;
	}
	else if(type == "marker")
	{
		makerVectors = vectors;
	}
	
	lastDrawNames = document.getElementById("Draw_Names").checked;
}

function getTextStyle(text, offsetX, type) {
	if(type == "marker") 
	{
		return new ol.style.Text({
		  fill : new ol.style.Fill({
			color : '#330'
		  }),
		  /*stroke : new ol.style.Stroke({
			color : '#fff',
			width : 4
		  }),*/
		  text : text,
		  font : '16px Verdana',
		  offsetX : offsetX ? offsetX : 0,
		  offsetY : 0,
		  textAlign : 'left'
		});
	}
  }

function drawAllUnits(units)
{
	if(true)// !zooming)
	{
		if(units != null)
		{
			addVector(units, "unit", 0.8, 0.5, 1);
			this.units = units;
		}
	}
}

function removeAllMarkers(markers)
{
	if(markerVectors != null)
	{
		markerVectors.forEach(function(entry) 
		{
			if(entry != undefined)
			{
				makerVectors.getSource().removeFeature(entry);
			}
		});
		markerVectors = [];
	}
}

function drawAllMarkers(markers_)
{
	addVector(markers_, "marker", 1,0.5,1);
}

function removeAllVehicles(vehicles)
{
	if(vehicleFeatures != null)
	{
		curVehicles.forEach(function(entry) 
		{
			if(entry.vectors != undefined)
			{
				unitsAndVehiclesVectors.getSource().removeFeature(entry.vectors);
			}
		});
		vehicleFeatures = [];
	}
}

function drawAllVehicles(vehicles)
{
	curVehicles = vehicles;
	addVector(vehicles, "vehicle", 1.0, 0.1, 1);
}









