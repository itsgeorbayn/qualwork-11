var map = L.map("map").setView([49.0, 31.0], 6);
var tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 12,
        attribution:'© <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | © <a target="_blank" href="https://www.saveecobot.com/">SaveEcoBot</a> contributors',
    },
).addTo(map);

function today() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

document.getElementById('dateId').value = today();

function pascalConvert(value) {
    return Math.abs(value * 0.7518 - 760 > 10 ? "red" : "green");
}

function getColorHex(value, type) {
    switch (type) {
        case "humidity": {
            if ((value >= 0 && value <= 10) || (value >= 90 && value <= 100)) {
                return "#FFA500";
            } else if (
                (value >= 10 && value <= 20) ||
                (value >= 80 && value < 90)
            ) {
                return "#FFD700";
            } else if (
                (value >= 20 && value <= 30) ||
                (value >= 70 && value < 80)
            ) {
                return "#FFFF00";
            } else if (
                (value >= 30 && value <= 40) ||
                (value >= 60 && value < 70)
            ) {
                return "#ADFF2F";
            } else if (value >= 40 && value <= 60) {
                return "#02a302";
            } else {
                return "#808080";
            }
        }

        case "PM10": {
            if (value < 54) return "#02a302";
            else if (value < 154) return "#ADFF2F";
            else if (value < 254) return "#FFFF00";
            else if (value < 354) return "#FFD700";
            else if (value < 424) return "#FFA500";
            else if (value >= 424) return "tomato";
            else return "#808080";
        }

        case "PM2n5": {
            if (value < 12) return "#02a302";
            else if (value < 35) return "#ADFF2F";
            else if (value < 55) return "#FFFF00";
            else if (value < 150) return "#FFD700";
            else if (value < 250) return "#FFA500";
            else if (value >= 250) return "tomato";
            else return "#808080";
        }

        case "Pressure": {
            if (typeof value == "number") {
                var num = Math.abs(value * 0.7518 - 760);
                if (num < 5) {
                    return "#02a302";
                } else if (num < 10) {
                    return "#ADFF2F";
                } else if (num < 15) {
                    return "#FFFF00";
                } else if (num < 20) {
                    return "#FFD700";
                } else if (num < 25) {
                    return "#FFA500";
                } else if (num > 25) {
                    return "tomato";
                }
            } else return "gray";
        }

        case "Temperature": {
            if (Math.abs(value) >= 50) {
                return "gray";
            } else if (value < -40) {
                return "#3c5ad6";
            } else if (value < -30) {
                return "#627be3";
            } else if (value < -20) {
                return "#7c92eb";
            } else if (value < -10) {
                return "#a1b0f0";
            } else if (value < 0) {
                return "#b7c1e8";
            } else if (value < 10) {
                return "#aeeba9";
            } else if (value < 20) {
                return "#52f046";
            } else if (value < 30) {
                return "#d9f046";
            } else if (value < 40) {
                return "#f0a946";
            } else if (value < 50) {
                return "#f05746";
            }
        }

        case "AirQualityIndex": {
            if (value < 54) return "#02a302";
            else if (value < 154) return "#ADFF2F";
            else if (value < 254) return "#FFFF00";
            else if (value < 354) return "#FFD700";
            else if (value < 424) return "#FFA500";
            else return "#808080";
        }
    }
}

fetch('coords.json').then(response => response.json()).then(data => {
    var polygon1 = L.polygon(data.bounds1, {
        color: '#00008b',
        weight: 2,
        opacity: 0,
        fillOpacity: 0.1,
      }).addTo(map);    
    var polygon2 = L.polygon(data.bounds2, {
        color: '#ff7b00',
        weight: 2,
        opacity: 0,
        fillOpacity: 0.1,
    }).addTo(map);
}).catch(error => console.error('Помилка завантаження JSON:', error));

