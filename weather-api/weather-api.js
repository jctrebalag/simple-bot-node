const axios = require('axios');

var getWeather = async (location) => {
    // try {
        const encodedAddress = encodeURIComponent(location);
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
        const geometryLocation = await axios.get(geocodeUrl);

        if (geometryLocation.data.status === 'ZERO_RESULTS') {
                    throw new Error('Unable to find address');
                }

                var lat = geometryLocation.data.results[0].geometry.location.lat;
                var lng = geometryLocation.data.results[0].geometry.location.lng;
        const weatherUrl = `https://api.darksky.net/forecast/c85fc4e1e9abdd10c6a3b8ea1eae8aa9/${lat},${lng}?lang=fr&units=si`;
        const weather = await axios.get(weatherUrl);
        var temperature = weather.data.currently.temperature;
        var apparentTemp = weather.data.currently.apparentTemperature;
        return `It's currently ${temperature}°C. It feels like ${apparentTemp}°C.`;

    // } catch(e) {
    //     if (e.code === 'ENOTFOUND') {
    //         return 'Unable to connect to API.';
    //     } else {
    //         return e.message;
    //     }
    // }

};


module.exports = {getWeather};
