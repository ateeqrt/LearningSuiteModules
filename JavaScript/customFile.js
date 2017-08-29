$(document).ready(function () {

    // script is now loaded and executed.
    // put your dependent JS here.
    window.storeZFID = function () {
        var res = false;
        var collection = SUGAR.App.data.createBean("rt_Tracker", {id: "1"});
        jQuery.ajaxSetup({async: false});
        var promise = collection.fetch({
            success: function () {
                if (collection['attributes']['zfid'].length > 0)
                    window.zfid = collection["attributes"]["zfid"];
            },
            error: function (e) {
                if (e.errorThrown == 'Not Found') {
                    e.message = 'RT CXM is not validated';
                    e.status = (e.status) ? e.status : '404';
                }
                window.handleDashletCallError(e);
				window.notFound = true;
            }
        });
        jQuery.ajaxSetup({async: true});
    }
    if (typeof google == "undefined") {
        $.getScript('cache/include/javascript/newGroupingRt.js', function () {
			// Call Web Socket JS Client for SUGAR
			callWebSocket();
			// Add Custom Style in NotifyJS Script
            $.notify.addStyle('rtcxmchatstyle', {
                html: "<div><span data-notify-text/></div>",
                classes: {
                    base: {
                        "white-space": "pre",
                        "color": "#468847",
                        "background-color": "#DFF0D8",
                        "border-color": "#D6E9C6",
                        "font-weight": "bold",
                        "padding": "7px 10px",
                        "border-radius": "5px",
                        "white-space": "no-wrap",
                    },
                    newmessage: {
                        "font-size": "small",
                        "white-space": "normal",
                        "width": "100px",
                    },
                }
            });
            $.notify.addStyle('smtmsg', {
                html: "<div>" +
                "<div class='clearfix'>" +
                "<div class='title' data-notify-html='title' style='white-space:pre-wrap;font-size:12px'/>" +
                "<div class='buttons'>" +
                "<button class='yes' data-notify-text='button'></button>" +
                "</div>" +
                "</div>" +
                "</div>",
                classes: {
                    base: {
                        "white-space": "pre",
                        "background-color": "aliceblue",
                        "padding": "5px",
                        "width": "300px",
                    }
                }
            });
            $.notify.addStyle('newmessage', {
                html: "<div>" +
                "<div class='clearfix'>" +
                "<div class='title' data-notify-html='title' style='white-space:pre-wrap;font-size:12px'/>" +
                "</div>" +
                "</div>",
                classes: {
                    base: {
                        "font-size": "small",
                        "white-space": "normal",
                        "width": "100px",
                        "white-space": "pre",
                        "color": "#468847",
                        "background-color": "#DFF0D8",
                        "border-color": "#D6E9C6",
                        "font-weight": "bold",
                        "padding": "7px 10px",
                        "border-radius": "5px",
                        "white-space": "no-wrap",
                    }
                }
            });
        });
    }
	
    loadrtcxm();

    function loadrtcxm() {
        if (App.api.isAuthenticated()) {
            loadCss();
            validateCxmUser();
			if (window.rtvalidatecxm)
                    window.websocket();
        } else {
            setTimeout(function () {
                loadrtcxm();
            }, 500);
        }
    }
	
	function callWebSocket(interval) {
		if (window.rtvalidatecxm)
			window.websocket();
		else{
			if (typeof interval == 'undefined')
				interval = 1;
			var ms = 1000 * interval;
			setTimeout(function () {
				callWebSocket(interval + 2);
			}, ms);
		}
	}
});

