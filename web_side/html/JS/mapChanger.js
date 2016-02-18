curMapWidth = 8800;
curMapHeight = 9011;

meterToPixel = 1.1;
topAnpasser = 0;//meter die oben bei der Karte abgeschnitten sind
leftAnpasser = 0;//meter die links auf der karte abgeschnitten sind

function changeMap()
{
	map.setTarget(null);
	map = null;
	var chooser = document.getElementById("mapChooser");
	if(chooser.selectedIndex == 0)
	{
		//map = stratis
		curMapWidth = 8800;
		curMapHeight = 9011;
		
		meterToPixel = 1.1;
		topAnpasser = 0;//meter die oben bei der Karte abgeschnitten sind
		leftAnpasser = 0;//meter die links auf der karte abgeschnitten sind
	}
	else if(chooser.selectedIndex == 1)
	{
		//map = altis
		curMapWidth = 33751;
		curMapHeight = 30976;
		
		meterToPixel = 1.1;
		topAnpasser = 2786;
		leftAnpasser = -40;
	}
	
	else if(chooser.selectedIndex == 2)
	{
		//map = Takistan
		curMapWidth = 28384;
		curMapHeight = 28384;
		
		meterToPixel = 0.254;
		topAnpasser = 0;
		leftAnpasser = 0;
	}
	else if(chooser.selectedIndex == 3)
	{
		//map = Zargabad
		curMapWidth = 17600;
		curMapHeight = 18023;
		
		meterToPixel = 0.254;
		topAnpasser = 0;
		leftAnpasser = 0;
	}
	else if(chooser.selectedIndex == 4)
	{
		//map = Chernarus
		curMapWidth = 28384;
		curMapHeight = 28384;
		
		meterToPixel = 0.254;
		topAnpasser = 0;
		leftAnpasser = 0;
	}
	
	initMap(chooser.selectedIndex);
}