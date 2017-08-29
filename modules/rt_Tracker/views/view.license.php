<?php
class rt_TrackerViewLicense extends SugarView{
	function rt_TrackerViewLicense(){
		parent::SugarView();
	}

	public function preDisplay(){
	if (!isset($this->dv)) 
    		$this->dv->tpl = 'custom/modules/rt_Tracker/tpls/license.tpl';

	}


	public function display(){
		
		$ss = new Sugar_Smarty();
		parent::display();
		$ss->assign("title","RTCXM License Configuration Page");
		$mod_strings = return_module_language($GLOBALS['current_language'], 'rt_Tracker');
		$ss->assign('MOD', $mod_strings);

		$ss->display($this->dv->tpl);
	}
}