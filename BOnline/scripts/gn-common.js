var Type;
var Url;
var Data;
var ContentType = "application/json; charset=utf-8";
var DataType = "json";
var ProcessData = true;
var FunctionName;
var IsvalidUser = false;
var doLogOut = false;
var showMyInternet = false;
var selSubcrID = 0;
var selPayMOP="K-net";
//statusBarStyle: "black-translucent",
var MobileApp = new kendo.mobile.Application(document.body, {
                                                 layout: "l_login",                                                
                                                statusBarStyle: "hidden",
                                                 initial: "#v_login"
                                             });
var isKNETSucess = false;
var isPrePSucess = false;
var isPostPSucess = false;
var isRegistered = true;
var isPUpdateSucess=false;

var infoPackId = 0;
var deviceName;
var deviceId;
var deviceOs;
var deviceOsVersion;

var DeviceInfo = {};
var loginvalidator;
var emailvalidator;
var profilevalidator;
var selDSLNumber='';
var GNPayUrl;
var CEmail;



$(document).ready(function() {
    loginvalidator = $("#v_login").kendoValidator().data("kendoValidator");
    emailvalidator = $("#modalview-OrdInfo").kendoValidator().data("kendoValidator");
    profilevalidator=$("#v_profile").kendoValidator().data("kendoValidator");
});

// Define a Subscription model.
var Subscription = kendo.data.Model.define({
                                               fields: {
        "ServiceID": {
                                                           type: "string"
                                                       },
        "DSLNumber": {
                                                           type: "number"
                                                       },
        "ServiceStatus": {
                                                           type: "string"
                                                       },
        "ServiceType": {
                                                           type: "string"
                                                       },
        "ExpiryDate": {
                                                           type: "date"
                                                       },
        "PackageID": {
                                                           type: "string"
                                                       },
        "PackageName": {
                                                           type: "string"
                                                       },
        "ProductBandwidth": {
                                                           type: "string"
                                                       },
        "Amount": {
                                                           type: "number"
                                                       },
        "UMOID": {
                                                           type: "string"
                                                       },
        "UMO": {
                                                           type: "string"
                                                       },
        "ActiveOrder": {
                                                           type: "boolean"
                                                       },
        "ID": {
                                                           type: "number"
                                                       },
        "Selected": {
                                                           type: "boolean"
                                                       },
        "SelectedSubc": {
                                                           type: "number"
                                                       },
        "DoUpgrade": {
                                                           type: "boolean"
                                                       },
        "DoRenew": {
                                                           type: "boolean"
                                                       },
        "DoRUpgrade": {
                                                           type: "boolean"
                                                       },
        "ShowRPeriods": {
                                                           type: "boolean"
                                                       },
        "ShowRUPeriods": {
                                                           type: "boolean"
                                                       },
        "LoginAllowed": {
                                                           type: "boolean"
                                                       }
    },

                                               AmountKWD: function() {
                                                   return this.get("Amount") + " KD";
                                               },
                                               Package: function() {
                                                   return this.get("PackageName").replace("Mbps", " Mbps");
                                               },
                                               ExpiryDatef: function() {
                                                   return kendo.toString(kendo.parseDate(this.get("ExpiryDate")), 'dd/MMM/yyyy');
                                               },
                                               ServiceStatusf: function() {
                                                   return " (" + this.get("ServiceStatus") + ") ";
                                               },
                                               isNGN: function() {
                                                   if (this.get("ServiceType") === "NGN")
                                                       return true;
                                                   else
                                                       return false;
                                               }
                                           });

