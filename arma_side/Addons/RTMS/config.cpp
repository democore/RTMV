class CfgPatches
{
	class RTMS
	{
		units[] = {};
		weapons[] = {};
		requiredVersion = 1.0;
		requiredAddons[] = {"Extended_EventHandlers"};

	};
};

class Extended_PostInit_EventHandlers
{
  RTMS_Post_Init = "RTMS_Post_Init_Var = [] execVM ""\RTMS\init.sqf""";
};