function getInfo() {
    var selectedRadio = document.querySelector(".radio-input input:checked");

    if (selectedRadio) {
        var value = selectedRadio.value;
        console.log("Обрана кнопка:", value);
    } else {
        console.log("Кнопка не обрана.");
    }

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    fetch("jsonfiles\\" + document.getElementById('dateId').value + ".json").then((response) => response.json()).then((data) => {
        data.forEach((point) => {
            if (selectedRadio.value === "value-1" && isNaN(point.humidity) || (selectedRadio.value === "value-1" && (point.humidity <= 0 || point.humidity >= 100))) return;
            if (selectedRadio.value === "value-2" && isNaN(point.PM10) || (selectedRadio.value === "value-2" && point.PM10 >= 424)) return;
            if (selectedRadio.value === "value-3" && isNaN(point.PM2n5) || (selectedRadio.value === "value-3" && point.PM2n5 >= 250)) return;
            if (selectedRadio.value === "value-4" && isNaN(point.Pressure)) return;
            if (selectedRadio.value === "value-5" && isNaN(point.Temperature) || (selectedRadio.value === "value-5" && Math.abs(point.Temperature) >= 50)) return;  
            if (selectedRadio.value === "value-6" && isNaN(point.AirQualityIndex)) return;  
            
            function getColor(value) {
                switch (value) {
                    case "value-1":
                        return getColorHex(point.humidity, "humidity");
                    case "value-2":
                        return getColorHex(point.PM10, "PM10");
                    case "value-3":
                        return getColorHex(point.PM2n5, "PM2n5");
                    case "value-4":
                        return getColorHex(point.Pressure, "Pressure");
                    case "value-5":
                        return getColorHex(
                            point.Temperature,
                            "Temperature",
                        );
                    case "value-6":
                        return getColorHex(
                            point.AirQualityIndex,
                            "AirQualityIndex",
                        );
                    default:
                        return "blue";
                }
            }
            var textTemplate = `Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>Місто: ${point.cityName}<br>Вулиця: ${point.stationName}<br>Локація: (${point.latitude}; ${point.longitude})<br><hr>`;
            switch (selectedRadio.value) {
                case "value-1":
                    textTemplate += `Вологість: ${point.humidity}%`;
                    break;
                case "value-2":
                    textTemplate += `PM10: ${point.PM10} мкг/м3`;
                    break;
                case "value-3":
                    textTemplate += `PM2.5: ${point.PM2n5} мкг/м3`;
                    break;
                case "value-4":
                    textTemplate += `Тиск: ${Math.round(Math.abs(point.Pressure / 1.33))} мм. рт. ст.`;
                    break;
                case "value-5":
                    textTemplate += `Температура: ${point.Temperature} °C`;
                    break;
                case "value-6":
                    textTemplate += `Індекс якості повітря: ${point.AirQualityIndex} aqi`;
                    break;
                case "value-7":
                    textTemplate += `Вологість: ${point.humidity}%<br>PM10: ${point.PM10} мкг/м3<br>PM2.5: ${point.PM2n5} мкг/м3<br>Тиск: ${Math.round(Math.abs(point.Pressure / 1.33))} мм. рт. ст.<br>Температура: ${point.Temperature} °C  <br>Індекс якості повітря: ${point.AirQualityIndex} aqi`;
                    break;
            }
            textTemplate += `<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a>`

            var customIcon = L.divIcon({
                html: '<svg id="circle-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill=' + getColor(selectedRadio.value) + ' viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="black" stroke-width="1  "/></svg>',
                className: "custom-icon",
                iconSize: [32, 32],
            });

            var marker = L.marker([point.latitude, point.longitude], {
                title: "Натисни на мене :3",
                icon: customIcon,
            });

            marker.bindPopup(textTemplate);
            marker.addTo(map);
        });
    }).catch((error) => console.error("Помилка завантаження JSON: ", error));
    map.invalidateSize();

    var legendElement = document.getElementById("legend"), legendContent = "";
    switch (selectedRadio.value) {
        case "value-1":
            legendContent =
                "Легенда для вологості (%)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-ideal">  <span class="legend-settings-box-info">Ідеальний</span><span class="legend-settings-box-index">40-60</span></span>' +
                '<span class="legend-settings-good">   <span class="legend-settings-box-info">Задовільний</span><span class="legend-settings-box-index">30-40|60-70</span></span>' +
                '<span class="legend-settings-normal"> <span class="legend-settings-box-info">Нормальний</span><span class="legend-settings-box-index">20-30|70-80</span></span>' +
                '<span class="legend-settings-higher"> <span class="legend-settings-box-info">Підвищений</span><span class="legend-settings-box-index">10-20|80-90</span></span>' +
                '<span class="legend-settings-danger"> <span class="legend-settings-box-info">Небезпечний</span><span class="legend-settings-box-index">0-10|90-100</span></span>' +
                "</div>";
            break;
        case "value-2":
            legendContent =
                "Легенда для PM10 (мкг/м3)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-ideal">  <span class="legend-settings-box-info">Ідеальний</span><span class="legend-settings-box-index">0-54</span></span>' +
                '<span class="legend-settings-good">   <span class="legend-settings-box-info">Задовільний</span><span class="legend-settings-box-index">54-154</span></span>' +
                '<span class="legend-settings-normal"> <span class="legend-settings-box-info">Нормальний</span><span class="legend-settings-box-index">154-254</span></span>' +
                '<span class="legend-settings-higher"> <span class="legend-settings-box-info">Загрозливий для груп ризику</span><span class="legend-settings-box-index">254-354</span></span>' +
                '<span class="legend-settings-danger"> <span class="legend-settings-box-info">Підвищений</span><span class="legend-settings-box-index">354-424</span></span>' +
                '<span class="legend-settings-bad"> <span class="legend-settings-box-info">Небезпечний</span><span class="legend-settings-box-index">424+</span></span>' +
                "</div>";
            break;
        case "value-3":
            legendContent =
                "Легенда для PM2.5 (мкг/м3)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-ideal">  <span class="legend-settings-box-info">Ідеальний</span><span class="legend-settings-box-index">0-12</span></span>' +
                '<span class="legend-settings-good">   <span class="legend-settings-box-info">Задовільний</span><span class="legend-settings-box-index">12-35</span></span>' +
                '<span class="legend-settings-normal"> <span class="legend-settings-box-info">Нормальний</span><span class="legend-settings-box-index">35-55</span></span>' +
                '<span class="legend-settings-higher"> <span class="legend-settings-box-info">Загрозливий для груп ризику</span><span class="legend-settings-box-index">55-150</span></span>' +
                '<span class="legend-settings-danger"> <span class="legend-settings-box-info">Підвищений</span><span class="legend-settings-box-index">150-250</span></span>' +
                '<span class="legend-settings-bad"> <span class="legend-settings-box-info">Небезпечний</span><span class="legend-settings-box-index">250+</span></span>' +
                "</div>";
            break;
        case "value-4":
            legendContent =
                "Легенда для Тиску (мм. рт. ст.)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-ideal">  <span class="legend-settings-box-info">Ідеальний</span><span class="legend-settings-box-index">755-765</span></span>' +
                '<span class="legend-settings-good">   <span class="legend-settings-box-info">Задовільний</span><span class="legend-settings-box-index">750-770</span></span>' +
                '<span class="legend-settings-normal"> <span class="legend-settings-box-info">Нормальний</span><span class="legend-settings-box-index">745-775</span></span>' +
                '<span class="legend-settings-higher"> <span class="legend-settings-box-info">Загрозливий для груп ризику</span><span class="legend-settings-box-index">740-780</span></span>' +
                '<span class="legend-settings-danger"> <span class="legend-settings-box-info">Підвищений</span><span class="legend-settings-box-index">725-785</span></span>' +
                '<span class="legend-settings-bad"> <span class="legend-settings-box-info">Небезпечний</span><span class="legend-settings-box-index"><725 або >785</span></span>' +
                "</div>";
            break;
        case "value-5":
            legendContent =
                "Легенда для Температури (°C)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-freezing"><span class="legend-settings-box-info">Крижано</span><span class="legend-settings-box-index">-50 — -40</span></span>' +
                '<span class="legend-settings-coldest">  <span class="legend-settings-box-info">Дуже холодно</span><span class="legend-settings-box-index">-40 — -30</span></span>' +
                '<span class="legend-settings-colder">   <span class="legend-settings-box-info">Морозно</span><span class="legend-settings-box-index">-30 — -20</span></span>' +
                '<span class="legend-settings-cold"> <span class="legend-settings-box-info">Холодно</span><span class="legend-settings-box-index">-20 — -10</span></span>' +
                '<span class="legend-settings-underzero"> <span class="legend-settings-box-info">Прохолодно </span><span class="legend-settings-box-index">-10 — 0</span></span>' +
                '<span class="legend-settings-upperzero"> <span class="legend-settings-box-info">Нормально</span><span class="legend-settings-box-index">0 — 10  </span></span>' +
                '<span class="legend-settings-cool"> <span class="legend-settings-box-info">Тепло</span><span class="legend-settings-box-index">10 — 20</span></span>' +
                '<span class="legend-settings-warm"> <span class="legend-settings-box-info">Дуже тепло</span><span class="legend-settings-box-index">20 — 30</span></span>' +
                '<span class="legend-settings-hot"> <span class="legend-settings-box-info">Жарко</span><span class="legend-settings-box-index">30 — 40</span></span>' +
                '<span class="legend-settings-boiling"> <span class="legend-settings-box-info">Спекотно</span><span class="legend-settings-box-index">40 — 50</span></span>' +
                "</div>";
            break;
        case "value-6":
            legendContent =
                "Легенда для Якості повітря (aqi)" +
                '<div class="legend" style="width: 100%;">' +
                '<span class="legend-settings-unknown"><span class="legend-settings-box-info">Не вистачає даних</span></span>' +
                '<span class="legend-settings-ideal">  <span class="legend-settings-box-info">Ідеальний</span><span class="legend-settings-box-index">0-54</span></span>' +
                '<span class="legend-settings-good">   <span class="legend-settings-box-info">Задовільний</span><span class="legend-settings-box-index">54-154</span></span>' +
                '<span class="legend-settings-normal"> <span class="legend-settings-box-info">Нормальний</span><span class="legend-settings-box-index">154-254</span></span>' +
                '<span class="legend-settings-higher"> <span class="legend-settings-box-info">Підвищений</span><span class="legend-settings-box-index">254-354</span></span>' +
                '<span class="legend-settings-danger"> <span class="legend-settings-box-info">Небезпечний</span><span class="legend-settings-box-index">354-424</span></span>' +
                "</div>";
            break;
        default:
            legendContent = "Для цієї мапи нема легенди.";
    }
    legendElement.innerHTML = legendContent;
}

