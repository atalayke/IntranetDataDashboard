var pieScheme = ['#ffb819', '#5f9baf', '#e57200', '#719500', '#c0143c', '#005f71', '#616265'];
var tableScheme = ['#fff1d1', '#dfebef', '#fae3cc', '#e1e8cc', '#f2d0d8', '#ccdfe3', '#d2dde8'];
var pieColor = d3.scaleOrdinal(pieScheme);
var tableColor = d3.scaleOrdinal(tableScheme);
var apps = [];
var appsNotCurrDisp = [];
var appsCurrDisp = [];
var allowableBrowsers = ['Google Chrome', 'Internet Explorer', 'Safari', 'Other'];
var allowableOS = ['Windows 7', 'Windows 10', 'OS X', 'Other'];
var allowableOSRaw = ['windows 7', 'windows 10', 'os x 10.11', 'os x 10.10', 'Other'];
var allowableDev = ['Desktop', 'Tablet', 'Mobile Phone', 'Media Player'];

function populateAppsArrays(data) {
    data.forEach(function(datum) {
        datum.breakdown.forEach(function(entry) {
            var app = parseAppName(entry.name);
            if ((apps.indexOf(app) === -1) && (app !== '')) {
                apps.push(app);
                appsNotCurrDisp.push(app);
            }
        });
    });
}

function getDateString(date) {
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var yr = date.getFullYear();
    console.log(date);
    console.log(mon);
    console.log(day);
    console.log(yr);
    return mon + '_' + day + '_' + yr;
}

function parseType(type) {
	switch(type) {
		case 'os':
			return 'Operating System';
		case 'browser':
		case 'device':
			var ret = type.charAt(0).toUpperCase() + type.slice(1);
			console.log(ret);
			return ret;
	}
}

function parseAppName(name) {
    if (name) {
        var root = name.split('.')[0].replace('https://', '');
        switch (root) {
            case 'csosmember':
                return 'CSOS Member';
            case 'internal':
                return 'ITG';
            case 'healthyeating':
                return 'Healthy Eating';
            case 'iaspnhlbiadmin':
                return 'IASP Admin';
            case 'webapp':
                return 'Web App';
            case 'brtpugadmin':
                return 'BRTPUG Admin';
            case 'oedadmin':
                return 'OED Admin';
            case 'consultantaccess':
                return 'Consultant Access';
            case 'trac':
            case 'brtpug':
            case 'csos':
            case 'iasp':
            case 'ids':
            case 'grasp':
            case 'mtagym':
            case 'oed':
            case 'teac':
                return root.toUpperCase();
            default:
                return '';
        }
    } else {
        return '';
    }
}

/*
    Return appropriate whitelist given type
*/
function getWhiteList(type) {
    if (type === 'browser') {
        return allowableBrowsers;
    } else if (type === 'device') {
        return allowableDev;
    } else {
        return allowableOS;
    }
}

/*
    Return a date object given a data element
*/
function parseDate(date) {
    var year = date.year,
        month = date.month - 1,
        day = date.day;
    return new Date(year, month, day);
}

/*
    Given a type and an element, return the appropriate
    name
*/
function parseElementName(type, elm) {
    if (elm === 'browser') {
        //console.log(type);
        var rawName = type.name.split(' ');
        var browserName;
        //Determine browser type
        if (rawName[0] === 'safari') {
            browserName = 'Safari';
        } else if (rawName[1] === 'internet') {
            browserName = 'Internet Explorer';
        } else if (rawName[0] === 'google') {
            //browserName = rawName[0] + " " + rawName[1];
            browserName = 'Google Chrome';
        }
        //Determine if this is an "allowable" browser
        if (allowableBrowsers.indexOf(browserName) === -1) {
            return 'Other';
        } else {
            return browserName;
        }
    } else if (elm === 'os') {
        var osName = type.name;
        if (allowableOSRaw.indexOf(osName) === -1) {
            return 'Other';
        } else {
            var rawName = osName.split(' ');
            if (rawName[0] === 'windows') {
                if (rawName[1] === '10') {
                    return 'Windows 10';
                } else {
                    return 'Windows 7';
                }
            } else if (rawName[0] === 'os') {
                return 'OS X';
            } else {
                return 'Other';
            }
        }
    } else {
        if (type.name === 'Gaming Console') {
            return 'Media Player';
        } else if (type.name === 'Other') {
            return 'Desktop';
        } else {
            return type.name;
        }
    }
}
