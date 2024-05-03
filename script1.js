const container = document.getElementById('container');
const candlechart = LightweightCharts.createChart(container, {
    layout: {
        textColor: '#bbbbbb',
        background: {color: "#1f1f1f"}
        
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: true,
    },
});

const stockchart = candlechart.addCandlestickSeries({
    upColor: '#4672d2',
    downColor: '#cf4358',
    borderVisible: false,
    wickUpColor: '#4672d2',
    wickDownColor: '#cf4358',

    scaleMargins: {
        top: 0,       
        bottom: 0.3
    }
});

stockchart.applyOptions({
    priceScale: {
        autoScale: false
    }
    
});

stockchart.priceScale().applyOptions({
    scaleMargins: {
        top: 0.1,
        bottom: 0.4,
    },
});


const volumeSeries = candlechart.addHistogramSeries({
    color: 'rgba(36, 171, 76, 0.3)',
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: '',
    crosshairMarkerVisible: true,
    invertScale: false,
    alignLabels: true,

    priceScale: {
        autoScale: false
        
    }
});

volumeSeries.priceScale().applyOptions({
    scaleMargins: {
        top: 0.7, 
        bottom: 0,
    },
});


generateChart = (apiurl, user_hour = "All", user_day = "All") => {
    fetch(apiurl)
    .then((response) => response.json())
    .then(data => {
        const urlParams = new URL(apiurl);
        const interval = urlParams.searchParams.get("interval");
        const timeSeriesKey = `Time Series (${interval})`;
        const timeSeries = data[timeSeriesKey];

        if (!timeSeries) {
            console.error("Time series data not found for the specified interval.");
            return;
        }

        const chartData = Object.keys(timeSeries).map((dateTime) => {
            const date = new Date(dateTime);
            const unixTimestamp = Math.floor(date.getTime() / 1000);
            const hour = date.getUTCHours();
            const day = date.getUTCDate();

            if (("All" === user_hour && "All" === user_day) ||
                ("All" === user_hour && day == user_day) ||
                (hour == user_hour && "All" === user_day) ||
                (hour == user_hour && day == user_day)) {
            
                
                return {
                    time: unixTimestamp,
                    open: parseFloat(timeSeries[dateTime]['1. open']),
                    high: parseFloat(timeSeries[dateTime]['2. high']),
                    low: parseFloat(timeSeries[dateTime]['3. low']),
                    close: parseFloat(timeSeries[dateTime]['4. close']),
                    volume: parseFloat(timeSeries[dateTime]['5. volume'])
                };
            }
        }).filter(item => item !== undefined)
        .sort((a, b) => a.time - b.time);

        if (chartData.length > 0) {
            stockchart.setData(chartData.map(item => ({
                time: item.time,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close
            })));
        
            volumeSeries.setData(chartData.map(item => ({
                time: item.time,
                value: item.volume
            })));

        } else {
            console.log("No data available for the selected filters.");
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}


generateChart('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo');

var radios = document.forms["time_form"].elements["period"];
for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {

        const baseUrl = 'https://www.alphavantage.co/query';

        const params = new URLSearchParams({
            function: 'TIME_SERIES_INTRADAY',
            symbol: 'IBM',
            interval: this.value,
            outputsize: 'full',
            apikey: 'demo'
        });

        const updatedUrl = baseUrl + '?' + params.toString();
        console.log(updatedUrl);

        generateChart(updatedUrl);
    }
}


const container2 = document.getElementById('container2');
const candlechart2 = LightweightCharts.createChart(container2, {
    layout: {
        textColor: '#bbbbbb',
        background: {color: "#1f1f1f"}
        
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: true,
    },
});

const stockchart2 = candlechart2.addCandlestickSeries({
    upColor: '#4672d2',
    downColor: '#cf4358',
    borderVisible: false,
    wickUpColor: '#4672d2',
    wickDownColor: '#cf4358',
});


generateChart2 = (apiurl) => {
    fetch(apiurl)
    .then((response) => response.json())
    .then(data => {
        const urlParams = new URL(apiurl);
        const interval = urlParams.searchParams.get("interval");
        const timeSeriesKey = `Time Series (${interval})`;
        const timeSeries = data[timeSeriesKey];

        if (!timeSeries) {
            console.error("Time series data not found for the specified interval.");
            return;
        }




        const hourlyData = {};
        Object.keys(timeSeries).forEach(dateTime => {
            const date = new Date(dateTime);
            const unixTimestamp = Math.floor(date.getTime() / 1000);
            const hour = date.getUTCHours();
            const day = date.getUTCDate();


            const hourKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${day} ${hour}:00:00`;

            if (!hourlyData[hourKey]) {
                hourlyData[hourKey] = {
                    open: parseFloat(timeSeries[dateTime]['1. open']),
                    high: parseFloat(timeSeries[dateTime]['2. high']),
                    low: parseFloat(timeSeries[dateTime]['3. low']),
                    close: parseFloat(timeSeries[dateTime]['4. close']),
                    firstTimestamp: unixTimestamp
                };
            } else {
                hourlyData[hourKey].high = Math.max(hourlyData[hourKey].high, parseFloat(timeSeries[dateTime]['2. high']));
                hourlyData[hourKey].low = Math.min(hourlyData[hourKey].low, parseFloat(timeSeries[dateTime]['3. low']));
                hourlyData[hourKey].close = parseFloat(timeSeries[dateTime]['4. close']);
            }
        });

        const chartData = Object.keys(hourlyData).map(key => ({
            time: hourlyData[key].firstTimestamp,
            open: hourlyData[key].open,
            high: hourlyData[key].high,
            low: hourlyData[key].low,
            close: hourlyData[key].close,
        })).sort((a, b) => a.time - b.time);

        if (chartData.length > 0) {
            stockchart2.setData(chartData);
        } else {
            console.log("No data available for the selected filters.");
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

generateChart2('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo');

// document.querySelectorAll('.dropdown').forEach(dropdown => {
//     const dropdownBtn = dropdown.querySelector('.dropbtn');
//     const dropdownMenu = dropdown.querySelector('.dropdown_menu');

//     dropdownBtn.addEventListener('click', () => {
//         dropdownMenu.classList.toggle('hide');
//     });

//     dropdown.querySelectorAll('.dropdown_menu a').forEach(item => {
//         item.addEventListener('click', function(event) {
//             event.preventDefault();
//             const hr = this.getAttribute('hour');
//             const day = this.getAttribute('day');
//             console.log(hr);

//             if (day) {
//                 dropdownBtn.innerHTML = "Day " + day;
//             } else if (hr) {
//                 dropdownBtn.innerHTML = "Hour " + hr;
//             }

//             generateChart("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo", hr, day);
//         });
//     });
// });