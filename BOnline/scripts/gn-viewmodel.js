(function(global) {
    var LoginViewModel, PackagesViewModel, UserDataViewModel, MyInternetViewModel, InfoViewModel,
        OrderDataViewModel, LocationsViewModel,
        app = global.app = global.app || {};

    //var MobileApp=app.application;

    LoginViewModel = kendo.data.ObservableObject.extend({
                                                            LoadData: function(e) {
                                                                
                                                                var myLoginModel = kendo.observable({
                                                                                                        isLoggedIn: false,
                                                                                                        username: "",
                                                                                                        olduser: "",
                                                                                                        email: "",
                                                                                                        mobile: "",
                                                                                                        isAllowedLogin: true,  
                                                                                                        isRegistered:isRegistered,
                                                                                                        onLogout: function(e) {
                                                                                                            var that = this;
                                                                                                            doLogOut = false;
                                                                                                            that.clearForm();
                                                                                                            that.set("isLoggedIn", false);
                                                                                                        },
                                                                                                        chkRegistered:function(e) {
                                                                                                            var that = this;
                                                                                                            if (e.checked) {
                                                                                                                isRegistered = true;
                                                                                                                that.set("isRegistered", true);
                                                                                                                $(".RegisterInfo").show(); 
                                                                                                            }
                                                                                                            else {
                                                                                                                isRegistered = false;
                                                                                                                that.set("isRegistered", false);
                                                                                                                $(".RegisterInfo").hide(); 
                                                                                                            }
                                                                                                            
                                                                                                        },
                                                                                                        clearForm: function() {
                                                                                                            var that = this;
                                                                                                            that.set("username", "");
                                                                                                            that.set("olduser", "");
                                                                                                            that.set("email", "");
                                                                                                            that.set("mobile", "");
                                                                                                            that.set("customerName", "");
                                                                                                            that.set("speed", "");
                                                                                                            that.set("expDate", "");
                                                                                                            clearData('GetServiceDetailsByCivilID');
                                                                                                            IsvalidUser = false;
                                                                                                            doLogOut = false;
                                                                                                            showMyInternet = false;
                                                                                                            selSubcrID = 0;
                                                                                                        },

                                                                                                        onLogin: function() {
                                                                                                            var that = this,
                                                                                                                username = that.get("username").trim(),
                                                                                                                email = that.get("email").trim(),
                                                                                                                mobile = that.get("mobile").trim();
                                                                                                            
                                                                                                            that.set("isAllowedLogin", true);

                                                                                                            if (loginvalidator.validate()) {
                                                                                                                MobileApp.showLoading();
                                                                                                                if (username === "") {
                                                                                                                    MobileApp.hideLoading();
                                                                                                                    navigator.notification.alert("Civil id is required!",
                                                                                                                                                 function() {
                                                                                                                                                 }, "Login failed", 'OK');
                                                                                                                    return;
                                                                                                                }
                                                                                                                
                                                                                                                if (!that.get("isRegistered") && (email==="" || mobile==="")) {
                                                                                                                    MobileApp.hideLoading();
                                                                                                                    navigator.notification.alert("Please provide registration information",
                                                                                                                                                 function() {
                                                                                                                                                 }, "Information required", 'OK');
                                                                                                                    return;
                                                                                                                }

                                                                                                                if (!isOnline()) {
                                                                                                                    MobileApp.hideLoading();
                                                                                                                    navigator.notification.alert("No network connection available. Please try again when online.",
                                                                                                                                                 function() {
                                                                                                                                                 }, "No Internet Connetction", 'OK');
                                                                                                                    return;
                                                                                                                }

                                                                                                                DeviceInfo.UserName = username;
                                                                                                                DeviceInfo.Email = email;
                                                                                                                DeviceInfo.Mobile = mobile;                                                                                                                
                                                                                                                DeviceInfo.Register = isRegistered;

                                                                                                                var argslg = {
                                                                                                                    data: DeviceInfo
                                                                                                                };
                                                                                                                var jsonArgslg = JSON.stringify(argslg);

                                                                                                                Type = "POST";
                                                                                                                Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetAuthenticationByUserInfo";
                                                                                                                Data = jsonArgslg;
                                                                                                                
                                                                                                                FunctionName = 'GetAuthenticationByUserInfo';
                                                                                                                $.when(clearData('GetServiceDetailsByCivilID'), CallService()).done(function(a1) {
                                                                                                                    if (isDataExist('Subsc')) {
                                                                                                                        IsvalidUser = true;
                                                                                                                        Customer.set("CivilID", username);
                                                                                                                        var currStatus = Customer.getSubscription(selSubcrID).ServiceStatus;
                                                                                                                        if (currStatus === 'Pending' || currStatus === 'On hold') {
                                                                                                                            IsvalidUser = false;
                                                                                                                            MobileApp.hideLoading();

                                                                                                                            that.set("isAllowedLogin", false);
                                                                                                                            navigator.notification.alert("You are not allowed to login. For enquiry please contact our customer service at 181 6666",
                                                                                                                                                         function() {
                                                                                                                                                         }, "Not Allowed", 'OK');
                                                                                                                            return;
                                                                                                                        }
                                                                                                                        else if (Customer.Subscriptions.length > 1) {
                                                                                                                            for (var i = 0; i < Customer.Subscriptions.length; i++) {
                                                                                                                                if (!Customer.getSubscription(i).LoginAllowed) {
                                                                                                                                    Customer.Subscriptions.splice(i, 1);
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                        else if (Customer.Subscriptions.length === 1) {
                                                                                                                            if (!Customer.getSubscription(0).LoginAllowed) {
                                                                                                                                IsvalidUser = false;
                                                                                                                                MobileApp.hideLoading();

                                                                                                                                that.set("isAllowedLogin", false);
                                                                                                                                navigator.notification.alert("You are not allowed to login. For enquiry please contact our customer service at 181 6666",
                                                                                                                                                             function() {
                                                                                                                                                             }, "Not Allowed", 'OK');
                                                                                                                                return;
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                    else {                                                                                                                       
                                                                                                                        IsvalidUser = false;
                                                                                                                    }

                                                                                                                    that.set("isLoggedIn", IsvalidUser);
                                                                                                                    if (!IsvalidUser) {
                                                                                                                        navigator.notification.alert("Invalid User Credentials!",
                                                                                                                                                     function() {
                                                                                                                                                     }, "Login failed", 'OK');
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        MobileApp.navigate('#v_home');
                                                                                                                    }
                                                                                                                    MobileApp.hideLoading();
                                                                                                                });
                                                                                                            }
                                                                                                            else {
                                                                                                                navigator.notification.alert("Invalid User Credentials!",
                                                                                                                                             function() {
                                                                                                                                             }, "Login failed", 'OK');
                                                                                                                return;
                                                                                                            }
                                                                                                        },
                                                                                                        checkEnter: function(e) {
                                                                                                            var that = this;

                                                                                                            if (e.keyCode === 13) {
                                                                                                                $(e.target).blur();
                                                                                                            }
                                                                                                        }
                                                                                                    })
                                                                if (doLogOut) {
                                                                    myLoginModel.onLogout(e);
                                                                }

                                                                kendo.bind($('#v_login'), myLoginModel);
                                                                $("#checkUser").data("kendoMobileSwitch").bind("change", function (e) {
                                                                    if (e.checked) {
                                                                        isRegistered = true;
                                                                        myLoginModel.set("isRegistered", true);
                                                                        $(".RegisterInfo").hide(); 
                                                                    }
                                                                    else {
                                                                        isRegistered = false;   
                                                                        myLoginModel.set("isRegistered", false);
                                                                        $(".RegisterInfo").show(); 
                                                                    }
                                                                });
                                                               
                                                                
                                                                var switchInstance = $("#checkUser").data("kendoMobileSwitch");    
                                                                if (switchInstance.check()) {
                                                                    $(".RegisterInfo").hide(); 
                                                                    isRegistered = true;
                                                                }
                                                                else {
                                                                    $(".RegisterInfo").show(); 
                                                                    isRegistered = false; 
                                                                }
                                                                
                                                                myLoginModel.set("isAllowedLogin", true);
                                                                
                                                                if (typeof(e.view.id) !== 'undefined') {
                                                                    var scroller = e.view.scroller;
                                                                    if (typeof(scroller) !== 'undefined')
                                                                        scroller.reset();
                                                                }
                                                            },
                                                            ConfigureBackBtn: function(e) {
                                                                if (isDataExist('Subsc')) {
                                                                    kendo.bind($(".CustomerInfo"), Customer);
                                                                    
                                                                    if (typeof(e.view.id) !== 'undefined' && e.view.id === "#v_terms") {
                                                                        $('.GNBackMenuIcon').attr('href', '#:back');
                                                                    }
                                                                    else {
                                                                        $('.GNBackMenuIcon').attr('href', '#v_home');
                                                                    }
                                                                }
                                                                else {
                                                                    $('.GNBackMenuIcon').attr('href', '#v_login');
                                                                }
                                                            }
                                                        });

    UserDataViewModel = kendo.data.ObservableObject.extend({
                                                               LoadData: function() {
                                                                   if (isKNETSucess === true) {
                                                                       Type = "POST";
                                                                       Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetServiceDetailsByCivilID";
                                                                       Data = '{"civilID": "' + Customer.CivilID + '"}';
                                                                       FunctionName = 'GetServiceDetailsByCivilID';
                                                                       setTimeout(function() {
                                                                           $.when(clearData('GetServiceDetailsByCivilID'), CallService()).done(function(a1) {
                                                                               isKNETSucess = false;
                                                                               if (isDataExist('Subsc')) {
                                                                                   kendo.bind($(".CustomerInfo"), Customer);
                                                                               }
                                                                           });
                                                                           MobileApp.hideLoading();
                                                                       }, 6000);
                                                                   }
                                                                   else {
                                                                       if (isDataExist('Subsc')) {
                                                                           kendo.bind($(".CustomerInfo"), Customer);
                                                                           MobileApp.hideLoading();
                                                                           $('.GNBackMenuIcon').attr('href', '#v_home');
                                                                       }
                                                                       else {
                                                                           $('.GNBackMenuIcon').attr('href', '#v_login');
                                                                       }
                                                                   }
                                                               },
                                                               Welcome: function(e) {
                                                                   var mySubcModel = kendo.observable({
                                                                                                          currViewID: "",
                                                                                                          customerName: "",
                                                                                                          speed: "",
                                                                                                          expDate: "",
                                                                                                          mulitipleSubc: false,
                                                                                                          mSubscriptions: Customer.Subscriptions,
                                                                                                          showMyInternet: showMyInternet,
                                                                                                          isUserLogIn: false,
                                                                                                          DoRenew: false,
                                                                                                          DoUpgrade: false,
                                                                                                          DoRUpgrade: false,
                                                                                                          LoadDetails: function(e) {
                                                                                                              var that = this;
                                                                                                              if (!IsvalidUser) {
                                                                                                                  selSubcrID = 0;
                                                                                                                  doLogOut = true;
                                                                                                                  showMyInternet = false;
                                                                                                                  clearData('GetServiceDetailsByCivilID');
                                                                                                              }

                                                                                                              if (isDataExist('Subsc')) {
                                                                                                                  that.set("mSubscriptions", Customer.Subscriptions);
                                                                                                                  that.set("customerName", Customer.CustomerName);
                                                                                                                  if (Customer.Subscriptions.length > 1) {
                                                                                                                      that.set("mulitipleSubc", true);
                                                                                                                      that.set("mSubscriptions", Customer.Subscriptions);
                                                                                                                  }
                                                                                                                  else {
                                                                                                                      that.set("speed", Customer.getSubscription(selSubcrID).PackageName.replace("Mbps", " Mbps"));
                                                                                                                      that.set("expDate", kendo.toString(kendo.parseDate(Customer.getSubscription(selSubcrID).ExpiryDate), 'dd/MMM/yyyy'));
                                                                                                                      showMyInternet = true;
                                                                                                                      that.set("mulitipleSubc", false);
                                                                                                                  }
                                                                                                                  that.set("DoRenew", Customer.getSubscription(selSubcrID).DoRenew);
                                                                                                                  that.set("DoUpgrade", Customer.getSubscription(selSubcrID).DoUpgrade);
                                                                                                                  that.set("DoRUpgrade", Customer.getSubscription(selSubcrID).DoRUpgrade);

                                                                                                                  that.set("isUserLogIn", true);
                                                                                                              }
                                                                                                              else {
                                                                                                                  that.set("isUserLogIn", false);
                                                                                                              }
                                                                                                          },

                                                                                                          onSelectSubc: function(e) {
                                                                                                              var that = this;
                                                                                                              selSubcrID = $("input[name=r_subc]:checked").val();
                                                                                                              showMyInternet = true;
                                                                                                              for (var i = 0; i < Customer.Subscriptions.length; i++) {
                                                                                                                  Customer.getSubscription(i).Selected = false;
                                                                                                                  Customer.getSubscription(i).SelectedSubc = selSubcrID;
                                                                                                              }
                                                                                                              Customer.getSubscription(selSubcrID).Selected = true;

                                                                                                              that.set("DoRenew", Customer.getSubscription(selSubcrID).DoRenew);
                                                                                                              that.set("DoUpgrade", Customer.getSubscription(selSubcrID).DoUpgrade);
                                                                                                              that.set("DoRUpgrade", Customer.getSubscription(selSubcrID).DoRUpgrade);
                                                                                                          },
                                                                                                          onClickLoginBtn: function(obj) {
                                                                                                              MobileApp.navigate('#v_login');
                                                                                                          },
                                                                                                          onClickHBtn: function(obj) {
                                                                                                              MobileApp.navigate('#v_home');
                                                                                                          },
                                                                                                          onClickMIBtn: function(obj) {
                                                                                                              var that = this;
                                                                                                              if (that.get("mulitipleSubc") && $("input[name=r_subc]:checked").length === 0) {
                                                                                                                  navigator.notification.alert("Please select a subscription",
                                                                                                                                               function() {
                                                                                                                                               }, "Multiple Subscriptions", 'OK');
                                                                                                                  return;
                                                                                                              }
                                                                                                              else {
                                                                                                                  if (obj.target.innerText === "Renew" || obj.target.id === "MI_Rbutton") {
                                                                                                                      if (Customer.getSubscription(selSubcrID).DoRenew) {
                                                                                                                          MobileApp.navigate('#v_renew');
                                                                                                                      }
                                                                                                                      else {
                                                                                                                          navigator.notification.alert("Renewal option is not available for your current subscription status",
                                                                                                                                                       function() {
                                                                                                                                                       }, "Option not available", 'OK');
                                                                                                                          return;
                                                                                                                      }
                                                                                                                  }
                                                                                                                  else if (obj.target.innerText === "Upgrade" || obj.target.id === "MI_Ubutton") {
                                                                                                                      if (Customer.getSubscription(selSubcrID).DoUpgrade) {
                                                                                                                          MobileApp.navigate('#v_upgrade');
                                                                                                                      }
                                                                                                                      else {
                                                                                                                          navigator.notification.alert("Upgrade option is not available for your current subscription status",
                                                                                                                                                       function() {
                                                                                                                                                       }, "Option not available", 'OK');
                                                                                                                          return;
                                                                                                                      }
                                                                                                                  }
                                                                                                                  else if (obj.target.innerText === "Renew & Upgrade" || obj.target.id === "MI_RUbutton") {
                                                                                                                      if (Customer.getSubscription(selSubcrID).DoRUpgrade) {
                                                                                                                          MobileApp.navigate('#v_rUpgrade');
                                                                                                                      }
                                                                                                                      else {
                                                                                                                          navigator.notification.alert("Renewal & Upgrade option is not available for your current subscription status",
                                                                                                                                                       function() {
                                                                                                                                                       }, "Option not available", 'OK');
                                                                                                                          return;
                                                                                                                      }
                                                                                                                  }
                                                                                                              }
                                                                                                          },
                                                                                                          onLogOut: function(e) {
                                                                                                              doLogOut = true;

                                                                                                              var argsl = {
                                                                                                                  data: DeviceInfo
                                                                                                              };
                                                                                                              var jsonArgsl = JSON.stringify(argsl);
                                                                                                              Type = "POST";
                                                                                                              Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/UnRegisterDevice";
                                                                                                              Data = jsonArgsl;
                                                                                                              FunctionName = 'UnRegisterDevice';
                                                                                                              $.when(CallService()).done(function(a1) {
                                                                                                                  MobileApp.navigate('#v_login');
                                                                                                              });
                                                                                                          }
                                                                                                      });

                                                                   mySubcModel.LoadDetails();

                                                                   if (typeof(e.view.id) === 'undefined') {
                                                                       kendo.bind($("#gn_menu"), mySubcModel);
                                                                   }
                                                                   else {
                                                                       kendo.bind($(e.view.id), mySubcModel);
                                                                       var scroller = e.view.scroller;
                                                                       if (typeof(scroller) !== 'undefined')
                                                                           scroller.reset();
                                                                   }
                                                               },
                                                               Profile: function(e) {
                                                                   var myCustModel = kendo.observable({
                                                                                                          email: "",
                                                                                                          mobile: "",
                                                                                                          updateSuccess:false,
                                                                                                          customerName:"",                                                                                                         
                                                                                                          onSubmit:function(e) {
                                                                                                              var that = this,
                                                                                                                  email = that.get("email").trim(),
                                                                                                                  mobile = that.get("mobile").trim();
                                                                                                              
                                                                                                              MobileApp.showLoading();
                                                                                                              if (email==="" || mobile==="") {
                                                                                                                  MobileApp.hideLoading();
                                                                                                                  navigator.notification.alert("Please provide all the required information",
                                                                                                                                               function() {
                                                                                                                                               }, "Information required", 'OK');
                                                                                                                  return;
                                                                                                              }  
                                                                                                              
                                                                                                              if (profilevalidator.validate()) {
                                                                                                                  DeviceInfo.Email = email;
                                                                                                                  DeviceInfo.Mobile = mobile;

                                                                                                                  var argsp = {
                                                                                                                      data: DeviceInfo
                                                                                                                  };
                                                                                                                    
                                                                                                                  var jsonArgsp = JSON.stringify(argsp);

                                                                                                                  Type = "POST";
                                                                                                                  Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/UpdateProfile";
                                                                                                                  Data = jsonArgsp;
                                                                                                                  FunctionName = 'UpdateProfile';
                                                                                                                   
                                                                                                                  $.when(CallService()).done(function(a1) {
                                                                                                                      that.set("updateSuccess", isPUpdateSucess);
                                                                                                                      MobileApp.hideLoading();
                                                                                                                      if (isPUpdateSucess) {
                                                                                                                          Customer.Email = email;
                                                                                                                          Customer.Mobile = mobile;
                                                                                                                          navigator.notification.alert("Your profile has been updated successfully",
                                                                                                                                                       function() {
                                                                                                                                                       }, "Update Successfull", 'OK');
                                                                                                                      }
                                                                                                                      else {
                                                                                                                          navigator.notification.alert("There was an error while updating your profile",
                                                                                                                                                       function() {
                                                                                                                                                       }, "Error", 'OK');
                                                                                                                      }
                                                                                                                      isPUpdateSucess = false;
                                                                                                                  });
                                                                                                              }
                                                                                                          }
                                                                                                      });
                                                                   myCustModel.set("customerName", Customer.CustomerName); 
                                                                   myCustModel.set("email", Customer.Email),
                                                                   myCustModel.set("mobile", Customer.Mobile);
                                                                   kendo.bind($('.ProfileInfo'), myCustModel);
                                                               }
                                                           });

    MyInternetViewModel = kendo.data.ObservableObject.extend({
                                                                 LoadData: function(e) {
                                                                     var myInternetModel = kendo.observable({

                                                                                                                renewPeriod: Units.Unit,
                                                                                                                upgradePeriod: Units.Unit,
                                                                                                                UMOPs:MOPs.MOP,
                                                                                                                selPeriodValue: "12 Months",
                                                                                                                selMOPValue:"4be0b662-88c7-de11-9d96-001143e7bb21",                                                                                                                
                                                                                                                tremConditions: false,
                                                                                                                currViewID: "",
                                                                                                                isNGN: function() {
                                                                                                                    if (isDataExist('Subsc')) {
                                                                                                                        return Customer.getSubscription(selSubcrID).isNGN();
                                                                                                                    }
                                                                                                                },
                                                                                                                showPeriod: function() {
                                                                                                                    var that = this;
                                                                                                                    if (that.get("currViewID") === '#v_renew') {
                                                                                                                        return Customer.getSubscription(selSubcrID).ShowRPeriods;
                                                                                                                    }
                                                                                                                    else if (that.get("currViewID") === '#v_rUpgrade') {
                                                                                                                        return Customer.getSubscription(selSubcrID).ShowRUPeriods;
                                                                                                                    }
                                                                                                                },
                                                                                                                newExpiryDt: function() {
                                                                                                                    var that = this;
                                                                                                                    var expDate = new Date();
                                                                                                                    if (isDataExist('Subsc')) {
                                                                                                                        var currStatus = Customer.getSubscription(selSubcrID).ServiceStatus;
                                                                                                                        if (currStatus === 'Expired') {
                                                                                                                            var d = new Date();
                                                                                                                            expDate = d;
                                                                                                                        }
                                                                                                                        else if (currStatus === 'Active') {
                                                                                                                            expDate = new Date(Customer.getSubscription(selSubcrID).ExpiryDate);
                                                                                                                        }
                                                                                                                    }
                                                                                                                    if (that.get("currViewID") !== '#v_upgrade') {
                                                                                                                        var dropDownListValue = that.get("selPeriodValue");
                                                                                                                        expDate = createExpDate(expDate, dropDownListValue);
                                                                                                                    }
                                                                                                                    return kendo.toString(kendo.parseDate(expDate), 'MMM dd, yyyy');
                                                                                                                },
                                                                                                                onChangePeriod: function() {
                                                                                                                    var that = this;
                                                                                                                    MobileApp.showLoading();
                                                                                                                    that.newExpiryDt();
                                                                                                                    that.getPackages();
                                                                                                                    var dropDownListValue = that.get("selPeriodValue");
                                                                                                                    return dropDownListValue;
                                                                                                                },
                                                                                                                onChangeMOP: function() {
                                                                                                                    var that = this;                                                                                                                                                                                                                                   
                                                                                                                    var dropDownListValue = that.get("selMOPValue");                                                                                                                   
                                                                                                                    for (y = 0; y < MOPs.MOP.length; y++) {
                                                                                                                        if(MOPs.MOP[y].MOPID===dropDownListValue)                                                                                                                        
                                                                                                                        selPayMOP=MOPs.MOP[y].MOP;
                                                                                                                    }                                                                                                                    
                                                                                                                    return dropDownListValue;
                                                                                                                },
                                                                                                                UPackages: Packages.uPackagelist,                                                                                                               
                                                                                                                AmountToPay: "",
                                                                                                                InfoID: 0,
                                                                                                                onSelectPckg: function(e) {
                                                                                                                    var that = this;
                                                                                                                    var pckgid;
                                                                                                                    if (that.get("currViewID") === '#v_renew') {
                                                                                                                        pckgid = $("input[name=r_r_pckg]:checked").val();
                                                                                                                    }
                                                                                                                    else if (that.get("currViewID") === '#v_upgrade') {
                                                                                                                        pckgid = $("input[name=r_u_pckg]:checked").val();
                                                                                                                    }
                                                                                                                    else if (that.get("currViewID") === '#v_rUpgrade') {
                                                                                                                        pckgid = $("input[name=r_ru_pckg]:checked").val();
                                                                                                                    }
                                                                                                                    selectedPckg.set("FRenewalAmnt", Packages.getUPackage(pckgid).FRenewalAmnt);
                                                                                                                    selectedPckg.set("PriceID", Packages.getUPackage(pckgid).PriceID);
                                                                                                                    selectedPckg.set("PackageID", Packages.getUPackage(pckgid).PackageID);
                                                                                                                    selectedPckg.set("PackageName", Packages.getUPackage(pckgid).PackageName);
                                                                                                                    selectedPckg.set("TotalAmount", Packages.getUPackage(pckgid).TotalAmount);
                                                                                                                    selectedPckg.set("UMOID", Packages.getUPackage(pckgid).UMOID);
                                                                                                                    selectedPckg.set("UMO", Packages.getUPackage(pckgid).UMO);
                                                                                                                    
                                                                                                                    that.set("AmountToPay", kendo.toString(Packages.getUPackage(pckgid).TotalAmount, '0.000') + " KD");
                                                                                                                },
                                                                                                                getPackages: function(e) {
                                                                                                                    var that = this;
                                                                                                                    var optype = 0;
                                                                                                                    
                                                                                                                    Type = "GET";
                                                                                                                    Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetMOPs";
                                                                                                                    Data = null;
                                                                                                                    FunctionName = 'GetMOPs';
                                                                                                                    //console.log('isDataExist MOPs');
                                                                                                                    if (!isDataExist('MOPs')) {
                                                                                                                         $.when(clearData(FunctionName), CallService()).done(function(a3) {                                                                                                                        
                                                                                                                        selPayMOP="K-net";

                                                                                                                    if (isDataExist('Subsc')) {
                                                                                                                        var serviceType = Customer.getSubscription(selSubcrID).ServiceType;
                                                                                                                        var srvStatus = Customer.getSubscription(selSubcrID).ServiceStatus;
                                                                                                                        //Take the package id and pass to GetUnits webservice to retrive data as per the package (unlimited pckg issue)
                                                                                                                        optype = getOperationType(that.get("currViewID"), srvStatus);

                                                                                                                        Type = "POST";
                                                                                                                        Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetUnits";
                                                                                                                        Data = '{"serviceType": "' + serviceType + '","operationType": "' + optype + '","productName": "' + Customer.getSubscription(selSubcrID).PackageName + '","showAll":"false"}';
                                                                                                                        FunctionName = 'GetUnits';

                                                                                                                        $.when(clearData(FunctionName), CallService()).done(function(a1) {
                                                                                                                            //Upgrade  0,Future Renewal  1,Future Renewal Upgrade  2,Renewal 3,Renewal Upgrade  4
                                                                                                                            //if (that.get("currViewID") === '#v_renew') {
                                                                                                                            //FunctionName = 'GetPackagesByServiceID';
                                                                                                                            //}
                                                                                                                            //else 
                                                                                                                            FunctionName = 'GetUPackagesByServiceID';
                                                                                                                            
                                                                                                                            Type = "POST";
                                                                                                                            Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetPackagesByServiceID";
                                                                                                                            Data = '{"serviceID": "{' + Customer.getSubscription(selSubcrID).ServiceID + '}","operationType": "' + optype + '", "unit": "' + that.get("selPeriodValue") + '"}';

                                                                                                                            $.when(clearData(FunctionName), CallService()).done(function(a2) {
                                                                                                                                if (isDataExist('UPackages')) {
                                                                                                                                    that.set("UPackages", Packages.uPackagelist);
                                                                                                                                    if (optype === 3 || optype === 1) { //Renewal - Future Renewal
                                                                                                                                        kendo.bind($('#RContent'), myInternetModel);
                                                                                                                                    }
                                                                                                                                    else if (optype === 0) { // Upgrade
                                                                                                                                        kendo.bind($('#UpgContent'), myInternetModel);
                                                                                                                                    }
                                                                                                                                    else if (optype === 2 || optype === 4) { //Future Renewal Upgrade - Renewal Upgrade  4
                                                                                                                                        kendo.bind($('#RUpgContent'), myInternetModel);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                MobileApp.hideLoading();                                                                                                                                
                                                                                                                            });
                                                                                                                        });
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                    }
                                                                                                                            });
                                                                                                                    }
                                                                                                                },
                                                                                                                onAgreeC: function() {
                                                                                                                    var that = this;
                                                                                                                    var tremConditions = that.get("tremConditions");
                                                                                                                    return tremConditions;
                                                                                                                },
                                                                                                                onBuy: function() {
                                                                                                                    var that = this;

                                                                                                                    if (!isOnline()) {
                                                                                                                        MobileApp.hideLoading();
                                                                                                                        navigator.notification.alert("No network connection available. Please try again when online.",
                                                                                                                                                     function() {
                                                                                                                                                     }, "No Internet Connetction", 'OK');
                                                                                                                        return;
                                                                                                                    }

                                                                                                                    var srvStatus = Customer.getSubscription(selSubcrID).ServiceStatus;
                                                                                                                    var optype = getOperationType(that.get("currViewID"), srvStatus);

                                                                                                                    //Upgrade  0,Future Renewal  1,Future Renewal Upgrade  2,Renewal 3,Renewal Upgrade  4

                                                                                                                    //if (optype === 0 || optype === 2 || optype === 4) {
                                                                                                                    var selPackg = 0;
                                                                                                                    if (that.get("currViewID") === '#v_renew') {
                                                                                                                        selPackg = $("input[name=r_r_pckg]:checked").length;
                                                                                                                    }
                                                                                                                    else if (that.get("currViewID") === '#v_upgrade') {
                                                                                                                        selPackg = $("input[name=r_u_pckg]:checked").length;
                                                                                                                    }
                                                                                                                    else if (that.get("currViewID") === '#v_rUpgrade') {
                                                                                                                        selPackg = $("input[name=r_ru_pckg]:checked").length;
                                                                                                                    }
                                                                                                                    if (selPackg === 0) {
                                                                                                                        navigator.notification.alert("Please select a package",
                                                                                                                                                     function() {
                                                                                                                                                     }, "Select a Package", 'OK');
                                                                                                                        return;
                                                                                                                    }
                                                                                                                    //}
                                                                                                                    
                                                                                                                    //console.log('select mop='+that.get("selMOPValue"));
                                                                                                                     //console.log('select mop name='+selPayMOP);

                                                                                                                    if (myInternetModel.onAgreeC() !== true) {
                                                                                                                        navigator.notification.alert("Please select checkBox to accept terms and conditions",
                                                                                                                                                     function() {
                                                                                                                                                     }, "Terms & Conditions", 'OK');
                                                                                                                        return;
                                                                                                                    }

                                                                                                                    OrderDetails.ID = selectedPckg.PriceID;
                                                                                                                    OrderDetails.ServiceID = Customer.getSubscription(selSubcrID).ServiceID;
                                                                                                                    OrderDetails.PackageID = selectedPckg.PackageID;
                                                                                                                    OrderDetails.UnitID = selectedPckg.UMOID;
                                                                                                                    OrderDetails.Amount = selectedPckg.TotalAmount;
                                                                                                                    OrderDetails.ReferenceID = "";
                                                                                                                    OrderDetails.PaymentType = "";
                                                                                                                    OrderDetails.FailureType = "";
                                                                                                                    OrderDetails.PayTraID = "";                                                                                                                    
                                                                                                                    OrderDetails.ReferenceID = "";
                                                                                                                    OrderDetails.PayTraID = "";
                                                                                                                    OrderDetails.Result = "";
                                                                                                                    OrderDetails.PaymentID = "";
                                                                                                                    OrderDetails.Auth = "";
                                                                                                                    OrderDetails.Trackid = "";                                                                                                                    
                                                                                                                    OrderDetails.PackageName = selectedPckg.PackageName;
                                                                                                                    OrderDetails.OperationType = optype;
                                                                                                                    OrderDetails.ExpiryDate = new Date(myInternetModel.newExpiryDt());
                                                                                                                    OrderDetails.DeviceName = deviceName;
                                                                                                                    OrderDetails.DeviceId = deviceId;
                                                                                                                    OrderDetails.DeviceOs = deviceOs;
                                                                                                                    OrderDetails.DeviceOsVersion = deviceOsVersion;
                                                                                                                    OrderDetails.DevicePID = Customer.getSubscription(selSubcrID).DSLNumber + randomString(10, '');
                                                                                                                    OrderDetails.CivilID = Customer.CivilID;
                                                                                                                    OrderDetails.DslNumber = Customer.getSubscription(selSubcrID).DSLNumber;
                                                                                                                    OrderDetails.Email = "";
                                                                                                                    /*OrderDetails.UMO = selectedPckg.UMO;*/
                                                                                                                    OrderDetails.MOPID = that.get("selMOPValue");

                                                                                                                    MobileApp.navigate('#v_kpay');
                                                                                                                }
                                                                                                            })
                                                                     MobileApp.showLoading();

                                                                     if (!isOnline()) {
                                                                         MobileApp.hideLoading();
                                                                         navigator.notification.alert("No network connection available. Please try again when online.",
                                                                                                      function() {
                                                                                                      }, "No Internet Connetction", 'OK');
                                                                         return;
                                                                     }
                                                                     myInternetModel.set("currViewID", e.view.id);
                                                                     myInternetModel.getPackages(e);
                                                                     
                                                                     if (typeof(e.view.id) !== 'undefined') {
                                                                         var scroller = e.view.scroller;
                                                                         if (typeof(scroller) !== 'undefined')
                                                                             scroller.reset();
                                                                     } 
                                                                 },
                                                                 PaymentSubmit: function(e) {      
                                                                     //console.log('PaymentSubmit..');
                                                                     var kpurl="";
                                                                     
                                                                     Type = "GET";
                                                                     Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetPayUrl";
                                                                     Data = null;
                                                                     FunctionName = 'GetPayUrl';
                                                                     
                                                                     $.when(CallService()).done(function(a5) {
                                                                                  kpurl=GNPayUrl; 
                                                                         
                                                                     var oldPrototype = Date.prototype.toJSON;
                                                                     var selmopnm=escape(selPayMOP);
                                                                    
                                                                     Date.prototype.toJSON = function(key) {
                                                                         return "\/Date(" + (this.getTime()) + ")\/";
                                                                     }
                                                                     var args = {
                                                                         order: OrderDetails
                                                                     };
                                                                     var jsonArgs = JSON.stringify(args);
                                                                     //console.log(jsonArgs);
                                                                     Date.prototype.toJSON = oldPrototype; // reverting to the old one                                                                    

                                                                     if (!isOnline()) {
                                                                         MobileApp.hideLoading();
                                                                         navigator.notification.alert("No network connection available. Please try again when online.",
                                                                                                      function() {
                                                                                                      }, "No Internet Connetction", 'OK');
                                                                         return;
                                                                     }

                                                                     Type = "POST";
                                                                     Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/PostPayment";
                                                                     Data = jsonArgs;
                                                                    
                                                                     FunctionName = 'PrePayment';
                                                                     $.when(CallService()).done(function(a1) {
                                                                         if (isPrePSucess === true) {
                                                                             MobileApp.hideLoading();
                                                                             kpurl += "?Price=" + OrderDetails.Amount + "&TransType=" + OrderDetails.OperationType + "&dsl=" + Customer.getSubscription(selSubcrID).DSLNumber + "&speed=" + escape(OrderDetails.PackageName)+ "&mop=" + selmopnm;
                                                                             $("#ifKpay").attr("src", kpurl);
                                                                         }
                                                                         else {
                                                                             //console.log('at else PrePayment');
                                                                             $("#ifKpay").attr("src", "about:blank");
                                                                             MobileApp.navigate('#:back');
                                                                             MobileApp.hideLoading();
                                                                             navigator.notification.alert("There was an error while processing your data.",
                                                                                                          function() {
                                                                                                          }, "Error", 'OK');
                                                                             return;
                                                                         }
                                                                     });
                                                                         
                                                                     });

                                                                     if (typeof(e) !== 'undefined') {
                                                                         if (typeof(e.view.id) !== 'undefined') {
                                                                             var scroller = e.view.scroller;
                                                                             if (typeof(scroller) !== 'undefined')
                                                                                 scroller.reset();
                                                                         }
                                                                     }
                                                                 }
                                                             });

    OrderDataViewModel = kendo.data.ObservableObject.extend({
                                                                email: "",
                                                                sendMail: false,
                                                                onSendMail: function(e) {
                                                                    var that = this;
                                                                    if (emailvalidator.validate()) {
                                                                        OrderDetails.Email = that.get("email");
                                                                        var oldPrototype = Date.prototype.toJSON;
                                                                        Date.prototype.toJSON = function(key) {
                                                                            return "\/Date(" + (this.getTime()) + ")\/";
                                                                        }
                                                                        var args = {
                                                                            order: OrderDetails
                                                                        };
                                                                        var jsonArgs = JSON.stringify(args);
                                                                        Date.prototype.toJSON = oldPrototype; // reverting to the old one                                                                    

                                                                        Type = "POST";
                                                                        Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/SendEmail";
                                                                        Data = jsonArgs;

                                                                       
                                                                        FunctionName = 'SendEmail';
                                                                        $.when(CallService()).done(function(a1) {
                                                                            if (typeof(e) !== 'undefined') {
                                                                                e.preventDefault();
                                                                            }
                                                                            setTimeout(function() {
                                                                                $("#modalview-OrdInfo").data("kendoMobileModalView").close();
                                                                            }, 200);
                                                                        });
                                                                    }
                                                                },
                                                                LoadData: function(e) {
                                                                    if ((isDataExist('Subsc')) && (isDataExist('OrderD'))) {
                                                                        var orderInfo = kendo.observable({
                                                                                                             DSL: Customer.getSubscription(selSubcrID).DSLNumber,
                                                                                                             Amount: kendo.toString(OrderDetails.Amount, '0.000') + "KD",
                                                                                                             PaymentID: OrderDetails.PaymentID,
                                                                                                             PostDate: kendo.toString(kendo.parseDate(new Date()), 'dd/MMM/yyyy'),
                                                                                                             ResultCode: OrderDetails.Result,
                                                                                                             TransactionID: OrderDetails.PayTraID,
                                                                                                             Auth: OrderDetails.Auth,
                                                                                                             TrackID: OrderDetails.Trackid,
                                                                                                             RefNo: OrderDetails.ReferenceID,
                                                                                                             isKNETDone: isKNETSucess
                                                                                                         });
                                                                        kendo.bind($(".OrderInfo"), orderInfo);
                                                                    }
                                                                    if (typeof(e) !== 'undefined') {
                                                                        if (typeof(e.view.id) !== 'undefined') {
                                                                            var scroller = e.view.scroller;
                                                                            if (typeof(scroller) !== 'undefined')
                                                                                scroller.reset();
                                                                        }
                                                                    }
                                                                }
                                                            });

    PackagesViewModel = kendo.data.ObservableObject.extend({
                                                               LoadData: function(e) {
                                                                   var pckModel = kendo.observable({
                                                                                                       Periods: Units.Unit,
                                                                                                       Packagelist1: Packages.Packagelist1,
                                                                                                       Packagelist3: Packages.Packagelist3,
                                                                                                       Packagelist6: Packages.Packagelist6,
                                                                                                       Packagelist12: Packages.Packagelist12,
                                                                                                       NGNPackagelist1: Packages.NGNPackagelist1,
                                                                                                       NGNPackagelist3: Packages.NGNPackagelist3,
                                                                                                       NGNPackagelist6: Packages.NGNPackagelist6,
                                                                                                       NGNPackagelist12: Packages.NGNPackagelist12,
                                                                                                       selPValue: "0",

                                                                                                       onSelectPeriod: function(e) {
                                                                                                           pckModel.ShowPckg();
                                                                                                       },
                                                                                                       onSelectSType: function(e) {
                                                                                                           var that = this;
                                                                                                           that.set("selPValue", "0");
                                                                                                           pckModel.LoadInfo();
                                                                                                       },
                                                                                                       ShowPckg: function(e) {
                                                                                                           var that = this;

                                                                                                           var listviews_dsl = $('ul.PackageUL');
                                                                                                           var listviews_ngn = $('ul.NGNPackageUL');

                                                                                                           var selectedP = that.get("selPValue");
                                                                                                           var serviceType = $("#pckgtype").data("kendoMobileButtonGroup").current().index();

                                                                                                           if (serviceType === 0) { //DSL
                                                                                                               listviews_dsl.hide()
                                                                                                                   .eq(selectedP)
                                                                                                                   .show();
                                                                                                               listviews_ngn.hide();
                                                                                                           }
                                                                                                           else { //NGN
                                                                                                               listviews_ngn.hide()
                                                                                                                   .eq(selectedP)
                                                                                                                   .show();
                                                                                                               listviews_dsl.hide();
                                                                                                           }
                                                                                                       },
                                                                                                       LoadInfo: function(e) {
                                                                                                           var that = this;
                                                                                                           MobileApp.showLoading();
                                                                                                           var serviceType = $("#pckgtype").data("kendoMobileButtonGroup").current().index();

                                                                                                           if (serviceType === 0) {
                                                                                                               serviceType = 'DSL';
                                                                                                           }
                                                                                                           else {
                                                                                                               serviceType = 'NGN';
                                                                                                           }
                                                                                                           Type = "POST";
                                                                                                           Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetUnits";
                                                                                                           Data = '{"serviceType": "' + serviceType + '","operationType": "0","productName":"","showAll":"true"}';
                                                                                                           FunctionName = 'GetUnits';

                                                                                                           $.when(clearData(FunctionName), CallService()).done(function(a1) {
                                                                                                               that.set("Periods", Units.Unit);

                                                                                                               Type = "GET";
                                                                                                               Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetPackagesForNewCustomer";
                                                                                                               Data = null;
                                                                                                               FunctionName = 'GetPackages';
                                                                                                               if (!isDataExist('Packages')) {
                                                                                                                   $.when(CallService()).done(function(a1) {
                                                                                                                       that.set("Packagelist1", Packages.Packagelist1);
                                                                                                                       that.set("Packagelist3", Packages.Packagelist3);
                                                                                                                       that.set("Packagelist6", Packages.Packagelist6);
                                                                                                                       that.set("Packagelist12", Packages.Packagelist12);
                                                                                                                       that.set("NGNPackagelist1", Packages.NGNPackagelist1);
                                                                                                                       that.set("NGNPackagelist3", Packages.NGNPackagelist3);
                                                                                                                       that.set("NGNPackagelist6", Packages.NGNPackagelist6);
                                                                                                                       that.set("NGNPackagelist12", Packages.NGNPackagelist12);
                                                                                                                       pckModel.ShowPckg();
                                                                                                                       MobileApp.hideLoading();
                                                                                                                   });
                                                                                                               }
                                                                                                               else {
                                                                                                                   pckModel.ShowPckg();
                                                                                                                   MobileApp.hideLoading();
                                                                                                               }
                                                                                                           });
                                                                                                       }

                                                                                                   });

                                                                   pckModel.LoadInfo();
                                                                   kendo.bind(e.view.id, pckModel);

                                                                   if (!isOnline()) {
                                                                       MobileApp.hideLoading();
                                                                       navigator.notification.alert("No network connection available. Please try again when online.",
                                                                                                    function() {
                                                                                                    }, "No Internet Connetction", 'OK');
                                                                       return;
                                                                   }

                                                                   if (typeof(e) !== 'undefined') {
                                                                       if (typeof(e.view.id) !== 'undefined') {
                                                                           var scroller = e.view.scroller;
                                                                           if (typeof(scroller) !== 'undefined')
                                                                               scroller.reset();
                                                                       }
                                                                   }
                                                               },
                                                               setData: function(e) {
                                                               }
                                                           });

    LocationsViewModel = kendo.data.ObservableObject.extend({
                                                                LoadData: function(e) {
                                                                    var locModel = kendo.observable({
                                                                                                        locations: [],
                                                                                                        location_urls: [],
                                                                                                        selLoc: 0,
                                                                                                        openExtLoc: function() {
                                                                                                            var that = this;
                                                                                                            var url = that.get("location_urls")[that.get("selLoc")];
                                                                                                            if (device.platform !== 'iOS') {
                                                                                                                navigator.app.loadUrl(url, { openExternal:true });
                                                                                                            }
                                                                                                            else {
                                                                                                                window.open(url, '_system');
                                                                                                            }
                                                                                                        },
                                                                                                        address: function() {
                                                                                                            var that = this;
                                                                                                            var loc = that.get("locations")[that.get("selLoc")];
                                                                                                            if ((typeof(loc) !== 'undefined')) {
                                                                                                                return loc.ContentString.replace(/<br>/gi, ", ");
                                                                                                            }
                                                                                                            return "";
                                                                                                        },
                                                                                                        onChangeLocation: function() {
                                                                                                            locModel.LoadMap();
                                                                                                        },
                                                                                                        LoadMap: function() {
                                                                                                            var that = this;
                                                                                                            var loc = that.get("locations")[that.get("selLoc")];
                                                                                                            var myLatlng = new google.maps.LatLng(loc.Latitude, loc.Longitude);
                                                                                                            var myOptions = {
                                                                                                                center: myLatlng,
                                                                                                                zoom: 13,
                                                                                                                mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                                                            };

                                                                                                            var mapElement = $("#map_canvas");

                                                                                                            var map = new google.maps.Map(mapElement[0], myOptions);
                                                                                                            var contentString = loc.ContentString;

                                                                                                            var infowindow = new google.maps.InfoWindow({
                                                                                                                                                            content: contentString,
                                                                                                                                                            maxWidth: "150"
                                                                                                                                                        });

                                                                                                            var marker = new google.maps.Marker({
                                                                                                                                                    position: myLatlng,
                                                                                                                                                    map: map,
                                                                                                                                                    title: loc.Title
                                                                                                                                                });

                                                                                                            google.maps.event.addListener(marker, 'mousedown', function() {
                                                                                                                infowindow.open(map, marker);
                                                                                                                // $("loc-ext").attr('href', that.get("location_urls")[that.get("selLoc")]);
                                                                                                            });
                                                                                                        },
                                                                                                        LoadInfo: function() {
                                                                                                            var that = this;
                                                                                                            MobileApp.showLoading();

                                                                                                            $.ajax({
                                                                                                                       type: "GET", //GET or POST or PUT or DELETE verb
                                                                                                                       url: "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetLocations", // Location of the service
                                                                                                                       data: null, //Data sent to server
                                                                                                                       contentType: ContentType, // content type sent to server
                                                                                                                       dataType: DataType, //Expected data format from server
                                                                                                                       processdata: ProcessData, //True or False   
                                                                                                                       cache: true,
                                                                                                                       success: function(result) { //On Successfull service call
                                                                                                                           MobileApp.hideLoading();
                                                                                                                           var dataSource = [];
                                                                                                                           var urlSource = [];
                                                                                                                           $.each(result, function(k, v) {
                                                                                                                               dataSource.push({
                                                                                                                                                   "Id": k,
                                                                                                                                                   "Latitude": v.Latitude,
                                                                                                                                                   "Longitude": v.Longitude,
                                                                                                                                                   "Title": v.Title,
                                                                                                                                                   "ContentString": v.ContentString
                                                                                                                                               });
                                                                                                                               urlSource.push(
                                                                                                                                   "http://maps.google.com/?f=d&daddr=" + v.Latitude + "," + v.Longitude
                                                                                                                                   );
                                                                                                                           });

                                                                                                                           that.set("location_urls", urlSource);
                                                                                                                           that.set("locations", dataSource);
                                                                                                                           locModel.LoadMap();
                                                                                                                       }
                                                                                                                   });
                                                                                                        }
                                                                                                    });

                                                                    locModel.LoadInfo();

                                                                    kendo.bind(e.view.id, locModel);
                                                                }
                                                            });

    InfoViewModel = kendo.data.ObservableObject.extend({
                                                            LoadData: function(e) {
                                                                 var infoModel = kendo.observable({
                                                                       sendInq: false,
                                                                       Msg: '',
                                                                       DSL:'',
                                                                       CustNm:'',
                                                                       onSendInq: function() {
                                                                           var that = this;                                                                             
                                                                           
                                                                           if (that.get("CustNm")==='') {                                                                              
                                                                               navigator.notification.alert("Kindly fill your customer name and DSL number if available",
                                                                                                    function() {
                                                                                                    }, "Enter Customer Name", 'OK');
                                                                               return;
                                                                           }
                                                                           Type = "GET";
                                                                           Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/GetSupportEmail";
                                                                           Data = null;
                                                                           FunctionName = 'GetSupportEmail';
                                                                     
                                                                           $.when(CallService()).done(function(a5) {                                                                               
                                                                         
                                                                           
                                                                               var sLink = "mailto:"+CEmail+"?subject=Gulfnet Mobile App Inquiry (Customer Name: "+that.get("CustNm")+" , DSL: "+ that.get("DSL") + ")&body=" + that.get("Msg");
                                                                               window.location.href = sLink;
                                                                          });
                                                                       },
                                                                       LoadInfo: function(){
                                                                            var that = this;
                                                                            if (Customer.Subscriptions.length === 1) {
                                                                                that.set("CustNm", Customer.CustomerName);
                                                                                that.set("DSL", Customer.getSubscription(selSubcrID).DSLNumber);
                                                                            }
                                                                            
                                                                       }
                                                                       
                                                            });
            
                                                            infoModel.LoadInfo();
                                                            kendo.bind(e.view.id, infoModel);
                                                            if (typeof(e) !== 'undefined') {
                                                                if (typeof(e.view.id) !== 'undefined') {
                                                                      var scroller = e.view.scroller;
                                                                      if (typeof(scroller) !== 'undefined')
                                                                         scroller.reset();
                                                                      }
                                                                }
                                                            }        
                                                           
                                                       });

    app.login = {
        viewmodel: new LoginViewModel()
    };
    app.package = {
        viewmodel: new PackagesViewModel()
    };
    app.general = {
        viewmodel: new UserDataViewModel()
    };
    app.myinternet = {
        viewmodel: new MyInternetViewModel()
    };
    app.order = {
        viewmodel: new OrderDataViewModel()
    };
    app.location = {
        viewmodel: new LocationsViewModel()
    };
    app.info = {
        viewmodel: new InfoViewModel()
    };
})(window);