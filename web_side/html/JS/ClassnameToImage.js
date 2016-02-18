function setMarkerImageForClassname(img,classname)
{
	 $.ajax(
	{
	   url: "/ClassnameToImage.php?get=" + classname + "&id=" + img.id + "$which=marker",
	   type: 'post',
	   success: function(output) 
		{
			var regex = new RegExp("(.+?),(.+)");
			var myArray = regex.exec(output);
			var realImg = document.getElementById(myArray[2]);
			realImg.src = "/images/" + myArray[1];
			realImg.width = realImg.width / 1.7;
			realImg.style.top = parseInt(realImg.style.top.substr(0, realImg.style.top.length-2)) - realImg.height / 2;
			realImg.style.left = parseInt(realImg.style.left.substr(0, realImg.style.left.length-2)) - realImg.width / 2;
			
			var label = document.getElementById(myArray[2] + "_text_");
			label.style.position = "absolute";
			label.style.left = (parseInt(realImg.style.left.substr(0, realImg.style.left.length-2)) + realImg.width + 3).toString() + "px";
			label.style.top = (parseInt(realImg.style.top.substr(0, realImg.style.top.length-2)) + realImg.height/2 - 8).toString() + "px";
		}
	}
    );
}

function setVehicleImageForClassname(_id,classname)
{
	var id = _id;
	id = id.replace(".", "_punkt_");
	id = id.replace(".", "_punkt_");
	
	console.log("/ClassnameToImage.php?get=" + classname + "&id=" + id + "&which=vehicle");
	var isFirst = true;
	 $.ajax(
	{
	   url: "/ClassnameToImage.php?get=" + classname + "&id=" + id + "&which=vehicle",
	   type: 'post',
	   success: function(output) 
		{
			/*if(isFirst == true)
			{
				removeAllVehicles();
				isFirst = false;
			}*/
			if(output != "")
			{
				var regex = new RegExp("(.+?),(.+)");
				var myArray = regex.exec(output);
				myArray[2] = myArray[2].replace("_punkt_", ".");
				myArray[2] = myArray[2].replace("_punkt_", ".");
				//var realImg = document.getElementById(myArray[2]);
				var vehicle = null;
				for (var i = 0; i < curVehicles.length; i++) {
					vehicle = curVehicles[i];
					if(vehicle.id == myArray[2])
					{
						if(document.getElementById(vehicle.id) == null)
						{
							var img = document.createElement("img");
							img.id = vehicle.id;
							img.style= "position:absolute; left:" + (vehicle.mapPosX)+ "px; top:" + (vehicle.mapPosY) + "px; transform: rotate(" + vehicle.direction + "deg);";
							img.style.position = "absolute";
							img.style.left = (vehicle.mapPosX) + "px";
							img.style.top = (vehicle.mapPosY) + "px";
							
							var src = document.getElementById("zoomer");
							src.appendChild(img);
							
							img.src = "/images/" + myArray[1];
							img.width = img.width / 12;
							img.style.top = parseInt(img.style.top.substr(0, img.style.top.length-2)) - img.height / 2;
							img.style.left = parseInt(img.style.left.substr(0, img.style.left.length-2)) - img.width / 2;
						}
						else
						{
							
						}
						
					}
				}
				
				
			}
		},
                error : function(json) 
                {
                //alert("ajax error, json: " + json);

                //for (var i = 0, l = json.length; i < l; ++i) 
                    //{
                    //  alert (json[i]);
                    //}
                }
	}
    );
}