// Define a package model.
var Package = kendo.data.Model.define({
                                          fields: {
        "PriceID": {
                                                      type: "string"
                                                  },
        "PackageID": {
                                                      type: "string"
                                                  },
        "PackageName": {
                                                      type: "string"
                                                  },
        "Amount": {
                                                      type: "number"
                                                  },
        "UMOID": {
                                                      type: "string"
                                                  },
        "UMO": {
                                                      type: "string"
                                                  },
        "FRenewalAmnt": {
                                                      type: "number"
                                                  },
        "TotalAmount": {
                                                      type: "number"
                                                  },
        "UpgradeAmount": {
                                                      type: "number"
                                                  },
        "ServiceType": {
                                                      type: "string"
                                                  },
        "ID": {
                                                      type: "number"
                                                  },
    },
                                          AmountKWD: function() {
                                              return this.get("Amount") + " KD";
                                          },
                                          TotalAmountf: function() {
                                              return kendo.toString(this.get("TotalAmount"), '0.000');
                                          },
                                          Package: function() {
                                              return this.get("PackageName").replace("Mbps", " Mbps");
                                          },
                                          FRenewalAmntKWD: function() {
                                              return this.get("FRenewalAmnt") + " KD";
                                          },
                                          isNGN: function() {
                                              if (this.get("ServiceType") === "NGN")
                                                  return true;
                                              else
                                                  return false;
                                          }
                                      });

//Define unit
var Unit = kendo.data.Model.define({
                                       fields: {
        "UMOID": {
                                                   type: "string"
                                               },
        "UMO": {
                                                   type: "string"
                                               },
        "DisplayName": {
                                                   type: "string"
                                               },
        "SEQ": {
                                                   type: "number"
                                               }
    }
                                   });

var MOP = kendo.data.Model.define({
                                       fields: {
        "MOPID": {
                                                   type: "string"
                                               },
        "MOP": {
                                                   type: "string"
                                               },
        "DisplayName": {
                                                   type: "string"
                                               }
    }
                                   });

var Customer = kendo.observable({
                                    CivilID: "",
                                    CustomerID: "",
                                    CustomerName: "",
                                    Area: "",
    							    Email:"",
    								Mobile:"",
                                    Subscriptions: [],
                                    NoOfSubsc: function() {
                                        return this.Subscriptions.length;
                                    },
                                    getSubscription: function(id) {
                                        var subc = new Subscription();
                                        subc = Customer.Subscriptions[id];
                                        return subc;
                                    }

                                });

var Packages = kendo.observable({
                                    Packagelist1: [],
                                    Packagelist3: [],
                                    Packagelist6: [],
                                    Packagelist12: [],
                                    NGNPackagelist1: [],
                                    NGNPackagelist3: [],
                                    NGNPackagelist6: [],
                                    NGNPackagelist12: [],
                                    uPackagelist: [],
                                    getUPackage: function(id) {
                                        var pckg = new Package();
                                        pckg = Packages.uPackagelist[id];
                                        return pckg;
                                    }
                                });

var PackagesNGN = kendo.observable({
                                       Packagelist1: [],
                                       Packagelist3: [],
                                       Packagelist6: [],
                                       Packagelist12: [],
                                       uPackagelist: [],
                                       uPackagelistGrp: []
                                   });

var selectedPckg = kendo.observable({
                                        FRenewalAmnt: 0,
                                        PriceID: "",
                                        PackageID: "",
                                        PackageName: "",
                                        TotalAmount: 0,
                                        UpgradeAmount: 0,
                                        UMOID: "",
                                        UMO: "",
                                        FRenewalAmntKWD: function() {
                                            return this.get("FRenewalAmnt") + " KD";
                                        }
                                    });

var Units = kendo.observable({
                                 Unit: []
                             });
var MOPs = kendo.observable({
                                 MOP: []
                             });

var OrderDetails = {};

//function to call WCF  Service       

function CallService() {
    return $.ajax({
                      type: Type, //GET or POST or PUT or DELETE verb
                      url: Url, // Location of the service
                      data: Data, //Data sent to server
                      contentType: ContentType, // content type sent to server
                      dataType: DataType, //Expected data format from server
                      processdata: ProcessData, //True or False   
                      cache: false,
                      success: function(msg) { //On Successfull service call
                          ServiceSucceeded(msg);
                      },
                      /*error: ServiceFailed// When Service call fails*/
                      error: function(jqxhr, textStatus, error) {
                          ServiceFailed(jqxhr, textStatus, error);
                      }
                  });
}

