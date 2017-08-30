var apps = [];
var allowableBrowsers = ['Google Chrome', 'Internet Explorer', 'Safari', 'Other'];
var allowableOS = ['Windows 7', 'Windows 10', 'OS X 10.11', 'Other'];
var allowableDev = ['Desktop', 'Tablet', 'Mobile Phone', 'Media Player'];

function generatePieData(data) {
    var totalViews = 0;
    var totalVisits = 0;
    data[0].breakdown.forEach(function(entry) {
        var name = entry.name.split('.');
        var app = name[0].replace('https://', '');
        if(apps.indexOf(app) === -1) {
            apps.push(app);
        }
    });
    var viewsVisits = {}
    apps.forEach(function(entry) {
        viewsVisits[entry] = {};
        viewsVisits[entry]['views'] = {};
        viewsVisits[entry]['visits'] = {};
        viewsVisits[entry]['views'] = 0;
        viewsVisits[entry]['visits'] = 0;
    });
    data.forEach(function(day) {       
        day.breakdown.forEach(function(app) {            
            var name = app.name.split('.')
            name = name[0].replace('https://', '');
            viewsVisits[name]['views'] += Number(app.counts[0]);
            viewsVisits[name]['visits'] += Number(app.counts[1]);
            totalViews += Number(app.counts[0]);
            totalVisits += Number(app.counts[1]);
        });
    });
    viewsVisits['totalViews'] = totalViews;
    viewsVisits['totalVisits'] = totalVisits;
    return viewsVisits;
}

function generateTableData(data, startDate, endDate) {
    //console.log(JSON.stringify(data));
    data[0].breakdown.forEach(function(entry) {
    //data.forEach(function(entry) {
        var name = entry.name.split('.');
        var app = name[0].replace('https://', '');
        if(apps.indexOf(app) === -1) {
            apps.push(app);
        }
    });
    var viewsVisits = {}
    apps.forEach(function(entry) {
        viewsVisits[entry] = {};
        viewsVisits[entry]['views'] = {};
        viewsVisits[entry]['visits'] = {};
        viewsVisits[entry]['views'] = 0;
        viewsVisits[entry]['visits'] = 0;
    });
    data.forEach(function(day) {       
        console.log(JSON.stringify(day));
        //var date = new Date(Date.parse(day.name));
        var date = parseDate(day);
        console.log(JSON.stringify(date));
        if(date >= startDate && date <= endDate) {  
            day.breakdown.forEach(function(app) {            
                var name = app.name.split('.')
                name = name[0].replace('https://', '');
                viewsVisits[name]['views'] += Number(app.counts[0]);
                viewsVisits[name]['visits'] += Number(app.counts[1]);
            });
        } else {
            console.log('Generating table data, date: ' + JSON.stringify(date) + ' out of range');
        }
    });
    return viewsVisits;  
}

function getWhiteList(type) {
    if(type === 'browser') {
        return allowableBrowsers;
    } else if (type === 'device') {
        return allowableDev;
    } else {
        return allowableOS;
    }
}

function generateBarChartData(data, elm) {
    var viewsVisits = {};    
    var totalViews = 0;    
    var totalVisits = 0;    
    var date;    
    var whiteList = getWhiteList(elm);

    /*
    Initialize apps/browsers views/visits counts to 0 for all Dates in the current range
    */
    data.forEach(function(date) {
        date = parseDate(date);
        viewsVisits[date] = {};
        viewsVisits[date]['all'] = {};
        apps.forEach(function(app) {
            viewsVisits[date][app] = {};                        
			whiteList.forEach(function(type) {
                viewsVisits[date]['all'][type] = {};
                viewsVisits[date][app][type] = {};                
                viewsVisits[date][app][type]['views'] = 0;
                viewsVisits[date][app][type]['visits'] = 0;                
                viewsVisits[date]['all'][type]['views'] = 0;
                viewsVisits[date]['all'][type]['visits'] = 0;
            })
        });
    });

    var currDate;
    data.forEach(function(day) {
        currDate = parseDate(day);
        totalViews += Number(day.breakdownTotal[0]);
        totalVisits += Number(day.breakdownTotal[1]);
        //Iterate through apps, updating visits/views by element        
        day.breakdown.forEach(function(app) {
            if(Number(app.counts[0]) > 0) {
                app.breakdown.forEach(function(type) {
                    //Get appname in a usable format
                    var appName = app.name.split('.');
                    appName = appName[0].replace('https://', '');

                    //Get elementname in a usable format         \                    
                    var elementName = parseElementName(type, elm);

                    //Update cumulative views for this date / element
                    viewsVisits[currDate]['all'][elementName]['views'] = 
                                updateViewsVisits(currDate, 'all', elementName, 'views', type, viewsVisits);

                    //Update cumulative visits for this date / element
                    viewsVisits[currDate]['all'][elementName]['visits'] = 
                                updateViewsVisits(currDate, 'all', elementName, 'visits', type, viewsVisits);

                    //Update views for this date / app / element
                    viewsVisits[currDate][appName][elementName]['views'] = 
                                updateViewsVisits(currDate, appName, elementName, 'views', type, viewsVisits);

                    //Update visits for this date / app/ element
                    viewsVisits[currDate][appName][elementName]['visits'] = 
                                updateViewsVisits(currDate, appName, elementName, 'visits', type, viewsVisits);                                        
                });
            }
        });    
    });
    viewsVisits['totalViews'] = totalViews + 0.0;
    viewsVisits['totalVisits'] = totalVisits + 0.0;
    console.log(elm);
    console.log(viewsVisits);
    return viewsVisits;
}

