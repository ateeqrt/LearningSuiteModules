{literal}
<style>
	div.customMainPane
	{
		padding-top: 5%;
	}
	div.customMainPane
	{
		padding-top: 5%;
	}
	.bold_users {
		font-weight: bold;
	}
	.boost{
		width: 135px !important;
		height: inherit !important;
	}
	.custom_width{
		width: 95% !important;
	}
	.configureUsers{
		height: 300px;
		width: 507px;
	}
	.configureUsers th{
		border: 1px solid;
	}
	.configureUsers td{
		vertical-align: top;
		border: 1px solid;
	}
	#disabled, #enabled {
		float: left;
		list-style-type: none;
		margin: 0 10px 0 0;
		padding: 0 0 2.5em;
		height: 300px;
		width: 100%;
		min-width: 160px !important;
		overflow: scroll;
	}
	.connectedSortable {
		min-height: 50px;
		min-width: 50px;
		font-weight: normal !important;
	}
	#disabled li, #enabled li {
		
		margin: 5px 0px -4px 5px;
		padding: 5px;
		width: 86%;
	}
	.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {
		border: 1px solid #D3D3D3;
		color: #555555;
		font-weight: normal;
	}
	.do-not-drag-drop{
		background: repeat-x scroll 50% 50% #E6E6E6;
		border: 1px solid #D3D3D3;
		color: #555555;
		font-weight: bold;
	}
</style>
{/literal}
<script src="include/javascript/jquery/jquery-min.js"></script>
<script src="include/javascript/jquery/jquery-ui-min.js"></script>

<script src="include/javascript/jquery/jquery.cookie.js" type="text/javascript"></script>
<script src="http://yui.yahooapis.com/3.2.0/build/yui/yui-min.js"></script> <!-- to implement touch for mobile devices for drag and drop and js features -->


<div>
	<div class="headerpane">
		<h1>
		<div class="record-cell">
			<span class="module-title">{$title}</span>
		</div>
		<div class="btn-toolbar pull-right">
			<span sfuuid="123" class="edit">
			<a class="btn btn-primary"  href="javascript:validation_processing()" name="validate_button id="validate_button">
				{$MOD.LBL_VALIDATE_LABEL}
				<span id="validation_msg" name="validation_msg" style="color:red;"></span>
			</a>
			<a class="btn btn-primary hide" href="javascript:void(0);" name="continue_button" id="continue_button">
				{$MOD.LBL_CONTINUE_LABEL}
			</a>
			<a class="btn btn-primary hide" href="javascript:void(0);" name="boost_button" id="boost_button">
				{$MOD.LBL_BOOST_LABEL}
			</a>
			</span>
		</div>
		</h1>
	</div>
	<!--headerpane ends-->

	<div class="record">
		<div class="row-fluid panel_body">
			<div class="span4 record-cell" data-type="text" data-name="license_key_steps">
			<p>{$MOD.LBL_STEPS_TO_LOCATE_KEY_TITLE}</p>
			<div class="record-label" data-name="">
				{$MOD.LBL_STEPS_TO_LOCATE_KEY1}
			</div>
			<div class="record-label" data-name="">
				 {$MOD.LBL_STEPS_TO_LOCATE_KEY2}
			</div>
			<div class="record-label" data-name="">
				 {$MOD.LBL_STEPS_TO_LOCATE_KEY3}
			</div>
			<div class="record-label" data-name="">
				 {$MOD.LBL_STEPS_TO_LOCATE_KEY4}
			</div>
			<div class="record-label" data-name="">
				 {$MOD.LBL_STEPS_TO_LOCATE_KEY5}
			</div>
			</div>
		</div>
	</div>
	<!--record ends-->

	<div class="row-fluid panel_body">
		<div class="span4 record-cell hide" id="users_count" data-type="text" data-name="users_count">
			<div class="record-label " id="salesmap_users"></div>
			<div class="record-label " id="licensed_users"></div>
		</div>
	</div>

	<div class="row-fluid panel_body">
		<div class="span4 record-cell" data-type="text" data-name="license_key">
		<div class="record-label" data-name="license_key">{$MOD.LBL_LICENSE_KEY}</div>
		<span class="normal index" data-fieldname="license_key" data-index="">
		<span sfuuid="317" class="edit">
		<input type="text" name="license_key" id="license_key" value="{$license_key}" maxlength="100" class="inherit-width" style="height: inherit" placeholder="{$MOD.LBL_LICENSE_KEY}" />
		</span>
		</span>
		</div>
	</div>
</div>

{literal}
<script type="text/javascript">
var licenseKey = '';
var license_validator= false;
var title,
    isRepaired,
    isValidated,
    active_users,
    enabled_active_users,
    licensed_user_count,
    showBoostButton,
    license_key,
    continueURL,
    usersObject,
    users_mulitiselect,
    selected,
    select2Onchange = true,
    userConfig = false,

    className = 'customMainPane',
    license_key,
    update = false, //true if previously license is saved
    continueURL,
    user_count,
    licensed_user_count;

function validation_processing() {
    if ($('input[name=license_key]').val().trim() == "") {
        $("#validation_msg").text("Key should not be empty").show().fadeOut(2000);
    } else {
        $("#validation_msg").text("Validating License Key...").show();
        var rt_Tracker_key = '6822a0f4daea20bb3d8b9e7f86d8ad25';
        var user_key = $("#license_key").val().trim();
        licenseKey = user_key;
        console.log(user_key);
        $.ajax('https://www.sugaroutfitters.com/api/v1/key/validate', {
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            data: {
                format: 'jsonp',
                public_key: rt_Tracker_key,
                key: user_key
            },
            timeout: 5000 //work around for jsonp not returning errors
        }).success(function(response) {
            $("#validation_msg").css({
                color: "DarkGreen"
            });
            $("#validation_msg").text("Validation: Successful").show().fadeOut(3000);
            $("#validate_button").addClass('hide');
            $("#license_validator").val(true);
            validateLicenseSuccess(response,user_key);
        }).error(function() {
            $("#validation_msg").text("Validation: Un-Successful").show().fadeOut(3000);
            $("#license_validator").val(false);
        });
    }
}

function validateLicenseSuccess(response,user_key) {

    var msg = {};
    if (response) {
        if (response.data) {
            if (response.data.validated && response.data.validated == true) {
                //validation true
                if (response.data.validated_users && response.data.validated_users == true) {
                    this.user_count = response.data.user_count;
                    this.licensed_user_count = response.data.licensed_user_count;

                    this.userConfig = true;
                    this.getUserConfig();
                } else {
                    this.user_count = response.data.user_count;
                    this.licensed_user_count = response.data.licensed_user_count;

                }
                $('#validate_button').hide();
                $('#licensed_users').html(this.LBL_LICENSED_USERS + ': ' + this.licensed_user_count);
                $('#users_count').removeClass('hide');
            } 
            else {
                msg = {
                    autoClose: false,
                    level: 'error',
                    messages: response.data
                };
            }
        }
        else {
            msg = {
                autoClose: false,
                level: 'error',
                messages: 'Unkown error'
            };
        }
    }
    else {
        msg = {
            autoClose: false,
            level: 'error',
            messages: 'No response received from server.'
        };
    }
	YAHOO.util.Connect.asyncRequest(
		'POST',
		'index.php',
		{
			//'success':window.alert("about to go to that action"),
			'failure':null
		},
		'module=rt_Tracker&action=saveLicense&license_key='+user_key+'&sugar_body_only=false'
		);
	console.log('module=rt_Tracker&action=saveLicense&license_key='+user_key+'&sugar_body_only=false')
}
</script>
{/literal}