function ServiceFailed(result) {
    MobileApp.hideLoading();
    alert('Service call failed');
    ////console.log(result);
    //alert(result);
    Type = null;
    varUrl = null;
    Data = null;
    ContentType = null;
    DataType = null;
    ProcessData = null;
}

function ServiceSucceeded(result) {   
    if (DataType === "json") {
        
        if (FunctionName === 'ConfirmOrder') {
            isKNETSucess = result;
        }
        else if (FunctionName === 'PrePayment') {
            isPrePSucess = result;
        }
        else if (FunctionName === 'PostPayment') {
            if (isDataExist('OrderD') && OrderDetails.Result === 'CAPTURED') {
                isKNETSucess = result;                
            }
            isPostPSucess = result;
        }else if(FunctionName === 'UpdateProfile'){            
            isPUpdateSucess=result;
        }
        else if (FunctionName === 'GetPayUrl') {
           GNPayUrl=result; 
            return;
        }
        else if (FunctionName === 'GetSupportEmail') {
           CEmail=result;
            
            return;
        }
        $.each(result, function(key, val) {            
            switch (FunctionName) {
                case 'GetUnits':
                    var unitx = new Unit();
                    unitx.set("UMOID", result[key].ID);
                    unitx.set("UMO", result[key].Name);
                    unitx.set("DisplayName", result[key].DisplayName);
                    unitx.set("SEQ", Units.Unit.length);
                    Units.Unit.push(unitx);                
                    break;
                case 'GetMOPs':
                //console.log('in mops col');
                    var mopx = new MOP();
                    mopx.set("MOPID", result[key].ID);
                    mopx.set("MOP", result[key].Name);
                    mopx.set("DisplayName", result[key].DisplayName);                   
                    MOPs.MOP.push(mopx);               
                    
                    break;                
                case 'GetAuthenticationByDevice':
                case 'GetAuthenticationByUserInfo':
                case 'GetServiceDetailsByCivilID':
                    isRegistered = true;
                    Customer.set("CivilID", result[key].CivilID);
                    Customer.set("CustomerID", result[key].CustomerID);
                    Customer.set("CustomerName", result[key].CustomerName);
                	Customer.set("Email", result[key].Email);
                	Customer.set("Mobile", result[key].Mobile);
                    var subsc = new Subscription();
                    subsc.set("ServiceID", result[key].ServiceID);
                    subsc.set("DSLNumber", result[key].Number);
                    subsc.set("ServiceStatus", result[key].ServiceStatus);
                    subsc.set("ExpiryDate", result[key].ExpiryDate, "dd/MMM/yyyy");
                    subsc.set("Area", result[key].Area);
                    subsc.set("PackageID", result[key].PackageID);
                    subsc.set("PackageName", result[key].PackageName);
                    subsc.set("ProductBandwidth", result[key].ProductBandwidth);
                    subsc.set("Amount", result[key].Amount);
                    subsc.set("UMOID", result[key].Umoid);
                    subsc.set("UMO", result[key].UmoidName);
                    subsc.set("ServiceType", result[key].ServiceType);
                    subsc.set("ActiveOrder", result[key].ActiveOrderExist);
                    subsc.set("ID", Customer.Subscriptions.length);
                    subsc.set("DoUpgrade", result[key].DoUpgrade);
                    subsc.set("DoRenew", result[key].DoRenewal);
                    subsc.set("DoRUpgrade", result[key].DoRUpgrade);
                    subsc.set("ShowRPeriods", result[key].ShowRPeriods);
                    subsc.set("ShowRUPeriods", result[key].ShowRUPeriods);
                    subsc.set("LoginAllowed", result[key].LoginAllowed);
                

                    Customer.Subscriptions.push(subsc);

                    break;
                case 'GetPackages':

                    var pckg = new Package();
                    pckg.set("PriceID", result[key].ID);
                    pckg.set("PackageID", result[key].PackageID);
                    pckg.set("PackageName", result[key].PackageName);
                    pckg.set("Amount", result[key].TotalAmount);
                    pckg.set("UMOID", result[key].Umoid);
                    pckg.set("UMO", result[key].UmoidName);
                    pckg.set("ServiceType", result[key].ServiceType);
                    switch (pckg.UMO) {
                        case '1 Month':
                            switch (pckg.ServiceType) {
                                case 'Both':
                                    Packages.Packagelist1.push(pckg);
                                    Packages.NGNPackagelist1.push(pckg);
                                    break
                                case 'DSL':
                                    Packages.Packagelist1.push(pckg);
                                    break;
                                case 'NGN':
                                    Packages.NGNPackagelist1.push(pckg);
                                    break;
                            }
                            break;
                        case '3 Months':
                            switch (pckg.ServiceType) {
                                case 'Both':
                                    Packages.Packagelist3.push(pckg);
                                    Packages.NGNPackagelist3.push(pckg);
                                    break
                                case 'DSL':
                                    Packages.Packagelist3.push(pckg);
                                    break;
                                case 'NGN':
                                    Packages.NGNPackagelist3.push(pckg);
                                    break;
                            }
                            break;
                        case '6 Months':
                            switch (pckg.ServiceType) {
                                case 'Both':
                                    Packages.Packagelist6.push(pckg);
                                    Packages.NGNPackagelist6.push(pckg);
                                    break
                                case 'DSL':
                                    Packages.Packagelist6.push(pckg);
                                    break;
                                case 'NGN':
                                    Packages.NGNPackagelist6.push(pckg);
                                    break;
                            }
                            break;
                        case '12 Months':
                            switch (pckg.ServiceType) {
                                case 'Both':
                                    Packages.Packagelist12.push(pckg);
                                    Packages.NGNPackagelist12.push(pckg);
                                    break
                                case 'DSL':
                                    Packages.Packagelist12.push(pckg);
                                    break;
                                case 'NGN':
                                    Packages.NGNPackagelist12.push(pckg);
                                    break;
                            }
                            break;
                    }
                    break;
                case 'GetPackagesByServiceID':
                    selectedPckg.set("PriceID", result[key].ID);
                    selectedPckg.set("PackageID", result[key].PackageID);
                    selectedPckg.set("PackageName", result[key].PackageName);
                    selectedPckg.set("UpgradeAmount", result[key].UpgradeAmount);
                    selectedPckg.set("FRenewalAmnt", result[key].FutureRenewalAmount);
                    selectedPckg.set("TotalAmount", result[key].TotalAmount);
                    selectedPckg.set("UMOID", result[key].Umoid);
                    selectedPckg.set("UMO", result[key].UmoidName);
                    break;
                case 'GetUPackagesByServiceID':
                    var pckg = new Package();
                    pckg.set("PriceID", result[key].ID);
                    pckg.set("PackageID", result[key].PackageID);
                    pckg.set("PackageName", result[key].PackageName);
                    pckg.set("FRenewalAmnt", result[key].FutureRenewalAmount);
                    pckg.set("UpgradeAmount", result[key].UpgradeAmount);
                    pckg.set("TotalAmount", result[key].TotalAmount);
                    pckg.set("UMOID", result[key].Umoid);
                    pckg.set("UMO", result[key].UmoidName);
                    pckg.set("ID", Packages.uPackagelist.length);
                    Packages.uPackagelist.push(pckg);

                    break;
                case '':
                    break;
            }
        });
            
    }
}

