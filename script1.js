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

            console.log(hour);
            console.log(day);

            // Check all conditions and return the appropriate structure or undefined
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
                };
            }
        }).filter(item => item !== undefined) // Ensure no undefined entries
        .sort((a, b) => a.time - b.time); // Sort entries by time

        if (chartData.length > 0) {
            stockchart.setData(chartData);
        } else {
            console.log("No data available for the selected filters.");
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}


generateChart('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo');

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

const dropdownBtn = document.querySelector(".dropbtn");
const dropdownMenu = document.querySelector(".dropdown_menu")
dropdownBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hide');
})

document.querySelectorAll('.dropdown_menu a').forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
      const hr = this.getAttribute('hour');
      const element = document.getElementsByClassName("dropbtn")[0];
      element.innerHTML = "Hour " + hr;

      generateChart("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo", hr, "All");



    });
  });