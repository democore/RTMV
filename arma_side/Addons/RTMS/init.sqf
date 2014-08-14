enableSaving [false,false];
processID = 0;

hint "starting RTMS Version 0.30";

_modName = "RTMS";

execVM "\RTMS\mapViewerSettings.sqf";

"ArmaToExternConnector" callExtension "start";

execVM"\RTMS\sendToServer.sqf";
while{true} do
{
	sleep 1;
	execVM "\RTMS\spawnShit.sqf";
};