function ServiceFailed(jqxhr, textStatus, errorThrown) {
    MobileApp.hideLoading();
    if (FunctionName === 'GetAuthenticationByDevice') {
        MobileApp.navigate('#v_login');
        navigator.splashscreen.hide();
        return;
    }
    else if (FunctionName==='GetAuthenticationByUserInfo') {
        
        isRegistered = false;
        var switchInstance = $("#checkUser").data("kendoMobileSwitch");        
        switchInstance.check(false);   
        $(".RegisterInfo").show();        
        navigator.notification.alert("Please register with your mobile number & email",
                                     function() {
                                     }, "Registration Information not found", 'OK');
        return;
    }
    alert('Service call failed');    
    var responseText = jQuery.parseJSON(jqxhr.responseText);
   

    if (jqxhr.responseText) {
        var err = jqxhr.responseText;
        alert(err);      
    }
    return;
}

/*Common methods*/

function JsonDateToDate(dt, format) {
    dt = dt.slice(6, 20);
    var dtInt = parseInt(dt);
    var newDt = new Date(dtInt);
    return $.format.date(newDt, format);
}

function createExpDate(expDate, adval) {
    if (adval === '1 Month') {
        expDate.setMonth(expDate.getMonth() + 1);
    }
    else if (adval === '3 Months') {
        expDate.setMonth(expDate.getMonth() + 3);
    }
    else if (adval === '6 Months') {
        expDate.setMonth(expDate.getMonth() + 6);
    }
    else if (adval === '12 Months') {
        expDate.setFullYear(expDate.getFullYear() + 1);
    }
    return expDate;
}