function generateAvgHourlyData(hrlyData, startDate, endDate) {
    var allAppsHr = {};
    allAppsHr['all'] = {};
    allAppsHr['all']['views'] = {};
    allAppsHr['all']['visits'] = {};
    var hours = [];
    var viewSum = 0;
    var visitSum = 0;
    var totalHours = 0;
    var totalDays = 0;
    for(var i = 0; i < 24; i++) {
        hours.push(i.toString());
    }
    apps.forEach(function(app) {
        allAppsHr[app] = {};
        allAppsHr[app]['views'] = {};
        allAppsHr[app]['visits'] = {};
        hours.forEach(function(hr) {
            allAppsHr[app]['views'][hr] = 0;
            allAppsHr[app]['visits'][hr] = 0;
            allAppsHr['all']['views'][hr] = 0;
            allAppsHr['all']['visits'][hr] = 0;
        })
    });
/*
    Get array of dates, iterate over these
*/  
    var dates = Object.keys(hrlyData);
    dates.forEach(function(day) {    
        totalDays += 1;
        var currDate = new Date(day);
        if(currDate >= startDate && currDate <= endDate) {   
            //Date is in range, iterate over each hour, views/visits
            var hrs = Object.keys(hrlyData[day]);
            console.log(hrs);
            hrs.forEach(function(hour) {
                totalHours += 1;
                var applications = Object.keys(hrlyData[day][hour]);
                //Iterate over list of apps, accumulate views/visits
                applications.forEach(function(app) {
                    var currApp = hrlyData[day][hour][app];
                    var appName = currApp.name.split('.')
                    appName = appName[0].replace('https://', '');
                    var views = Number(currApp.counts[0]);
                    var visits = Number(currApp.counts[1]);
                    viewSum = viewSum + views;
                    visitSum = visitSum + visits;
                    allAppsHr[appName]['views'][hour] = allAppsHr[appName]['views'][hour] + views;
                    allAppsHr[appName]['visits'][hour] = allAppsHr[appName]['visits'][hour] + visits;
                    allAppsHr['all']['views'][hour] = allAppsHr['all']['views'][hour] + views;
                    allAppsHr['all']['visits'][hour] = allAppsHr['all']['visits'][hour] + visits;                    
                });
            });
        } else {
        }
    });
    var numDays = totalHours / 23;
    apps.forEach(function(app) {
        hours.forEach(function(hour) {
            allAppsHr[app]['views'][hour] = allAppsHr[app]['views'][hour] / numDays;
            allAppsHr[app]['visits'][hour] = allAppsHr[app]['visits'][hour] / numDays;
         });
    });
    hours.forEach(function(hour) {
        allAppsHr['all']['views'][hour] = allAppsHr['all']['views'][hour] / numDays;
        allAppsHr['all']['visits'][hour] = allAppsHr['all']['visits'][hour] / numDays;
    });

    return allAppsHr;
}

function updateViewsVisits(date, appName, elementName, countType, type, viewsVisits) {    
    var typeIndex = countType === 'views' ? 0 : 1;
    var update = viewsVisits[date][appName][elementName][countType] === undefined ? 
            Number(type.counts[typeIndex]) : 
            viewsVisits[date][appName][elementName][countType] + Number(type.counts[typeIndex]);             
    return update;
}

function parseDate(date) {
    var year = date.year,
        month = date.month - 1,
        day = date.day;
    console.log(JSON.stringify(new Date(year, month, day)));
    return new Date(year, month, day);
}

function parseElementName(type, elm) {
    if(elm === 'browser') {
        var rawName = type.name.split(' ');    
        var browserName;           
        //Determine browser type
        if(rawName[0] === 'Safari') {
            browserName = 'Safari';
        } else if(rawName[1] === 'Internet') {
            browserName = 'Internet Explorer';
        } else {
            browserName = rawName[0] + " " + rawName[1];
        }    
        //Determine if this is an "allowable" browser
        if(allowableBrowsers.indexOf(browserName) === -1) {
            return 'Other';        
        } else {
            return browserName;
        }
    } else if(elm === 'os') {
        var osName = type.name;        
        if(allowableOS.indexOf(osName) === -1) {
            osName = 'Other';    
        }
        return osName;
    } else {
        if(type.name === 'Gaming Console') {
            return 'Media Player';
        } else if(type.name === 'Other') {
            return 'Desktop';
        } else {
            return type.name;
        }
    }
}

var pieData = generatePieData(pieDataDaily.report.data);  
var tableData = generateTableData(pieDataDaily.report.data, new Date(2017, 6, 22), new Date(2017, 7, 22));
var browserData = generateBarChartData(browserDataDaily.report.data, 'browser');
var osData = generateBarChartData(osDataDaily.report.data, 'os');
var deviceData = generateBarChartData(deviceDataDaily.report.data, 'device'); 
//var avgHourlyData = generateAvgHourlyData(hourlyDataTotal.report.data, new Date(2017, 6, 22), new Date(2017, 7, 22));
var avgHourlyData = generateAvgHourlyData(hourlyDataTotal, new Date(2017, 6, 22), new Date(2017, 7, 22));