map.on('click', function(e) {
    var selectedRadio = document.querySelector(".radio-input input:checked");
    
    if (selectedRadio !== null) {    
        fetch("jsonfiles\\" + document.getElementById('dateId').value + ".json").then((response) => response.json()).then((datan) => {
            fetch('reaction.json').then(response => response.json()).then(data => {
                var distance = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity], index = ["", "", "", "", "", ""], values = [0, 0, 0, 0, 0, 0], com = ["", "", "", "", "", ""], isChecker = [false, false, false, false, false, false],  dim = ["%", " мкг/м3", " мкг/м3", " мм. рт. ст.", " °C", " aqi"];

                datan.forEach((point) => {
                    var tempDistance = Math.sqrt(Math.pow(point.latitude - e.latlng.lat, 2) + Math.pow(point.longitude - e.latlng.lng, 2));
                    if (selectedRadio.value === "value-1" && tempDistance < distance[0] && !isNaN(point.humidity) && point.humidity > 0 && point.humidity < 100){
                        distance[0] = tempDistance;
                        index[0] = point.id;
                        values[0] = point.humidity;
                        isChecker[0] = true;

                        if (values[0] < 10 && values[0] > 0) com[0] = data.humidity.range1;
                        else if (values[0] < 20) com[0] = data.humidity.range2;
                        else if (values[0] < 30) com[0] = data.humidity.range3;
                        else if (values[0] < 40) com[0] = data.humidity.range4;
                        else if (values[0] < 50) com[0] = data.humidity.range5;
                        else if (values[0] < 60) com[0] = data.humidity.range6;
                        else if (values[0] < 70) com[0] = data.humidity.range7;
                        else if (values[0] < 80) com[0] = data.humidity.range8;
                        else if (values[0] < 90) com[0] = data.humidity.range9;
                        else if (values[0] < 100) com[0] = data.humidity.range10;
                    }
                    else if (selectedRadio.value === "value-2" && tempDistance < distance[1] && !isNaN(point.PM10) && point.PM10 > 0 && point.PM10 < 424){
                        distance[1] = tempDistance;
                        index[1] = point.id;
                        values[1] = point.PM10;
                        isChecker[1] = true;
                        
                        if (point.PM10 < 54) com[1] = data.PM10.range1;
                        else if (point.PM10 < 154) com[1] = data.PM10.range2;
                        else if (point.PM10 < 254) com[1] = data.PM10.range3;
                        else if (point.PM10 < 354) com[1] = data.PM10.range4;
                        else if (point.PM10 < 424) com[1] = data.PM10.range5;
                        else if (point.PM10 >= 424) com[1] = data.PM10.range6;
                        else com[1] = data.PM10.rangex;
                    }
                    else if (selectedRadio.value === "value-3" && tempDistance < distance[2] && !isNaN(point.PM2n5) && point.PM10 > 0 && point.PM10 < 250){
                        distance[2] = tempDistance;
                        index[2] = point.id;
                        values[2] = point.PM2n5;
                        isChecker[2] = true;
                        
                        if (values[2] < 12) com[2] = data.PM2n5.range1;
                        else if (values[2] < 35) com[2] = data.PM2n5.range2;
                        else if (values[2] < 55) com[2] = data.PM2n5.range3;
                        else if (values[2] < 150) com[2] = data.PM2n5.range4;
                        else if (values[2] < 250) com[2] = data.PM2n5.range5;
                        else if (values[2] >= 250) com[2] = data.PM2n5.range6;
                        else return com[2] = data.PM2n5.rangex;
                    }
                    else if (selectedRadio.value === "value-4" && tempDistance < distance[3] && !isNaN(point.Pressure)){
                        distance[3] = tempDistance;
                        index[3] = point.id;
                        values[3] = Math.round(Math.abs(point.Pressure * 0.7518))
                        isChecker[3] = true;
                    
                        if (typeof values[3] == "number") {
                            if (values[3] < 5) com[3] = data.Pressure.range1;
                            else if (values[3] < 10) com[3] = data.Pressure.range2;
                            else if (values[3] < 15) com[3] = data.Pressure.range3;
                            else if (values[3] < 20) com[3] = data.Pressure.range4;
                            else if (values[3] < 25) com[3] = data.Pressure.range5;
                            else if (values[3] > 25) com[3] = data.Pressure.range6;
                        } else com[3] = data.Pressure.rangex;
                        
                        if (typeof values[3] == "number") {
                            var num = Math.abs(values[3] - 760);
                            if (num < 5) com[3] = data.Pressure.range1;
                            else if (num < 10) com[3] = data.Pressure.range2;
                            else if (num < 15) com[3] = data.Pressure.range3;
                            else if (num < 20) com[3] = data.Pressure.range4;
                            else if (num < 25) com[3] = data.Pressure.range5;
                            else if (num > 25) com[3] = data.Pressure.range6;
                            
                        } else com[3] = data.Pressure.rangex;
                    }
                    else if (selectedRadio.value === "value-5" && tempDistance < distance[4] && !isNaN(point.Temperature) && Math.abs(point.Temperature) < 50){
                        distance[4] = tempDistance;
                        index[4] = point.id;
                        values[4] = point.Temperature;
                        isChecker[4] = true;

                        if (Math.abs(values[4]) >= 50) com[4] = data.Temperature.rangex;
                        else if (values[4] < -40) com[4] = data.Temperature.range1;
                        else if (values[4] < -30) com[4] = data.Temperature.range2;
                        else if (values[4] < -20) com[4] = data.Temperature.range3;
                        else if (values[4] < -10) com[4] = data.Temperature.range4;
                        else if (values[4] < 0) com[4] = data.Temperature.range5;
                        else if (values[4] < 10) com[4] = data.Temperature.range6;
                        else if (values[4] < 20) com[4] = data.Temperature.range7;
                        else if (values[4] < 30) com[4] = data.Temperature.range8;
                        else if (values[4] < 40) com[4] = data.Temperature.range9;
                        else if (values[4] < 50) com[4] = data.Temperature.range10;
                    }
                    else if (selectedRadio.value === "value-6" && tempDistance < distance[5] && !isNaN(point.AirQualityIndex) && point.AirQualityIndex > 0 && point.AirQualityIndex < 424){
                        distance[5] = tempDistance;
                        index[5] = point.id;
                        values[5] = point.AirQualityIndex;
                        isChecker[5] = true;
                        
                        if (values[5] < 54) com[5] = data.AirQualityIndex.range1;
                        else if (values[5] < 154) com[5] = data.AirQualityIndex.range2;
                        else if (values[5] < 254) com[5] = data.AirQualityIndex.range3;
                        else if (values[5] < 354) com[5] = data.AirQualityIndex.range4;
                        else if (values[5] < 424) com[5] = data.AirQualityIndex.range5;
                        else com[5] = data.AirQualityIndex.rangex;
                    }
                    else if (selectedRadio.value === "value-7"){
                        isChecker = [true, true, true, true, true, true]
                        if (tempDistance < distance[0] && !isNaN(point.humidity) && point.humidity > 0 && point.humidity < 100){
                            distance[0] = tempDistance;
                            index[0] = point.id;
                            values[0] = point.humidity;

                            if (values[0] < 10 && values[0] > 0) com[0] = data.humidity.range1;
                            else if (values[0] < 20) com[0] = data.humidity.range2;
                            else if (values[0] < 30) com[0] = data.humidity.range3;
                            else if (values[0] < 40) com[0] = data.humidity.range4;
                            else if (values[0] < 50) com[0] = data.humidity.range5;
                            else if (values[0] < 60) com[0] = data.humidity.range6;
                            else if (values[0] < 70) com[0] = data.humidity.range7;
                            else if (values[0] < 80) com[0] = data.humidity.range8;
                            else if (values[0] < 90) com[0] = data.humidity.range9;
                            else if (values[0] < 100) com[0] = data.humidity.range10;
                        }
                        if (tempDistance < distance[1] && !isNaN(point.PM10) && point.PM10 > 0 && point.PM10 < 424){
                            distance[1] = tempDistance;
                            index[1] = point.id;
                            values[1] = point.PM10;
                            
                            if (values[1] < 54) com[1] = data.PM10.range1;
                            else if (values[1] < 154) com[1] = data.PM10.range2;
                            else if (values[1] < 254) com[1] = data.PM10.range3;
                            else if (values[1] < 354) com[1] = data.PM10.range4;
                            else if (values[1] < 424) com[1] = data.PM10.range5;
                            else if (values[1] >= 424) com[1] = data.PM10.range6;
                            else com[1] = data.PM10.rangex;
                        }
                        if (tempDistance < distance[2] && !isNaN(point.PM2n5) && point.PM10 > 0 && point.PM10 < 250){
                            distance[2] = tempDistance;
                            index[2] = point.id;
                            values[2] = point.PM2n5;

                            if (values[2] < 12) com[2] = data.PM2n5.range1;
                            else if (values[2] < 35) com[2] = data.PM2n5.range2;
                            else if (values[2] < 55) com[2] = data.PM2n5.range3;
                            else if (values[2] < 150) com[2] = data.PM2n5.range4;
                            else if (values[2] < 250) com[2] = data.PM2n5.range5;
                            else if (values[2] >= 250) com[2] = data.PM2n5.range6;
                            else return com[2] = data.PM2n5.rangex;
                        }
                        if (tempDistance < distance[3] && !isNaN(point.Pressure)){
                            distance[3] = tempDistance;
                            index[3] = point.id;
                            values[3] = Math.round(Math.abs(point.Pressure * 0.7518));
                        
                            if (typeof values[3] == "number") {
                                if (values[3] < 5) com[3] = data.Pressure.range1;
                                else if (values[3] < 10) com[3] = data.Pressure.range2;
                                else if (values[3] < 15) com[3] = data.Pressure.range3;
                                else if (values[3] < 20) com[3] = data.Pressure.range4;
                                else if (values[3] < 25) com[3] = data.Pressure.range5;
                                else if (values[3] > 25) com[3] = data.Pressure.range6;
                            } else com[3] = data.Pressure.rangex;
                        }
                        if (tempDistance < distance[4] && !isNaN(point.Temperature) && Math.abs(point.Temperature) < 50){
                            distance[4] = tempDistance;
                            index[4] = point.id;
                            values[4] = point.Temperature;
                            
                            if (Math.abs(values[4]) >= 50) com[4] = data.Temperature.rangex;
                            else if (values[4] < -40) com[4] = data.Temperature.range1;
                            else if (values[4] < -30) com[4] = data.Temperature.range2;
                            else if (values[4] < -20) com[4] = data.Temperature.range3;
                            else if (values[4] < -10) com[4] = data.Temperature.range4;
                            else if (values[4] < 0) com[4] = data.Temperature.range5;
                            else if (values[4] < 10) com[4] = data.Temperature.range6;
                            else if (values[4] < 20) com[4] = data.Temperature.range7;
                            else if (values[4] < 30) com[4] = data.Temperature.range8;
                            else if (values[4] < 40) com[4] = data.Temperature.range9;
                            else if (values[4] < 50) com[4] = data.Temperature.range10;
                        }
                        if (tempDistance < distance[5] && !isNaN(point.AirQualityIndex) && point.AirQualityIndex > 0 && point.AirQualityIndex < 424){
                            distance[5] = tempDistance;
                            index[5] = point.id;
                            values[5] = point.AirQualityIndex;

                            if (values[5] < 54) com[5] = data.AirQualityIndex.range1;
                            else if (values[5] < 154) com[5] = data.AirQualityIndex.range2;
                            else if (values[5] < 254) com[5] = data.AirQualityIndex.range3;
                            else if (values[5] < 354) com[5] = data.AirQualityIndex.range4;
                            else if (values[5] < 424) com[5] = data.AirQualityIndex.range5;
                            else com[5] = data.AirQualityIndex.rangex;
                        }
                    }
                }); 
                var output = `<span style='font-size: 20px; text-align: center;'>Ваші координати: (${Math.round(e.latlng.lat*100)/100}; ${Math.round(e.latlng.lng*100)/100})</span><br><hr>`;
                for(var i = 0; i < index.length; i++) {
                    if(isChecker[i]) output += `Станція №${index[i].replace(new RegExp("SAVEDNIPRO_", "g"), '')} має ${com[i]}<br>(${values[i]}${dim[i]})<br><hr>`
                }

                var customAlertContainer = document.getElementById("custom-alert");
                var customAlertMessage = document.getElementById("custom-alert-message");
                var customAlertButton = document.getElementById("custom-alert-button");

                customAlertMessage.innerHTML = output;
                customAlertContainer.style.display = "block";

                customAlertButton.addEventListener("click", function() {
                customAlertContainer.style.display = "none";
                });
            })
        }).catch((error) => console.error("Помилка завантаження JSON: ", error));   
    }
}); 

function showInfo() {
    var customAlertContainer = document.getElementById("custom-alert");
    var customAlertMessage = document.getElementById("custom-alert-message");
    var customAlertButton = document.getElementById("custom-alert-button");

    text = "Для того, щоб користуватися цією мапою, вам потрібно обрати потрібний вам показник повітря (також можна обрати відображення усіх показників), після чого ви побачите на мапі різнокольорові кружечки - натиснувши на них лівою кнопкою миші, ви дізнаєтеся на яку станцію ви натиснули, де вона знаходиться та яку інформацію вона зібрала для вас. Якщо ви хочете змінити режим відображення, достатньо натиснути на інший показник зверху. Справа знизу можна побачити легенду, на якій чітко пояснено, який колір відповідає своєму показнику. Також, натиснувши на пусте місце по карті лівою кнопкою миші, ви побачите інформацію з найближчої станції та отримаєте поради, що зробити, щоб убезпечити себе від різних загроз від повітря у цьому місці. Щоб змінити час, за який відображається інформація, достатньо змінити дату у нижній частині екрану.";
    
    customAlertMessage.innerHTML = text;
    customAlertContainer.style.display = "block";

    customAlertButton.addEventListener("click", function() {
    customAlertContainer.style.display = "none";
});
}