function getOperationType(view, status) {
    //Upgrade  0,Future Renewal  1,Future Renewal Upgrade  2,Renewal 3,Renewal Upgrade  4
    var optype = 0;
    if (view === "#v_renew") {
        if (status === 'Active') {
            optype = 1;
        }
        else {
            optype = 3;
        }
    }
    else if (view === "#v_upgrade") {
        optype = 0;
    }
    else if (view === "#v_rUpgrade") {
        if (status === 'Active') {
            optype = 2;
        }
        else {
            optype = 4;
        }
    }
    return optype;
}

function clearData(func) {
    var datalen = 0;
    switch (func) {
        case 'GetUnits':
           
            datalen = Units.Unit.length;
            for (i = 0; i < datalen; i++) {
                Units.Unit.pop();               
            }
            break;
        case 'GetMOPs':           
            datalen = MOPs.MOP.length;
            for (i = 0; i < datalen; i++) {
                MOPs.MOP.pop();               
            }
            break;
        case 'GetServiceDetailsByCivilID':
            Customer.set("CustomerID", "");
            Customer.set("CivilID", "");
            Customer.set("CustomerName", "");
            Customer.set("Area", "");
            datalen = Customer.Subscriptions.length;
            for (i = 0; i < datalen; i++) {
                Customer.Subscriptions.pop();
            }
            break;
        case 'GetPackagesByServiceID':        
            selectedPckg.set("PriceID", "");
            selectedPckg.set("PackageID", "");
            selectedPckg.set("PackageName", "");
            selectedPckg.set("UpgradeAmount", 0);
            selectedPckg.set("FRenewalAmnt", 0);
            selectedPckg.set("TotalAmount", 0);
            selectedPckg.set("UMOID", "");
            selectedPckg.set("UMO", "");
            break;
        case 'GetUPackagesByServiceID':
            if (func === 'GetUPackagesByServiceID') {
                datalen = Packages.uPackagelist.length;
                for (i = 0; i < datalen; i++) {
                    Packages.uPackagelist.pop();
                }
            }
            break;
        case 'GetPackages':
            datalen = Packages.Packagelist1.length;
            for (i = 0; i < datalen; i++) {
                Packages.Packagelist1.pop();
            }
            datalen = Packages.Packagelist3.length;
            for (i = 0; i < datalen; i++) {
                Packages.Packagelist3.pop();
            }
            datalen = Packages.Packagelist6.length;
            for (i = 0; i < datalen; i++) {
                Packages.Packagelist6.pop();
            }
            datalen = Packages.Packagelist12.length;
            for (i = 0; i < datalen; i++) {
                Packages.Packagelist12.pop();
            }
            datalen = Packages.NGNPackagelist1.length;
            for (i = 0; i < datalen; i++) {
                Packages.NGNPackagelist1.pop();
            }
            datalen = Packages.NGNPackagelist3.length;
            for (i = 0; i < datalen; i++) {
                Packages.NGNPackagelist3.pop();
            }
            datalen = Packages.NGNPackagelist6.length;
            for (i = 0; i < datalen; i++) {
                Packages.NGNPackagelist6.pop();
            }
            datalen = Packages.NGNPackagelist12.length;
            for (i = 0; i < datalen; i++) {
                Packages.NGNPackagelist12.pop();
            }

            break;
    }
}

