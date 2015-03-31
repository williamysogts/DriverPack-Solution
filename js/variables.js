var version = "16";
var verType = "Beta";

var WshShell = new ActiveXObject("WScript.Shell");
var AppData = this.WshShell.SpecialFolders("AppData");
var FSO = new ActiveXObject("Scripting.FileSystemObject");
var softPath = this.WshShell.SpecialFolders("AppData") + '\\DRPSu\\PROGRAMS';
var locator = new ActiveXObject("WbemScripting.SWbemLocator");
var objWMIService = locator.ConnectServer(null, "root\\cimv2");

var SVersion = 32;
if (navigator.userAgent.indexOf("WOW64") != -1 ||
        navigator.userAgent.indexOf("Win64") != -1) {
    SVersion = 64;
}
var OperatingSystem = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem", "WQL");
var OperatingSystemItems = new Enumerator(OperatingSystem);
for (; !OperatingSystemItems.atEnd(); OperatingSystemItems.moveNext()) {
    var OSVersion = OperatingSystemItems.item().Version.replace(/.\d\d.*/, "");
}

var DrivercolItems = objWMIService.ExecQuery("SELECT * FROM  Win32_PnPSignedDriver", "WQL");
var DriverenumItems = new Enumerator(DrivercolItems);

var driverJsonDB = '';
var softJsonDB = '';
var wgetJsonDB = '';

var request = {
    getXmlHttp: function () {     // функция для создания объекта AJax
        var request = false;
        try {
            request = new XMLHttpRequest();
        } catch (trymicrosoft) {
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (othermicrosoft) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    request = false;
                }
            }
        }
        if (!request) {
            throw new Error("Error initializing XMLHttpRequest!");
        }
        return(request);
    },
    /*parseObj: function (obj, start_key) {
     var data = '';
     for (var key in obj) {
     if (typeof obj[key] == 'object') {
     data += (data == '' ? '' : '&') + this.parseObj(obj[key], start_key !== '' ? (start_key + '[' + key + ']') : key);
     } else {
     data += (data == '' ? '' : '&') + (start_key !== '' ? (start_key + '[' + key + ']') : key) + '=' + encodeURIComponent(obj[key]);
     }
     }
     return data;
     },*/
    send: function (params) {
        var xmlhttp = this.getXmlHttp();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200 && typeof params.success == 'function') {
                    params.success.call(xmlhttp, xmlhttp.responseText);
                } else if (typeof params.error == 'function') {
                    params.error.call(xmlhttp, xmlhttp.statusText);
                }
            }
        };
        if (typeof params.data === 'object') {
            var data = Object.keys(params.data).map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(params.data[k])
            }).join('&');
        } else {
            data = params.data;
        }
        if (params.type === 'GET') {
            xmlhttp.open(params.type, params.url + '?' + data, params.sync);
            //xmlhttp.setRequestHeader('Content-Type', params.contentType);
            xmlhttp.setRequestHeader('Accept-Charset', 'utf-8');
            xmlhttp.setRequestHeader('Content-Type', params.contentType);
            xmlhttp.send();
        } else if (params.type === 'POST') {
            xmlhttp.open(params.type, params.url, params.sync);
            xmlhttp.setRequestHeader('Content-Type', params.contentType);
            xmlhttp.send(data);
        }
    }
}

var resize = {
    init: function () {
        try {
            self.resizeTo(screen.width, screen.height - 36);
            self.moveTo(0, 0);
            if ((screen.width < width) || (screen.height < height)) {
                self.resizeTo(800, 600 - 25);
                self.moveTo(0, 0);
                onload(function () {
                    tooglePanel();
                });
            }
        }
        catch (err) {
        }
        document.title = document.title + " " + version + " " + verType;
        try {
            window.attachEvent('onresize',
                    function () {
                        if ($(window).width() < 718) { //hide panel
                            tooglePanel(false);
                        }
                        else if ($(window).width() > (800)) { //show panel
                            tooglePanel(true);
                        }
                    }
            );
        }
        catch (err) {
        }
    }
}

resize.init();