function Unit(x,y,z,name,group,damage,side,direction,waypoints)
{
	// Add object properties like this
	this.x = x;
	this.y = y;
	this.z = z;
	this.name = name;
	this.group = group;
	this.damage = damage;
	this.side = side;
	this.direction = direction;
	this.waypoints = waypoints;
	this.waypointFeatures = [];
	this.marker = null;
	this.needsRedraw = true;
	this.vectors = null;
	this.isFollowed = false;
	this.id = this.name;
	this.wasFoundInUpdate = true;
}
Unit.prototype.calcMapPos = function()
{
	calcMapPos(this);
}

function didClickUnit(units, x, y)
{
	for(var i= 0; i < units.length; i++)
	{
		var unit = units[i];
		if(x > unit.mapPosX - 32 && x < unit.mapPosX + 32)
		{
			if(y > unit.mapPosY - 32 && y < unit.mapPosY + 32)
			{
				return unit;
			}
		}
	}
	return null;
}

function calcIngamePos(coordinates)
{
	var arr = [];
	arr.push((coordinates[0] - 4) / meterToPixel - leftAnpasser);
	arr.push((coordinates[1] - 279) / meterToPixel + topAnpasser);
	return arr;
}

function calcMapPos(obj)
{
	obj.mapPosX = (obj.x) * meterToPixel + leftAnpasser;
	obj.mapPosY = ((obj.y) * meterToPixel - topAnpasser);
	
	//console.log(obj.x + " -> " + obj.mapPosX);
	//console.log(obj.y + " -> " + obj.mapPosY);
	//obj.mapPosY = (curMapHeight - (((meterToPixel*100) * (obj.y - topAnpasser)) / 100));
}

function Waypoint(x,y)
{
	this.x = x;
	this.y = y;
	calcMapPos(this);
}

Waypoint.prototype.calcMapPos = function()
{
	calcMapPos(this);
}

function ServerSettings(west,east,guer,vehic,spawn,teleport, moveCommand)
{
	this.allowWest = west;
	this.allowEast = east;
	this.allowguer = guer;
	this.vehic = vehic;
	this.allowSpawn = spawn;
	this.allowTeleport = teleport;
	this.allowMoveCommand = moveCommand;
}

function Marker(x,y,classname,text,identifier)
{
	this.x = x;
	this.y = y;
	this.classname = classname;
	this.name = text;
	this.identifier = identifier.replace("#", "_");
	this.needsRedraw = true;
	this.vectors = null;
}

Marker.prototype.calcMapPos = function()
{
	calcMapPos(this);
}

function Vehicle (x, y, classname, direction)
{
	this.x = x;
	this.y = y;
	this.classname = classname;
	this.name = classname;
	this.direction = direction;
	this.id = this.x + "" + this.y + "" + this.classname;
	this.needsRedraw = true;
    this.vectors = null;
}

Vehicle.prototype.calcMapPos = function()
{
	calcMapPos(this);
}