function isDataExist(opt) {
    if (opt === 'Subsc') {
        if ((typeof(Customer) !== 'undefined') && (Customer !== null) && (typeof(Customer.Subscriptions) !== 'undefined') && (Customer.Subscriptions !== null) && (Customer.Subscriptions.length > 0)) {
            return true;
        }
    }
    else if (opt === 'OrderD') {
        if ((typeof(OrderDetails) !== 'undefined') && (OrderDetails !== null)) {
            return true;
        }
    }
    else if (opt === 'Packages') {
        if (((typeof(Packages) !== 'undefined') && (Packages !== null) && (typeof(Packages.Packagelist1) !== 'undefined') && (Packages.Packagelist1 !== null)) &&
            (Packages.Packagelist1.length > 0 || Packages.Packagelist1.length > 0 || Packages.Packagelist1.length > 0)) {
            return true;
        }
    }
    else if (opt === 'RPackage') {
        if ((typeof(selectedPckg) !== 'undefined') && (selectedPckg !== null)) {
            return true;
        }
    }
    else if (opt === 'UPackages') {
        if ((typeof(Packages) !== 'undefined') && (Packages !== null) && (typeof(Packages.uPackagelist) !== 'undefined') && (Packages.uPackagelist !== null) &&
            (Packages.uPackagelist.length > 0)) {
            return true;
        }
    }
    else if (opt === 'PInfo') {
        if ((typeof(infoPackId) !== 'undefined') && (infoPackId !== null) && (infoPackId !== "")) {
            return true;
        }
    }
    else if (opt === 'OrdInfo') {
        if ((typeof(OrderDetails) !== 'undefined') && (OrderDetails !== null) && (typeof(OrderDetails.Amount) !== 'undefined')) {
            return true;
        }
    }else if (opt === 'MOPs') {
        //console.log(typeof(MOPs));
        //console.log(MOPs);
        if ((typeof(MOPs) !== 'undefined') && (MOPs !== null) && MOPs.length > 0) {
            //console.log('return true');
            return true;
        }
    }
    return false;
}

function openOrdConf() {
    $('#modalview-OrdInfo').data("kendoMobileModalView").open();
}

function openTermC() {
    $('#v_terms').data("kendoMobileModalView").open();
}

function closeTermC() {
    if (typeof(e) !== 'undefined') {
        e.preventDefault();
    }
    setTimeout(function() {
        $("#v_terms").data("kendoMobileModalView").close();
    }, 200);
}

function onPckgInfoR(id, source) {
    infoPackId = id;

    if (isDataExist('PInfo')) {
        var showMonthly ,showRemaining,showRenewal = false;
       
        if (source === "R") {
            showRenewal=true;
        }
        else if (source === "U") {
            showRemaining = true;
            showMonthly = true;
        }else if (source === "RU") {
            showMonthly = true;
            showRemaining = true;
            showRenewal=true;
        }
        var pInfo = kendo.observable({
                                         FRenewalAmnt: kendo.toString(Packages.getUPackage(infoPackId).FRenewalAmnt, '0.000'),
                                         UpgradeAmount: kendo.toString(Packages.getUPackage(infoPackId).UpgradeAmount, '0.000'),
                                         PackageName: Packages.getUPackage(infoPackId).PackageName,
                                         TotalAmount: kendo.toString(Packages.getUPackage(infoPackId).TotalAmount, '0.000'),
                                         UMO: Packages.getUPackage(infoPackId).UmoidName,
                                         showMonthly: showMonthly,
                                         showRemaining: showRemaining,
                                         showRenewal: showRenewal
                                        
                                     });
        kendo.bind($(".PckgInfo"), pInfo);
        if (typeof(e) !== 'undefined') {
            e.preventDefault();                     
        }
        $('#modalview-PInfo').data("kendoMobileModalView").open();
    }
    return false;
}

