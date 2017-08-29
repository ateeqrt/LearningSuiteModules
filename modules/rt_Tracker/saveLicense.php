<?php
require_once('data/SugarBean.php');
ob_clean();

function save_user_prefs($update_license_key) {
    global $current_user;
    global $timedate;
    $time_now = $GLOBALS['timedate']->nowDb();
    
    console.log("update called!");
    
    // Save license key if not saved earlier
    if ($update_license_key == true) {
        
        $save_license = "UPDATE rt_tracker SET license_key='" . $_REQUEST['license_key'] . "' WHERE created_by='" . $current_user->id . "'";
        $GLOBALS['db']->query($save_license);
        $save_date_modified = "UPDATE rt_tracker SET date_modified='" . $time_now . "' WHERE license_key='" . $_REQUEST['license_key'] . "'";
        $GLOBALS['db']->query($save_date_modified);        
    }
    
}
;

$update_license_key = false; //is license key saved or not
$result_user        = $GLOBALS['db']->query("SELECT created_by FROM rt_tracker WHERE created_by='" . $current_user->id . "' AND deleted=0");

$row = $GLOBALS['db']->fetchByAssoc($result_user);

if ($row == null) {
    $time_now = $GLOBALS['timedate']->nowDb();
    echo $row;
    $update_license_key = false;
    $save_prefs_query   = "INSERT INTO rt_tracker(id, date_entered, date_modified, modified_user_id, created_by, deleted, license_key) VALUES('" . create_guid() . "', '" . $time_now . "', '" . $time_now . "', '" . $current_user->id . "', '" . $current_user->id . "', 0, '" . $_REQUEST['license_key'] . "' )";

    $GLOBALS['db']->query($save_prefs_query);    
}

$row = $GLOBALS['db']->fetchByAssoc($result_user);

save_user_prefs($update_license_key);

if ($row != null && ($row['license_key'] == NULL || empty($row['license_key']))) {
    $update_license_key = true; // License key not saved
}

exit();

?>
