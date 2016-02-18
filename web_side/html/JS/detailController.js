var currentUnit = null;
function displayUnit(unit)
{
	document.getElementById("labelName").innerHTML = "Name: " + unit.name;
	document.getElementById("labelSide").innerHTML = "Side: " + unit.side;
	document.getElementById("labelDamage").innerHTML = "Damage: " + unit.damage;
	document.getElementById("labelDirection").innerHTML = "Direction: " + unit.direction;
	document.getElementById("labelHeight").innerHTML = "Height: " + unit.z;
	
	currentUnit = unit;
}

function displayServerSettings(settings)
{
	var container = document.getElementById("allowedUnits");
	container.innerHTML = "";
	container.innerHTML += "show west units: " + settings.allowWest + "</br>";
	container.innerHTML += "show east units: " + settings.allowEast + "</br>";
	container.innerHTML += "show resistance units: " + settings.allowguer + "</br>";
	container.innerHTML += "show empty vehicles: " + settings.vehic + "</br>";
	container.innerHTML += "allowed to spawn units: " + settings.allowSpawn + "</br>";
	container.innerHTML += "allowed to teleport units: " + settings.allowTeleport + "</br>";
	container.innerHTML += "allowed move commands: " + settings.allowMoveCommand + "</br>";
}