function closeModalViewPInfo(e) {
    if (typeof(e) !== 'undefined') {
        e.preventDefault();
    }
    setTimeout(function() {
        $("#modalview-PInfo").data("kendoMobileModalView").close();
    }, 200);
    if (typeof(e) !== 'undefined') {
        e.preventDefault();
    }

    return false;
}

function Logout(e) {
    selSubcrID = 0;
    doLogOut = true;
    showMyInternet = false;
    clearData('GetServiceDetailsByCivilID');
    MobileApp.navigate('#v_login');
}

function loadOffers() {
    if (!$('#GNOffers').html().trim()) {
        var dir = 'http://gulfnet.com.kw/offers/';
        var fileextension = ".jpg";
        var filename = '';
        $.ajax({

                   url: dir,
                   success: function(data) {
                       $(data).find("a:contains(" + fileextension + ")").each(function() {                           
                           if (this.href.indexOf("file") > -1) {
                               filename = this.href.substring(this.href.indexOf("file:///") + 8);
                           }
                           else if (this.href.indexOf("http") > -1) {
                               filename = this.href.replace(window.location.host, "").replace("http:///", "");
                           }
                           $('#GNOffers').prepend($("<li><img  src='http://gulfnet.com.kw/" + filename + "' width=100%></img></li>"));
                       });
                   }
               });
    }
}

function randomString(length, current) {
    current = current ? current : '';
    return length ? randomString(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}

function PostLoadKNET(data) {
    var processInfo = $.getUrlVars(data);
    MobileApp.showLoading();   
    
    OrderDetails.ReferenceID = processInfo.Ref;
    OrderDetails.PayTraID = processInfo.TranID;
    OrderDetails.Result = processInfo.Result;
    OrderDetails.PaymentID = processInfo.PaymentID;
    OrderDetails.Auth = processInfo.Auth;
    OrderDetails.Trackid = processInfo.TrackID;

    if (OrderDetails.Result !== null || OrderDetails.Result !== "") {
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
        Url = "https://mobilewcf.gulfnet.com.kw/MobileService.svc/sjson/PostPayment";
        Data = jsonArgs;
        FunctionName = 'PostPayment';
        $.when(CallService()).done(function(a1) {
           
            if (isKNETSucess) {
                setTimeout(function() {
                    MobileApp.navigate('#v_confOrder')
                }, 20000);
            }
            else {
                MobileApp.navigate('#v_confOrder');
            }
        });
    }
    else {
        MobileApp.navigate('#:back');
        MobileApp.hideLoading();
        navigator.notification.alert("There was an error while processing your data.",
                                     function() {
                                     }, "Error", 'OK');
    }
}

function PostLoadKNETErr() {
    MobileApp.navigate('#:back');
    MobileApp.hideLoading();
    navigator.notification.alert("There was an error while processing your data.",
                                 function() {
                                 }, "Error", 'OK');
}

function isOnline() {
    return navigator.connection.type != Connection.NONE;
}

$.extend({
             getUrlVars: function(url) {
                 var vars = [],
                     hash;
                 var hashes = url.slice(url.indexOf('?') + 1).split('&');
                 for (var i = 0; i < hashes.length; i++) {
                     hash = hashes[i].split('=');
                     vars.push(hash[0]);
                     vars[hash[0]] = hash[1];
                 }
                 return vars;
             },
             getUrlVar: function(url, name) {
                 return $.getUrlVars(url)[name];
             }
         });

