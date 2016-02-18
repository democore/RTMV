var map;
var curMapFolder = "stratisRendered";
var imgWidth = 8800;
var imgHeight = 9011;
var element = document.getElementById('popup');
var isPopupOpen = false;
var inAction = false;
var actionType = "";
var actionUnit = null;
var followedUnit = null;

function initMap(mapID)
{
	if(mapID == 0)
	{
		imgWidth = 8800;
		imgHeight = 9011;
		curMapFolder = "stratisRendered";
	}
	else if(mapID == 1)
	{
		imgWidth = 33751;
		imgHeight = 30976;
		curMapFolder = "AltisRendered";
	}
	else if(mapID == 2)
	{
		imgWidth = 14192;
		imgHeight = 14192;
		curMapFolder = "TakistanRendered";
	}
	else if(mapID == 3)
	{
		imgWidth = 8800;
		imgHeight = 9012;
		curMapFolder = "ZargabadRendered";
	}
	else if(mapID == 4)
	{
		imgWidth = 8448;
		imgHeight = 8448;
		curMapFolder = "ChernarusRendered";
	}
									 
	var mousePositionControl = new ol.control.MousePosition({
	  coordinateFormat: ol.coordinate.createStringXY(0),
	  projection: 'EPSG:4326',
	  // comment the following two lines to have the mouse position
	  // be placed within the map.
	  className: 'custom-mouse-position',
	  target: document.getElementById('mouse-position'),
	  undefinedHTML: '&nbsp;'
	});
	
	var imgCenter = [imgWidth / 2, imgHeight / 2];
    var proj = new ol.proj.Projection({
        code: 'pixel',
        units: 'pixels',
        extent: [0, 0, imgWidth, imgHeight]
    });
	
	map = new ol.Map(
	{
		loadTilesWhileAnimating: true,
		loadTilesWhileInteracting: true,
		controls: ol.control.defaults().extend([mousePositionControl]),
		
		layers: 
		[
			new ol.layer.Tile(
			{
				preload: 1,
				source: new ol.source.TileImage({
					projection: proj,
					tileUrlFunction: function (coordinate, pixelRatio, projection) {
						return '/' + curMapFolder + '/' + coordinate[0] + '/' + coordinate[1] +
							'/' + (coordinate[2]) + '.png';
					},
					tileGrid: new ol.tilegrid.Zoomify({
						resolutions: [1, 2, 4, 8, 16, 32, 64].reverse()
					})
				})
			})
		],
		
		renderer: 'canvas',
		target: 'map',
		view: new ol.View(
		{
			projection: proj,
            center: imgCenter,
            zoom: 1,
            extent: [-imgWidth, -imgHeight, imgWidth, imgHeight]
		})
    });

	if(element == null)
	{
		element = document.getElementById('popup');
	}
	

	var popup = new ol.Overlay({
	  element: element,
	  positioning: 'bottom-center',
	  stopEvent: false
	});
	map.addOverlay(popup);
	
	// display popup on click
	map.on('click', function(evt) {
	if(inAction == false)
	{
	  var feature = map.forEachFeatureAtPixel(evt.pixel,
		  function(feature, layer) {
			return feature;
		  });
	  if (feature) {
		var geometry = feature.getGeometry();
		var coord = geometry.getCoordinates();
		popup.setPosition(coord);
		$(element).popover({
		  'placement': 'top',
		  'html': true,
		  'content': feature.get('content'),
		  'title': feature.get('title'),
		  'trigger': 'click'
		});
		$(element).popover('show');
		var tpButton = document.getElementById("tpButton");
		$(tpButton).on('click', function () {
			var $btn = $(this).button('loading')
			// business logic...
			//$btn.button('reset')
			var unit = feature.get('object');
			inAction = true;
			actionUnit = unit;
			actionType = "Teleport";
		});
		var wpButton = document.getElementById("wpButton");
		$(wpButton).on('click', function () {
			var $btn = $(this).button('loading')
			// business logic...
			//$btn.button('reset')
			var unit = feature.get('object');
			inAction = true;
			actionUnit = unit;
			actionType = "Waypoint";
		});
		var followButton = document.getElementById("followButton");
		$(followButton).on('click', function () {
			var $btn = $(this).button('loading')
			// business logic...
			//$btn.button('reset')
			followedUnit = feature.get('object');
		});
		
		isPopupOpen = true;
	  } 
	  else 
	  {
		if(isPopupOpen == true)
		{
			//console.log("closing");
			$(element).popover('destroy');
			isPopupOpen = false;
		}
		else
		{
			var coordinate = evt.coordinate;
			popup.setPosition(coordinate);
			var coordinateIngame = calcIngamePos(evt.coordinate);
			$(element).popover({
				'placement': 'top',
				'html': true,
				'content': '<center>Map: x:' + coordinate[0] + ' y:' + coordinate[1] + '<br>Ingame: x:' + coordinateIngame[0] + ' y:' + coordinateIngame[1] +  '</center>',
				'title': 'Position',
				'trigger': 'click'
			});
			$(element).popover('show');
			isPopupOpen = true;
		}
	  }
	}
	else
	{
		inAction = false;
		var coordinate = calcIngamePos(evt.coordinate);
		if(actionType == "Teleport")
		{
			teleportUnit(actionUnit, coordinate[0], coordinate[1]);
		}
		else if(actionType == "Waypoint")
		{
			giveGroupWaypoint(actionUnit, coordinate[0], coordinate[1]);
		}
	}
	});

	// change mouse cursor when over marker
	map.on('pointermove', function(e) {
	  if (e.dragging) {
		//$(element).popover('destroy');
		return;
	  }
	  var pixel = map.getEventPixel(e.originalEvent);
	  var hit = map.hasFeatureAtPixel(pixel);
	  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
	});
}

















