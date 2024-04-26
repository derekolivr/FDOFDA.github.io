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

fetch('https://alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo').then((response) => {
    console.log('success', response);
    return response.json();
}).then(data => {
    const timeSeries = data['Time Series (5min)'];
    const chartData = Object.keys(timeSeries).map((time) => {
        return {
            time: time,
            open: parseFloat(timeSeries[time]['1. open']),
            high: parseFloat(timeSeries[time]['2. high']),
            low: parseFloat(timeSeries[time]['3. low']),
            close: parseFloat(timeSeries[time]['4. close']),
        };
    });

    stockchart.setData(chartData);
}).catch((error) => {
    console.log('failed', error);
})





















/* const getTodos = (resource, callback) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () =>{
        if (request.readyState === 4 && request.status === 200) {
            const data = JSON.parse(request.responseText);
            callback(null, data);

        } else if (request.readyState === 4) {
            callback('Could not fetch the data', null);
        }
    });
    
    request.open('GET', resource);
    request.send();
}

getTodos('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo', (err, data) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Data:', data);
    }
});
*/