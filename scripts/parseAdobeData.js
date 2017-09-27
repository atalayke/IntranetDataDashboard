var pieData;
var tableData;
var browserData;
var osData;
var deviceData;
var avgHourlyData;
/*
    Transform raw pie chart data into a form easily handled by d3.js
*/
function generatePieData(data) {
    var totalViews = 0;
    var totalVisits = 0;

    console.log(apps);
    var viewsVisits = {}
    appsCurrDisp.forEach(function(entry) {
        viewsVisits[entry] = {};
        viewsVisits[entry]['views'] = {};
        viewsVisits[entry]['visits'] = {};
        viewsVisits[entry]['views'] = 0;
        viewsVisits[entry]['visits'] = 0;
    });
    console.log(viewsVisits);
    data.forEach(function(day) {
        day.breakdown.forEach(function(app) {
            var name = parseAppName(app.name);
            if (name !== '' && (appsCurrDisp.indexOf(name) !== -1)) {
                viewsVisits[name]['views'] += Number(app.counts[0]);
                viewsVisits[name]['visits'] += Number(app.counts[1]);
                totalViews += Number(app.counts[0]);
                totalVisits += Number(app.counts[1]);
            }
        });
    });
    viewsVisits['totalViews'] = totalViews;
    viewsVisits['totalVisits'] = totalVisits;
    return viewsVisits;
}
/*
    Transform raw table data into a form easily handled by d3.js
*/
function generateTableData(data, startDate, endDate) {
    data[0].breakdown.forEach(function(entry) {
        var name = entry.name.split('.');
        var app = name[0].replace('https://', '');
        if (apps.indexOf(app) === -1) {
            apps.push(app);
        }
    });
    var viewsVisits = {}
    appsCurrDisp.forEach(function(entry) {
        viewsVisits[entry] = {};
        viewsVisits[entry]['views'] = {};
        viewsVisits[entry]['visits'] = {};
        viewsVisits[entry]['views'] = 0;
        viewsVisits[entry]['visits'] = 0;
    });
    data.forEach(function(day) {
        var date = parseDate(day);
        if (date >= startDate && date <= endDate) {
            day.breakdown.forEach(function(app) {
                var name = parseAppName(app.name);
                if (name !== '' && (appsCurrDisp.indexOf(name) !== -1)) {
                    viewsVisits[name]['views'] += Number(app.counts[0]);
                    viewsVisits[name]['visits'] += Number(app.counts[1]);
                }
            });
        } else {
            //console.log('Generating table data, date: ' + JSON.stringify(date) + ' out of range');
        }
    });
    return viewsVisits;
}
/*
    Transform raw bar chart data into a form easily handled by d3.js
*/
var totalViewsVisitsCurr = [0, 0];

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
        appsCurrDisp.forEach(function(app) {
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
        /*
            Iterate through apps, updating visits/views by element        
        */
        day.breakdown.forEach(function(app) {
            var appName = parseAppName(app.name);
            if (appsCurrDisp.indexOf(appName) !== -1) {
                app.breakdown.forEach(function(type) {
                    //Get elementname in a usable format         \                    
                    var elementName = parseElementName(type, elm);
                    if (elementName) {
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
                    } else {
                        //               console.log(type);
                        //               console.log(elementName);
                    }
                });

            }
        });
    });
    viewsVisits['totalViews'] = totalViewsVisitsCurr[0] + 0.0;
    viewsVisits['totalVisits'] = totalViewsVisitsCurr[1] + 0.0;
    totalViewsVisitsCurr[0] = 0;
    totalViewsVisitsCurr[1] = 0;
    return viewsVisits;
}
/*
    Transform raw houlry data into a form easily handled by d3.js
*/
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
    for (var i = 0; i < 24; i++) {
        hours.push(i.toString());
    }
    appsCurrDisp.forEach(function(app) {
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
        if (currDate >= startDate && currDate <= endDate) {
            //Date is in range, iterate over each hour, views/visits
            var hrs = Object.keys(hrlyData[day]);
            //console.log(hrs);
            hrs.forEach(function(hour) {
                totalHours += 1;
                var applications = Object.keys(hrlyData[day][hour]);
                //Iterate over list of apps, accumulate views/visits
                applications.forEach(function(app) {
                    var currApp = hrlyData[day][hour][app];
                    var appName = parseAppName(currApp.name);
                    //                    currApp.name.split('.')
                    //                    appName = appName[0].replace('https://', '');
                    if (appsCurrDisp.indexOf(appName) !== -1) {
                        var views = Number(currApp.counts[0]);
                        var visits = Number(currApp.counts[1]);
                        viewSum = viewSum + views;
                        visitSum = visitSum + visits;
                        allAppsHr[appName]['views'][hour] = allAppsHr[appName]['views'][hour] + views;
                        allAppsHr[appName]['visits'][hour] = allAppsHr[appName]['visits'][hour] + visits;
                        allAppsHr['all']['views'][hour] = allAppsHr['all']['views'][hour] + views;
                        allAppsHr['all']['visits'][hour] = allAppsHr['all']['visits'][hour] + visits;
                    }
                });
            });
        } else {}
    });
    var numDays = totalHours / 23;
    appsCurrDisp.forEach(function(app) {
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
/*
    Updates views or visits counts
*/
function updateViewsVisits(date, appName, elementName, countType, type, viewsVisits) {
    var typeIndex = countType === 'views' ? 0 : 1;
    var update = viewsVisits[date][appName][elementName][countType] === undefined ?
        Number(type.counts[typeIndex]) :
        viewsVisits[date][appName][elementName][countType] + Number(type.counts[typeIndex]);
    totalViewsVisitsCurr[typeIndex] += Number(type.counts[typeIndex]);
    return update;
}

function genCSVData() {
    var flds = ['application', 'total_views', 'total_visits',
        'views_windows_7', 'views_windows_10', 'views_os_x', 'views_other_os',
        'visits_windows_7', 'visits_windows_10', 'visits_os_x', 'visits_other_os',
        'views_chrome', 'views_ie', 'views_safari', 'views_other_browser',
        'visits_chrome', 'visits_ie', 'visits_safari', 'visits_other_browser',
        'views_desktop', 'views_tablet', 'views_mobile', 'views_media_pl',
        'visits_desktop', 'visits_tablet', 'visits_mobile', 'visits_media_pl'
    ];
    var dta = [];
    appsCurrDisp.forEach(function(application) {
        console.log(application);
        var entry = [];
        var browser = selectBarData(d3.entries(browserData), minDate, maxDate, application);
        var os = selectBarData(d3.entries(osData), minDate, maxDate, application);
        var dev = selectBarData(d3.entries(deviceData), minDate, maxDate, application);
        console.log(browser);
        console.log(os);
        console.log(dev);
        entry.push(application); //application name
        entry.push(tableData[application].views); //total_views
        entry.push(tableData[application].visits); //total_visits
        entry.push(os['data']['Windows 7']['views']); //views_windows7
        entry.push(os['data']['Windows 10']['views']); //views_windows10        
        entry.push(os['data']['OS X']['views']); //views_os_x
        entry.push(os['data']['Other']['views']); //views_other_os
        entry.push(os['data']['Windows 7']['visits']); //visits_windows_7        
        entry.push(os['data']['Windows 10']['visits']); //visits_windows_10
        entry.push(os['data']['OS X']['visits']); //visits_os_x
        entry.push(os['data']['Other']['visits']); //visits_other_os
        entry.push(browser['data']['Google Chrome']['views']); //views_chrome
        entry.push(browser['data']['Internet Explorer']['views']); //views_ie
        entry.push(browser['data']['Safari']['views']); //visits_safari
        entry.push(browser['data']['Other']['views']); //visits_other_browser
        entry.push(browser['data']['Google Chrome']['visits']); //visits_chrome
        entry.push(browser['data']['Internet Explorer']['visits']); //visits_ie
        entry.push(browser['data']['Safari']['visits']); //visits_safari
        entry.push(browser['data']['Other']['visits']); //visits_other_browser
        entry.push(dev['data']['Desktop']['views']); //views_desktop
        entry.push(dev['data']['Tablet']['views']); //views_tablet
        entry.push(dev['data']['Mobile Phone']['views']); //views_mobile
        entry.push(dev['data']['Media Player']['views']); //views_media_pl
        entry.push(dev['data']['Desktop']['visits']); //visits_desktop
        entry.push(dev['data']['Tablet']['visits']); //visits_tablet
        entry.push(dev['data']['Mobile Phone']['visits']); //visits_mobile
        entry.push(dev['data']['Media Player']['visits']); //visits_media_pl
        entry.push('&&');
        dta.push(entry);
    });
    return {
        fields: flds,
        data: dta,
        config: {
            quotes: false,
            quoteChar: '"',
            delimiter: ',',
            header: true,
            newline: '&&'
        }
    };
}

function genVisData() {
    //var pieData = generatePieData(pieDataDaily.report.data);  
    pieData = generatePieData(pieDataAllApps.report.data);
    //var tableData = generateTableData(pieDataDaily.report.data, new Date(2017, 6, 22), new Date(2017, 7, 22));
    tableData = generateTableData(pieDataAllApps.report.data, new Date(2017, 6, 22), new Date(2017, 7, 22));
    //var browserData = generateBarChartData(browserDataDaily.report.data, 'browser');
    browserData = generateBarChartData(browserDataAllApps.report.data, 'browser');
    //var osData = generateBarChartData(osDataDaily.report.data, 'os');
    osData = generateBarChartData(osDataAllApps.report.data, 'os');
    //var deviceData = generateBarChartData(deviceDataDaily.report.data, 'device'); 
    deviceData = generateBarChartData(deviceDataAllApps.report.data, 'device');
    avgHourlyData = generateAvgHourlyData(hourlyDataTotal, new Date(2017, 6, 22), new Date(2017, 7, 22));
}