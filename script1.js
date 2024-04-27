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

fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo')
    .then((response) => response.json())
    .then(data => {
        const timeSeries = data['Time Series (5min)'];
        const chartData = Object.keys(timeSeries)
            .map((dateTime) => {
                const date = new Date(dateTime); // Create a Date object from the datetime string
                const unixTimestamp = Math.floor(date.getTime() / 1000);

                return {
                    time: unixTimestamp,
                    open: parseFloat(timeSeries[dateTime]['1. open']),
                    high: parseFloat(timeSeries[dateTime]['2. high']),
                    low: parseFloat(timeSeries[dateTime]['3. low']),
                    close: parseFloat(timeSeries[dateTime]['4. close']),
                };
            })
            .sort((a, b) => a.time - b.time); // Sort data points by time in ascending order

        stockchart.setData(chartData);
    })
    .catch((error) => {
        console.log('Error:', error);
    });
