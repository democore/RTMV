
_returned = "ArmaToExternConnector" callExtension "getInfo";
//hint format["server returned: %1", _returned];

if(_returned == "none") then
{
	
}
else
{
	_singleStrings = [];
	//Alle befehle aufschlüsseln
	hint _returned;
	while{["#", _returned] call KK_fnc_inString != -1} do
	{
		_foundIndex = ["#", _returned] call KK_fnc_inString;
		//hint format["index: %1    Message: %2",_foundIndex,([_returned, 0, _foundIndex - 1] call KRON_StrMid)];
		_singleStrings = _singleStrings + [[_returned, 0, _foundIndex - 1] call KRON_StrMid];//_foundIndex - 1] call KRON_StrMid];
		
		_returned = [_returned, _foundIndex, (count toArray(_returned)) - (_foundIndex)] call KRON_StrMid;
		
	};
	//hint _singleStrings;
	//hint format["got data1: %1", str _singleStrings];
	//foreach task
	
	{
		//hint _x;
		_command = [_x, 0, 1] call KRON_StrMid;
		_commandTwo = [_x, 0, 2] call KRON_StrMid;
		_commandThree = [_x, 0, 3] call KRON_StrMid;
		
		_didFindCommand = false;
		
		//hint _commandTwo;
		if(_commandTwo == "ss") then
		{
			//server settings
			_stringToSend = format["SVR_MSG_SETTINGS_[%1,%2,%3,%4]",str MV_ShowWestUnits,str MV_ShowEastUnits,str MV_ShowGuerUnits,str MV_ShowEmptyVehicles];
			"ArmaToExternConnector" callExtension _stringToSend;
		};
		if(_commandTwo == "ai") then
		{
			//add item
			_commandArguments = [_x, 3, (count toArray(_x)) - 3] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			{
				if(name _x == _arguments select 0) then
				{
					_x addItem (_arguments select 1);
				};
			}
			foreach allUnits;
			_didFindCommand = true;
		};
		if(_commandTwo == "at" and not _didFindCommand) then
		{
			//add Task
			_commandArguments = [_x, 3, (count toArray(_x)) - 3] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			_unit = nil;
			{
				if(name _x == (_arguments select 0)) then
				{
					_unit = _x;
				};
			}
			foreach allUnits;
				
			if((_arguments select 5) == "0") then
			{
				_task = _unit createsimpletask [(_arguments select 1)];
				_task setSimpleTaskDescription [(_arguments select 2), (_arguments select 1), (_arguments select 3)];
				_task setsimpletaskdestination (_arguments select 4);
				_task settaskstate "Created";
			}
			else
			{
				{
					_task = _x createsimpletask [(_arguments select 1)];
					_task setSimpleTaskDescription [(_arguments select 2), (_arguments select 1), (_arguments select 3)];
					_task setsimpletaskdestination (_arguments select 4);
					_task settaskstate "Created";
				}
				foreach units (group _unit);
			};
			//[nil, nil, _task, "created"] execvm "\ca\modules\mp\data\scriptcommands\taskhint.sqf";
			
			//hint "task created";
			_didFindCommand = true;
		};
		if(_commandThree == "gui" and not _didFindCommand) then
		{
			_commandArguments = [_x, 4, (count toArray(_x)) - 4] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			{
				if(name _x == (_arguments select 0)) then
				{
					_primaryWeapon = [primaryWeapon _x] + primaryWeaponItems _x + [primaryWeaponMagazine _x];
					_secondaryWeapon = [secondaryWeapon _x] + secondaryWeaponItems _x + [secondaryWeaponMagazine _x];
					_handGunWeapon = [handgunWeapon _x] + handgunItems _x + [handGunMagazine _x];
					
					_weapons = [_primaryWeapon] + [_secondaryWeapon] + [_handGunWeapon];
					_items = format["%1%2%3%4%5%6[%7][%8]", [uniform _x] + uniformItems _x, [vest _x] + vestItems _x, [backpack _x] + backpackItems _x, _weapons,  assignedItems _x, [headGear _x], [goggles _x], [binocular _x], [hmd _x]];
					
					_strToSend = "SVR_MSG_INVEN_" + str _items + "," + name _x;
					//hint format["sending %1", _strToSend];
					_returned = "ArmaToExternConnector" callExtension _strToSend;
				};
			}
			foreach allUnits;
			
			_didFindCommand = true;
		};
		if(_command == "c" and not _didFindCommand) then
		{
			//create Unit
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			_className = (_arguments select 0);
			if((_arguments select 0) isKindOf "Man") then
			{
				_newUnit =  _className createUnit [(_arguments select 1), group player];
				//hint format ["creating %1 as Unit", _className];
			}
			else
			{
				_newVehicle = _className createVehicle (_arguments select 1);
				//hint format ["creating %1 as Vehicle", _className];
			};
			_didFindCommand = true;
		};
		if(_command == "g" and not _didFindCommand) then
		{
			//create Group
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			_group = nil;
			_code = compile format["createGroup %1", _arguments select 1];
			call _code;
			
			_group setGroupID [arguments select 0];
			_didFindCommand = true;
		};
		if(_command == "e" and not _didFindCommand) then
		{
			//Execute command
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_code = compile _commandArguments;
			call _code;
			_didFindCommand = true;
		};
		if(_command == "w" and not _didFindCommand) then
		{
			//create waypoint
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			{
				if(groupID _x == (_arguments select 0)) then
				{
					_x addWayPoint [(_arguments select 1), 5];
				};
			}
			forEach allGroups;
			_didFindCommand = true;
			
		};
		if(_command == "m" and not _didFindCommand) then
		{
			//Marker auf Map setzen
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			_markerstr = createMarker["markername",_arguments select 0]; 
			_markerstr setMarkerShape "RECTANGLE"; 
			"markername" setMarkerText (_arguments select 1);
			"markername" setMarkerType "Warning"; 
			"markername" setMarkerSize [(_arguments select 2), (_arguments select 3)];
			_didFindCommand = true;
		};
		if(_command == "t" and not _didFindCommand) then
		{
			//einheit teleportieren
			_commandArguments = [_x, 2, (count toArray(_x)) - 2] call KRON_StrMid;
			_arguments = [];
			_code = compile format["_arguments = [%1]", _commandArguments];
			call _code;
			
			{
				if(name _x == _arguments select 0) then
				{
					_x setPos (_arguments select 1);
				};
			}
			foreach allUnits;
			_didFindCommand = true;
		};
	}
	foreach _singleStrings;
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

//Index of
KK_fnc_inString = { 
	/* Author: Killzone_Kid Description: Find a string within a string (case insensitive) 
	Parameter(s): 
	_this select 0: <string> string to be found 
	_this select 1: <string> string to search in 
	Returns: Boolean (true when string is found) 
	How to use: _found = ["needle", "Needle in Haystack"] call KK_fnc_inString; 
	*/ 
	private ["_needle","_haystack","_needleLen","_hay","_found"]; 
	_needle = [_this, 0, "", [""]] call BIS_fnc_param; 
	_haystack = toArray ([_this, 1, "", [""]] call BIS_fnc_param); 
	_needleLen = count toArray _needle; 
	_hay = +_haystack; 
	_hay resize _needleLen; 
	_found = false; 
	_foundIndex = -1;
	for "_i" from _needleLen to count _haystack do 
	{ 
	if (toString _hay == _needle) exitWith {_foundIndex = _i}; 
		_hay set [_needleLen, _haystack select _i]; 
		_hay set [0, "x"]; 
		_hay = _hay - ["x"] 
	}; 
	_foundIndex 
};
