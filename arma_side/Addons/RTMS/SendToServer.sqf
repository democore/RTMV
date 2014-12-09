fnc_substr = {
	//substring = [string, from, length] call fnc_substr; 
	private "_arr";
	_arr = toArray (_this select 0); 
	_arr resize (_this select 2); 
	toString _arr 
};

fnc_removeFromStr = {
	private "_arr", "_returner", "_to", "_i";
	_arr = toArray (_this select 0);
	_returner = [];
	_to = count _arr;
	for "_i" from (_this select 1) to (_to - 1) do {
		_returner=_returner + [(_arr select _i)];
	};
	toString _returner;
};

while {true} do
{
	sleep 0.2;
	_future = time;
	_startTime = diag_tickTime;
	_strToSend = "";
	_count = 0;
	_sentMsgCount = 0;
	_maxCount = count allUnits;
	//einheiten ?bertragen
	{
		_side = side _x;
		if((_side == west and MV_ShowWestUnits) or (_side == east and MV_ShowEastUnits) or (_side == resistance and MV_ShowGuerUnits)) then
		{
			_items = "abc";
			//_items = format["%1%2%3%4%5%6[%7][%8]", uniformItems _x, vestItems _x, backpackItems _x, weaponsItems _x, items _x, assignedItems _x, headGear _x, goggles _x];
			_preWaypoints = [];
			{
				_preWaypoints = _preWaypoints + [waypointPosition _x];
			}
			foreach waypoints _x;
			_index = currentWaypoint group _x;

			_waypoints = [];
			while{_index < count _preWaypoints} do
			{
				_waypoints = _waypoints + [(_preWaypoints select _index)];
				_index = _index + 1;
			};

			_unit = [getPos _x, name _x, groupID (group _x), getDammage _x, str (side _x), getDir _x, _items, _waypoints, "#"];
			_strToSend = format["%1%2", _strToSend, str _unit];
			
			if(count(toArray(_strToSend)) > 3000) then
			{
				if(_sentMsgCount == 0) then
				{
					_strToSend = "SVR_MSG_START_UNITS_" + _strToSend;
				}
				else
				{
					_strToSend = "SVR_MSG_UNITS" + _strToSend;
				};
				_returned = "ArmaToExternConnector" callExtension _strToSend;
				_strToSend = "";
				_sentMsgCount = _sentMsgCount + 1;
			};
			if(_count == (_maxCount - 1)) then
			{
				if(_sentMsgCount == 0) then
				{
					_strToSend = format["SVR_MSG_START_UNITS_%1%2", _strToSend, "#END_OF_MESSAGE_UNITS#"];
				}
				else
				{
					_strToSend = format["SVR_MSG_UNITS_%1%2", _strToSend, "#END_OF_MESSAGE_UNITS#"];
				};
				_returned = "ArmaToExternConnector" callExtension _strToSend;
				_sentMsgCount = _sentMsgCount + 1;
				_strToSend = "";
			};
		};
		_count = _count + 1;
	}
	foreach allUnits;
	_sentMsgCount = 0;
	//SVR_MSG_

	
	_unitEndTime = diag_tickTime;

	_strToSend = "SVR_MSG_START_VEHICLES_";
	{
		_crew = fullCrew _x;
		_crewString = "";
		{
			_crewString = _crewString + "[" + (name (_x select 0)); 
			_crewString = _crewString + "," + str(_x select 1); 
			_crewString = _crewString + "," + str(_x select 2); 
			_crewString = _crewString + "," + str(_x select 3);
			_crewString = _crewString + "," + str(_x select 4) + "],";
		}
		foreach _crew;
		_strToSend = _strToSend + "[" + str (getPos _x) + "," +(typeOf _x) + "," + str (getDir _x) + ",[" + _crewString + "]" + "]";
		if(count(toArray(_strToSend)) > 3000) then
		{
			"ArmaToExternConnector" callExtension _strToSend;
			_strToSend = "SVR_MSG_VEHICLES_";
		};
	}
	foreach vehicles;

	"ArmaToExternConnector" callExtension _strToSend + "#END_OF_MESSAGE_VEHICLES#";

	_strToSend = "SVR_MSG_START_MARKERS_";
	{
		_markerText = (markerText _x);
		if(_markerText == "") then { _markerText = " "};
		_strToSend = _strToSend + "[" + (str (getMarkerPos _x)) + "," + (getMarkerType _x) + "," + _markerText + "," +  _x + "]";
	} forEach allMapMarkers;
	"ArmaToExternConnector" callExtension _strToSend + "#END_OF_MESSAGE_MARKERS#";
	_endTime = diag_tickTime;
	//hint format["Sent to server \n full time: %1 \n Unit Time: %2", _endTime - _startTime, _unitEndTime - _startTime];
	_future = time - _future;
	hint format["time for loop: %1", _future];
};

//Substring
KRON_StrMid = {
	private["_in","_pos","_len","_arr","_i","_out"];
	_in=_this select 0;
	_pos=abs(_this select 1);
	_arr=[_in] call KRON_StrToArray;
	_len=count(_arr);
	if ((count _this)>2) then {_len=(_this select 2)};
	_out="";
	if ((_pos+_len)>=(count _arr)) then {_len=(count _arr)-_pos};
	if (_len>0) then {
		for "_i" from _pos to (_pos+_len-1) do {
			_out=_out + (_arr select _i);
		};
	};
	_out
};

KRON_StrToArray = {
	private["_in","_i","_arr","_out"];
	_in=_this select 0;
	_arr = toArray(_in);
	_out=[];
	for "_i" from 0 to (count _arr)-1 do {
		_out=_out+[toString([_arr select _i])];
	};
	_out
};