window.handleDashletCallError = function (error) {
    var msg = {autoClose: false, level: 'error'};
    if (error && _.isString(error.message)) {
        if (error.message.indexOf('LBL_') != -1)
            error.message = SUGAR.App.lang.get(error.message, 'rt_Tracker');
        msg.messages = error.message;
    } else {
        msg.messages = 'Unknown Error';
    }
    if (error.status == 412 && !error.request.metadataRetry) {
        return;
        msg.messages = 'If this page does not reload automatically, please try to reload manually';
    }
    // if (error && _.isString(error.message)) {
    // msg.messages = error.message;
    // }
    App.alert.dismiss('rtCXM_config');
    App.logger.error('Failed: ' + error);
    if (typeof error.status != 'undefined') {
        if (error.status == 400) {
            if (typeof error.responseText != 'undefined') {
                if (error.responseText.indexOf('LBL_') != -1)
                    error.responseText = SUGAR.App.lang.get(error.responseText, 'rt_Tracker');
                msg.messages = error.responseText;
            }
        }
        App.alert.show('rtCXM_config', msg);
    }
},

readCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function validateCxmUser() {
    _apivalidate();
}

function validatePackage(callback, c) {
	if (typeof c == 'undefined')
		c = 1;
	var ms = 500 * c;
	setTimeout(function () {
		if (_.isEmpty(SUGAR.App.lang.getAppListStrings('moduleList'))) {
			validatePackage(callback, c + 1);
		} else {
			var checkModule = SUGAR.App.lang.getAppListStrings('moduleList');
			if (typeof checkModule.rt_Tracker == "undefined") {
				App.alert.show("rtCXM_Package", {
					level: 'warning',
					title: 'Rebuild Cache',
					messages: 'Please perform a <b>Repair and Rebuild</b> to Completely Uninstall <b>RT CXM</b>. Otherwise you will keep seeing this warning.'
				});
			} else {
				callback();
			}
		}
	}, ms);
}

function _apivalidate() {
	var callback = function () {
		var prefsURL = App.api.buildURL('rtCXM/Validate', null, null, {
			oauth_token: App.api.getOAuthToken()
		});
		App.api.call('GET', prefsURL, null, {
			success: _.bind(function(result) {
				if (typeof result == 'string')
					result = JSON.parse(result);
				if (result !== null && result.isValid !== null && result.cxmValid !== null) {
					window.rtvalidatecxm = (result.isValid && result.cxmValid) ? true : false;
				}
			}, this),
			error: _.bind(function(e) {
				window.handleDashletCallError(e);
				window.rtvalidatecxm = undefined;
				setTimeout(function() {
					_apivalidate();
				}, 6000);
			}, this)
		});
	};
	validatePackage(callback);
}

function loadCss() {
	var callback = function () {
        var prefsURL = App.api.buildURL('rtCXMConfigurations/getCSS', null, null, {
            oauth_token: App.api.getOAuthToken()
        });
        App.api.call('POST', prefsURL, null, {
            success: _.bind(function(result) {
                $('head').append('<style type="text/css" id="rtcxm-style">' + result.data + '</style>');
            }, this),
            error: _.bind(function(e) {
                console.log(e);
                window.handleDashletCallError(e);
                setTimeout(function() {
                    loadCss();
                }, 6000);
            }, this)
        });
	};
	validatePackage(callback);
}

$(document)
    .one('focus.textarea', '.autoExpand', function () {
        var savedValue = this.value;
        this.value = '';
        if (this.baseScrollHeight == undefined)
            this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.textarea', '.autoExpand', function () {
        var minRows = this.getAttribute('data-min-rows') | 0,
            rows;
        this.rows = minRows;
        rows = (this.scrollHeight - this.baseScrollHeight) / 17;
        this.rows = minRows + rows;
        if (rows < 0) {
            this.rows = 1;
        }
        if (this.rows === 1) {
            $('.conversation').css('height', '241px');
            $('.btb').css('margin-top', '-3px');
        } else if (this.rows === 2) {
            $('.conversation').css('height', '230px');
            $('.btb').css('margin-top', '3px');
            updateScroll();
        } else if (this.rows >= 3) {
            $('.conversation').css('height', '212px');
            $('.btb').css('margin-top', '13px');
            updateScroll();
        }
    });

function updateScroll() {
    var height = 0;
    $('.conversation div').each(function (i, val) {
        height += parseInt($(this).height());
    });
    height += '';
    $('.conversation').animate({scrollTop: height});
}