<?php
	$toSearch = $_GET["get"];
	$id = $_GET["id"];
	$which = $_GET["which"];
	if($which == "marker")
	{
		$content = file_get_contents("MarkerClassnameToImage.txt");
		$index = strpos($content, $toSearch);
		if($index !== false)
		{
			$nextKomma = strpos($content, ',', $index);
			$foundOne = substr($content, $nextKomma + 1);
			$foundOne = substr($foundOne, 0, strpos($foundOne, "\r\n"));
			echo ($foundOne.",".$id);
			//json_encode($foundOne);
		}
	}
	else if($which == "vehicle")
	{
		$content = file_get_contents("ClassnameToImage_vehicles.txt");
		$index = strpos($content, $toSearch);
		if($index !== false)
		{
			$nextKomma = strpos($content, ',', $index);
			$foundOne = substr($content, $nextKomma + 1);
			$foundOne = substr($foundOne, 0, strpos($foundOne, "\r\n"));
			echo ($foundOne.",".$id);
			//json_encode($foundOne);
		}
	}
?>