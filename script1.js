const container = document.getElementById('container');
const candlechart = LightweightCharts.createChart(container, {
    layout: {
        textColor: '#bbbbbb',
        background: {color: '#222'}
    }
});

const stockchart = candlechart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: true,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
});

generateChart = (apikey) => {
    fetch(apikey)
    .then((response) => response.json())
    .then(data => {
        // Dynamically extract the interval from the API URL
        const urlParams = new URL(apikey);
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

            return {
                time: unixTimestamp,
                open: parseFloat(timeSeries[dateTime]['1. open']),
                high: parseFloat(timeSeries[dateTime]['2. high']),
                low: parseFloat(timeSeries[dateTime]['3. low']),
                close: parseFloat(timeSeries[dateTime]['4. close']),
            };
        })
        .sort((a, b) => a.time - b.time);

        stockchart.setData(chartData);
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

generateChart('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo');

var radios = document.forms["time_form"].elements["period"];
for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
        // Base URL without query parameters
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

