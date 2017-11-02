(function(global) {
    var mobileSkin = "",
        app = global.app = global.app || {};
    var initscr = 0;

    // Listen for orientation changes
    window.addEventListener("orientationchange", function() {       
        loadOffers();
    }, false);

    

    document.addEventListener('deviceready', function() {
        StatusBar.hide();
        navigator.splashscreen.show();
        deviceName = device.name;
        deviceId = device.uuid;
        deviceOs = device.platform;
        deviceOsVersion = device.version;
        MobileApp.showLoading();
        initscr = 0;        

        DeviceInfo.DeviceName = deviceName;
        DeviceInfo.DeviceId = deviceId;
        DeviceInfo.DeviceOs = deviceOs;
        DeviceInfo.DeviceOsVersion = deviceOsVersion;
        DeviceInfo.UserName = '';
        DeviceInfo.Register = true;

        var argsl = {
            data: DeviceInfo
        };

        var jsonArgsl = JSON.stringify(argsl);
        Type = "POST";
        Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetAuthenticationByDevice";
        Data = jsonArgsl;

        FunctionName = 'GetAuthenticationByDevice';
        $.when(CallService()).done(function(a1) {
            if (isDataExist('Subsc')) {
                IsvalidUser = true;
                if (Customer.Subscriptions.length > 1) {
                    for (var i = 0; i < Customer.Subscriptions.length; i++) {
                        if (!Customer.getSubscription(i).LoginAllowed) {
                            Customer.Subscriptions.splice(i, 1);
                        }
                    }
                }
                else if (Customer.Subscriptions.length === 1) {
                    if (!Customer.getSubscription(0).LoginAllowed) {
                        IsvalidUser = false;
                    }
                }

                DeviceInfo.UserName = Customer.CivilID;
               
                if (IsvalidUser) {
                    MobileApp.navigate('#v_home');
                    initscr = 1;
                }
                else
                    MobileApp.navigate('#v_login');
                navigator.splashscreen.hide();
            }
            else {
                IsvalidUser = false;
                MobileApp.navigate('#v_login');
                navigator.splashscreen.hide();
            }
            MobileApp.hideLoading();
        });

        $(document.body).height(window.innerHeight);
    }, false);

    // Here "addEventListener" is for standards-compliant web browsers and "attachEvent" is for IE Browsers.
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];

    // Now...
    // if 
    //    "attachEvent", then we need to select "onmessage" as the event. 
    // if 
    //    "addEventListener", then we need to select "message" as the event

    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child IFrame window
    eventer(messageEvent, function(e) {
        if (typeof(e.data) !== 'undefined' && e.data.indexOf('resultMobile.aspx') > -1) {
            PostLoadKNET(e.data);
        }
        else if (typeof(e.data) !== 'undefined' && e.data.indexOf('errorMobile.aspx') > -1) {
            PostLoadKNETErr(e.data);
        }
        // Do whatever you want to do with the data got from IFrame in Parent form.
    }, false);
    
    document.addEventListener("backbutton", function(e) {       
        if (MobileApp.view().id==='#v_home' && initscr===1) {           
            navigator.app.exitApp();
        }
        else if (MobileApp.view().id==='#v_login' && initscr===0) {            
            navigator.app.exitApp();
        }
        else {         
            navigator.app.backHistory();
        }      
    }, false);   

    $(function() {
        function changeSubmitVisibility(state) {
            if (device.platform === 'iOS') {
                var elem = $('#v_login input[type="submit"]');
                if (state) {
                    elem.show();
                }
                else {
                    elem.hide();
                }
            }
        }

        $('#v_login form ul input').focus(function() {
            changeSubmitVisibility(false);
        });
        $('#v_login form ul input').blur(function() {
            changeSubmitVisibility(true);
        });
    });
})(window);