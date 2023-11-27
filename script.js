const startDate = new Date(2023, 10, 1), currentDate = new Date(), dateSelect = document.getElementById('dateSelect'), fileDates = [], dataArray = [], dateArray = generateDateArray(startDate, currentDate);
var dim = ["%", " мкг/м3", " мкг/м3", " мм. рт. ст.", " °C", " aqi"], names = ["вологості", "PM10", "PM2.5", "тиску", "температури", "індексу якості повітря"], fullnames = ["Вологість", "PM10", "PM2.5", "Тиск", "Температура", "Індекс якості повітря"];

var doesClick = false;
function generateDateArray(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

dateArray.forEach(date => {
    var formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    fileDates.push(formattedDate)
});

async function fetchData(fileDate) {
  const fileUrl = `jsonfiles/${fileDate}.json`;
  try {
    const response = await fetch(fileUrl);
    const data = await response.json();
    dataArray.push(data);
  } catch (error) {
    console.error(`Помилка при отриманні даних: ${fileUrl}: ${error.message}`);
  }
}

async function processFiles() {
  for (const fileDate of fileDates) {
    await fetchData(fileDate);
  }

  return dataArray;
}

while (startDate <= currentDate) {
    const formattedDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    
    const option = document.createElement('option');
    option.value = formattedDate;
    option.text = formattedDate;
  
    dateSelect.add(option);
  
    startDate.setDate(startDate.getDate() + 1);
  }

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

document.getElementById('dateSelect').value = today();

function pascalConvert(value) {
    return Math.abs(value * 0.7518 - 760 > 10 ? "red" : "green");
}

var image = "";
var altimage = "";
function getColorHex(value, type, boolean) {
    switch (type) {
        case "humidity": {
            if (value >= 40 && value <= 60) {
                return boolean ? "#02a302" : "1";
            }
            else if ((value >= 30 && value <= 40) || (value >= 60 && value < 70)) {
                return boolean ? "#ADFF2F" : "2";
            } 
            else if ((value >= 20 && value <= 30) || (value >= 70 && value < 80)) {
                return boolean ? "#FFFF00" : "3";
            } 
            else if ((value >= 10 && value <= 20) || (value >= 80 && value < 90)) {
                return boolean ? "#FFD700" : "4";
            } 
            else if ((value >= 0 && value <= 10) || (value >= 90 && value <= 100)) {
                return boolean ? "#FFA500" : "5";
            } 
            else {
                return boolean ? "#808080" : "0";
            }
        }

        case "PM10": {
            if (value < 54) {
                return boolean ? "#02a302" : "1";
            }
            else if (value < 154) {
                return boolean ? "#ADFF2F" : "2";
            }
            else if (value < 254) {
                return boolean ? "#FFFF00" : "3";
            }
            else if (value < 354) {
                return boolean ? "#FFD700" : "4";
            }
            else if (value < 424) {
                return boolean ? "#FFA500" : "4";
            }
            else if (value >= 424) {
                return boolean ? "tomato" : "5";
            }
            else {
                return boolean ? "#808080" : "0";
            }
        }

        case "PM2n5": {
            if (value < 12) {
                return boolean ? "#02a302" : "1";
            }
            else if (value < 35) {
                return boolean ? "#ADFF2F" : "2";
            }
            else if (value < 55) {
                return boolean ? "#FFFF00" : "3";
            }
            else if (value < 150) {
                return boolean ? "#FFD700" : "4";
            }
            else if (value < 250) {
                return boolean ? "#FFA500" : "4";
            }
            else if (value >= 250) {
                return boolean ? "tomato" : "5";
            }
            else {
                return boolean ? "#808080" : "0";
            }
        }

        case "Pressure": {
            if (typeof value == "number") {
                var num = Math.abs(value * 0.7518 - 760);
                if (num < 5) {
                    return boolean ? "#02a302" : "1";
                } else if (num < 10) {
                    return boolean ? "#ADFF2F" : "1";
                } else if (num < 15) {
                    return boolean ? "#FFFF00" : "2";
                } else if (num < 20) {
                    return boolean ? "#FFD700" : "3";
                } else if (num < 25) {
                    return boolean ? "#FFA500" : "4";
                } else if (num > 25) {
                    return boolean ? "tomato" : "5";
                }
            } 
            else {
                return boolean ? "gray" : "0";
            }
        }

        case "Temperature": {
            if (Math.abs(value) >= 50) {
                return boolean ? "gray" : "0";
            } else if (value < -40) {
                return boolean ? "#3c5ad6" : "4";
            } else if (value < -30) {
                return boolean ? "#627be3" : "3";
            } else if (value < -20) {
                return boolean ? "#7c92eb" : "2";
            } else if (value < -10) {
                return boolean ? "#a1b0f0" : "1";
            } else if (value < 0) {
                return boolean ? "#b7c1e8" : "1";
            } else if (value < 10) {
                return boolean ? "#aeeba9" : "1";
            } else if (value < 20) {
                return boolean ? "#52f046" : "1";
            } else if (value < 30) {
                return boolean ? "#d9f046" : "2";
            } else if (value < 40) {
                return boolean ? "#f0a946" : "3";
            } else if (value < 50) {
                return boolean ? "#f05746" : "4";
            }
        }

        case "AirQualityIndex": {
            if (value < 54) {
                image = "0";
                return boolean ? "#02a302" : "1";
            }
            else if (value < 154) {
                image = "1";
                return boolean ? "#ADFF2F" : "2";
            }
            else if (value < 254) {
                image = "2";
                return boolean ? "#FFFF00" : "3";
            }
            else if (value < 354) {
                image = "3";
                return boolean ? "#FFD700" : "3";
            }
            else if (value < 424) {
                image = "4";
                return boolean ? "#FFA500" : "4";
            }
            else  {
                image = "0";
                return boolean ? "#808080" : "0";
            }
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
    fetch("jsonfiles\\" + document.getElementById('dateSelect').value + ".json").then((response) => response.json()).then((data) => {
        const moreValueInput = document.getElementById('moreValue');
        const lessValueInput = document.getElementById('lessValue');
        const minSpan = document.getElementById('min');
        const minStationSpan = document.getElementById('minStation');
        const maxSpan = document.getElementById('max');
        const maxStationSpan = document.getElementById('maxStation');
        const averageSpan = document.getElementById('average');
        var min = Infinity, max = 0, sum = 0, count = 0, number = 0;
        var minStation = 0, maxStation = 0;

        data.forEach((point) => {
            if (selectedRadio.value === "humidity") { sum += point.humidity; count++; number = 0 }
            if (selectedRadio.value === "PM10") { sum += point.PM10; count++; number = 1 }
            if (selectedRadio.value === "PM2n5") { sum += point.PM2n5; count++; number = 2 }
            if (selectedRadio.value === "Pressure") { sum += point.Pressure; count++; number = 3 }
            if (selectedRadio.value === "Temperature") { sum += point.Temperature; count++; number = 4 }
            if (selectedRadio.value === "AirQualityIndex") { sum += point.AirQualityIndex; count++; number = 5 }
            
            if (selectedRadio.value === "humidity" && point.humidity < min) {min = point.humidity; minStation = point.localId}
            if (selectedRadio.value === "humidity" && point.humidity > max) {max = point.humidity; maxStation = point.localId}
            if (selectedRadio.value === "PM10" && point.PM10 < min) {min = point.PM10; minStation = point.localId}
            if (selectedRadio.value === "PM10" && point.PM10 > max) {max = point.PM10; maxStation = point.localId}
            if (selectedRadio.value === "PM2n5" && point.PM2n5 < min) {min = point.PM2n5; minStation = point.localId}
            if (selectedRadio.value === "PM2n5" && point.PM2n5 > max) {max = point.PM2n5; maxStation = point.localId}
            if (selectedRadio.value === "Pressure" && point.Pressure < min) {min = point.Pressure; minStation = point.localId}
            if (selectedRadio.value === "Pressure" && point.Pressure > max) {max = point.Pressure; maxStation = point.localId}
            if (selectedRadio.value === "Temperature" && point.Temperature < min) {min = point.Temperature; minStation = point.localId}
            if (selectedRadio.value === "Temperature" && point.Temperature > max) {max = point.Temperature; maxStation = point.localId}
            if (selectedRadio.value === "AirQualityIndex" && point.AirQualityIndex < min) {min = point.AirQualityIndex; minStation = point.localId}
            if (selectedRadio.value === "AirQualityIndex" && point.AirQualityIndex > max) {max = point.AirQualityIndex; maxStation = point.localId}
            
            if ((selectedRadio.value === "humidity" && isNaN(point.humidity)) || (selectedRadio.value === "humidity" && (point.humidity <= 0 || point.humidity >= 100)) || (selectedRadio.value === "humidity" && (point.humidity > lessValueInput.value || point.humidity < moreValueInput.value ))) return;
            else if ((selectedRadio.value === "PM10" && isNaN(point.PM10)) || (selectedRadio.value === "PM10" && point.PM10 >= 424) || (selectedRadio.value === "PM10" && (point.PM10 > lessValueInput.value || point.PM10 < moreValueInput.value ))) return;
            else if ((selectedRadio.value === "PM2n5" && isNaN(point.PM2n5)) || (selectedRadio.value === "PM2n5" && point.PM2n5 >= 250) || (selectedRadio.value === "PM2n5" && (point.PM2n5 > lessValueInput.value || point.PM2n5 < moreValueInput.value ))) return;
            else if ((selectedRadio.value === "Pressure" && isNaN(point.Pressure)) || (selectedRadio.value === "Pressure" && (point.Pressure > lessValueInput.value*1.33 || point.Pressure < moreValueInput.value*1.33 ))) return;
            else if ((selectedRadio.value === "Temperature" && isNaN(point.Temperature)) || (selectedRadio.value === "Temperature" && Math.abs(point.Temperature) >= 50) || (selectedRadio.value === "Temperature" && (point.Temperature > lessValueInput.value || point.Temperature < moreValueInput.value ))) return;  
            else if ((selectedRadio.value === "AirQualityIndex" && isNaN(point.AirQualityIndex)) || (selectedRadio.value === "AirQualityIndex" && (point.AirQualityIndex > lessValueInput.value || point.AirQualityIndex < moreValueInput.value ))) return;  

            function getColor(value) {
                switch (value) {
                    case "humidity":
                        return getColorHex(point.humidity, "humidity", true);
                    case "PM10":
                        return getColorHex(point.PM10, "PM10", true);
                    case "PM2n5":
                        return getColorHex(point.PM2n5, "PM2n5", true);
                    case "Pressure":
                        return getColorHex(point.Pressure, "Pressure", true);
                    case "Temperature":
                        return getColorHex(point.Temperature, "Temperature", true);
                    case "AirQualityIndex":
                        return getColorHex(point.AirQualityIndex, "AirQualityIndex", true);
                    default:
                        return "blue";
                }
            }
            var customIcon = L.divIcon({
                html: '<svg id="circle-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill=' + getColor(selectedRadio.value) + ' viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="black" stroke-width="1  "/></svg>',
                className: "custom-icon",
                iconSize: [32, 32],
            });

            var marker = L.marker([point.latitude, point.longitude], {
                title: "Натисни на мене :3",
                icon: customIcon,
            });

            
            marker.on('mousedown', async function() {
                try {
                    var message = []; 
                    var messagehumidity = [], messagepm2n5 = [], messagepm10 = [], messagepressure = [], messagetemperature = [], messageairqualityindex = [];
                    const result = await processFiles();
                    for (var i = 0; i < fileDates.length; i++) {
                        switch(selectedRadio.value) {
                            case "humidity":{
                                message.push(result[i][point.localId].humidity);
                                break;
                            }
                            case "PM10":{
                                message.push(result[i][point.localId].PM10);
                                break;
                            }   
                            case "PM2n5":{
                                message.push(result[i][point.localId].PM2n5);
                                break;
                            }
                            case "Pressure":{
                                message.push(result[i][point.localId].Pressure/1.33);
                                break;
                            }
                            case "Temperature":{
                                message.push(result[i][point.localId].Temperature);
                                break;
                            }
                            case "AirQualityIndex":{
                                message.push(result[i][point.localId].AirQualityIndex);
                                break;
                            }
                            default:{
                                messagehumidity.push(result[i][point.localId].humidity);
                                messagepm2n5.push(result[i][point.localId].PM10);
                                messagepm10.push(result[i][point.localId].PM2n5);
                                messagepressure.push(result[i][point.localId].Pressure/1.33);
                                messagetemperature.push(result[i][point.localId].Temperature);
                                messageairqualityindex.push(result[i][point.localId].AirQualityIndex);
                                break;
                            }
                        }
                    }

                    var ctx = document.getElementById('myChart').getContext('2d');
                    var existingChart = Chart.getChart(ctx);
                    if (existingChart) {
                        existingChart.destroy();
                    }

                    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'orange');
                    gradient.addColorStop(0.5, 'green');
                    gradient.addColorStop(1, 'orange');

                    var myChart = new Chart(ctx, {
                      type: 'line',
                      data: {
                        labels: fileDates,
                        datasets: [{
                          label: `${fullnames[number]} (у ${dim[number].replace(" ", "")})`,
                          data: message,
                          borderColor: gradient,
                          borderWidth: 3,
                          fill: false,
                          backgroundColor: 'rgba(255, 255, 255, 1)'
                        }],
                      },
                      options: {
                        scales: {
                          x: {
                            type: 'category',
                            title: {
                              display: true,
                              text: `Графік відображення ${names[number]} (вимірюється у ${dim[number].replace(" ", "")})`
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: fullnames[number]
                            }
                          }
                      },
                      
                        elements: {
                            line: {
                            backgroundColor: 'rgba(255, 255, 255, 1)'
                         }
                       }
                     }
                    });
            
                    var textTemplate = ``;
                    switch (selectedRadio.value) {
                        case "humidity":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.humidity, "humidity", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>💦 Вологість: ${point.humidity}%<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік вологості' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "PM10":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.PM10, "PM10", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>PM10: ${point.PM10} мкг/м3<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік PM10' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "PM2n5":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.PM2n5, "PM2n5", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>PM2.5: ${point.PM2n5} мкг/м3<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік PM2.5' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "Pressure":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.Pressure, "Pressure", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>Тиск: ${Math.round(Math.abs(point.Pressure / 1.33))} мм. рт. ст.<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік тиску' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "Temperature":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.Temperature, "Temperature", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>Температура: ${point.Temperature} °C<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік температури' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "AirQualityIndex":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/${getColorHex(point.AirQualityIndex, "AirQualityIndex", false)}.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>Індекс якості повітря: ${point.AirQualityIndex} aqi<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div><input onclick='help()' value='Графік якості повітря' style='margin: 10px 3px 3px 3px; height: 30px; width: 100%' type='button'></input>`;
                            break;
                        case "AllValues":
                            textTemplate += `<div style="display: flex; align-items: center;"><div class="image-style" style="flex-shrink: 0; margin-right: 10px;"><img src="svg/0.png" alt="SVG Image" style="height: 114px"></div><div class="text-style" style="">#️⃣ Номер метеостанції: ${point.id.replace("SAVEDNIPRO_","",)}<br>🌇 Місто: ${point.cityName}<br>🏠 Вулиця: ${point.stationName}<hr>Вологість: ${point.humidity}%<br>PM10: ${point.PM10} мкг/м3<br>PM2.5: ${point.PM2n5} мкг/м3<br>Тиск: ${Math.round(Math.abs(point.Pressure / 1.33))} мм. рт. ст.<br>Температура: ${point.Temperature} °C  <br>Індекс якості повітря: ${point.AirQualityIndex} aqi<br>Джерело даних: <a id="colorwhite" target="_blank" href="https://www.saveecobot.com/">клік</a></div></div>`;
                            break;
                    }
        
                    marker.bindPopup(textTemplate).openPopup();;
                } catch (error) {
                    console.error("Виникла помилка: ", error)
                }
            });
            marker.addTo(map);

        });
        var filterCont = document.getElementById('filterContainer');
        var mapCont = document.getElementById('map');
        if(selectedRadio.value === "Pressure"){
            min = Math.round(min / 1.33);
            max = Math.round(max / 1.33);
            minSpan.innerHTML = `${min}${dim[number]}`;
            maxSpan.innerHTML = `${max}${dim[number]}`;
            minStationSpan.innerHTML = minStation;
            maxStationSpan.innerHTML = maxStation;
            averageSpan.innerHTML = `${Math.round((sum / count)*1000)/1000}${dim[number]}`;
            filterCont.style.opacity = 1;
            mapCont.style.margin = "0px 0px 0px 50px";
        }
        else if(selectedRadio.value !== "AllValues"){
            minSpan.innerHTML = `${min}${dim[number]}`;
            maxSpan.innerHTML = `${max}${dim[number]}`;
            minStationSpan.innerHTML = minStation;
            maxStationSpan.innerHTML = maxStation;
            averageSpan.innerHTML = `${Math.round((sum / count)*1000)/1000}${dim[number]}`;
            filterCont.style.opacity  = 1;
            mapCont.style.margin = "0px 0px 0px 50px";
        }
        else{
            minSpan.innerHTML = "Не знайдено";
            maxSpan.innerHTML = "Не знайдено";
            averageSpan.innerHTML = "Не знайдено";
            minStationSpan.innerHTML = "Не знайдено";
            maxStationSpan.innerHTML = "Не знайдено";
            filterCont.style.opacity  = 0;
            mapCont.style.margin = "0 auto";
            
        }
    }).catch((error) => console.error("Помилка завантаження JSON: ", error));
    
    map.invalidateSize();
    var legendElement = document.getElementById("legend"), legendContent = "";
    switch (selectedRadio.value) {
        case "humidity":
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
        case "PM10":
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
        case "PM2n5":
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
        case "Pressure":
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
        case "Temperature":
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
        case "AirQualityIndex":
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

function changeVariable() {
    doesClick = true;
}

map.on('click', function(e) {
    if (doesClick){
        var selectedRadio = document.querySelector(".radio-input input:checked");

        if (selectedRadio !== null) {    
            var distance = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity], index = ["", "", "", "", "", ""], values = [0, 0, 0, 0, 0, 0], com = ["", "", "", "", "", ""], isChecker = [false, false, false, false, false, false];
            fetch("jsonfiles\\" + document.getElementById('dateSelect').value + ".json").then((response) => response.json()).then((datan) => {
                fetch('reaction.json').then(response => response.json()).then(data => {
                   
                    datan.forEach((point) => {
                        var tempDistance = Math.sqrt(Math.pow(point.latitude - e.latlng.lat, 2) + Math.pow(point.longitude - e.latlng.lng, 2));
                        if (selectedRadio.value === "humidity" && tempDistance < distance[0] && !isNaN(point.humidity) && point.humidity > 0 && point.humidity < 100){
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
                        else if (selectedRadio.value === "PM10" && tempDistance < distance[1] && !isNaN(point.PM10) && point.PM10 > 0 && point.PM10 < 424){
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
                        else if (selectedRadio.value === "PM2n5" && tempDistance < distance[2] && !isNaN(point.PM2n5) && point.PM10 > 0 && point.PM10 < 250){
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
                        else if (selectedRadio.value === "Pressure" && tempDistance < distance[3] && !isNaN(point.Pressure)){
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
                        else if (selectedRadio.value === "Temperature" && tempDistance < distance[4] && !isNaN(point.Temperature) && Math.abs(point.Temperature) < 50){
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
                        else if (selectedRadio.value === "AirQualityIndex" && tempDistance < distance[5] && !isNaN(point.AirQualityIndex) && point.AirQualityIndex > 0 && point.AirQualityIndex < 424){
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
                        else if (selectedRadio.value === "AllValues"){
                            isChecker = [true, true, true, true, true, true]
                            if (tempDistance < distance[0] && !isNaN(point.humidity) && point.humidity > 0 && point.humidity < 100) {
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
                            else if (tempDistance < distance[1] && !isNaN(point.PM10) && point.PM10 > 0 && point.PM10 < 424) {
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
                            else if (tempDistance < distance[2] && !isNaN(point.PM2n5) && point.PM10 > 0 && point.PM10 < 250) {
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
                            else if (tempDistance < distance[3] && !isNaN(point.Pressure)) {
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
                            else if (tempDistance < distance[4] && !isNaN(point.Temperature) && Math.abs(point.Temperature) < 50) {
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
                            else if (tempDistance < distance[5] && !isNaN(point.AirQualityIndex) && point.AirQualityIndex > 0 && point.AirQualityIndex < 424) {
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
            doesClick = false;
        }    
    }
}); 

function showInfo() {
    var customAlertContainer = document.getElementById("custom-alert");
    var customAlertMessage = document.getElementById("custom-alert-message");
    var customAlertButton = document.getElementById("custom-alert-button");

    text = `Для того, щоб користуватися цією мапою, вам потрібно обрати потрібний вам показник повітря (також можна обрати відображення усіх показників), після чого ви побачите на мапі різнокольорові кружечки - натиснувши на них лівою кнопкою миші, ви дізнаєтеся на яку станцію ви натиснули, де вона знаходиться та яку інформацію вона зібрала для вас. Якщо ви хочете змінити режим відображення, достатньо натиснути на інший показник зверху. Справа знизу можна побачити легенду, на якій чітко пояснено, який колір відповідає своєму показнику. Також, ви можете побачити кнопку "Графік" у випливаючих підказках. Натиснувши на них, ви зможете побачити інформацію за минулі дні у форматі зручного графіка. На навігаційній панелі є кнопка "Поради". Натиснувши на неї, в вас з'являється можливість дізнатися поради щодо того чи іншого показника у місці, по якому ви натиснете на мапі. Його можна нажати лише один раз, тож якщо ви захочете знову скористуватися цією функцією, вам потрібно буде натиснути на кнопку "Поради" ще раз. Також, у нижній частині екрану можна змінити дату відображення інформації, за замовчуванням, у вас буде стояти день, який в вас налаштован у комп'ютері.`;
    
    customAlertMessage.innerHTML = text;
    customAlertContainer.style.display = "block";

    customAlertButton.addEventListener("click", function() {
    customAlertContainer.style.display = "none";
});
}

function help() {
    document.getElementById('myChart').style.display = 'flex';
    document.getElementById('myButton').style.display = 'flex';
}

function unhelp() {  
    document.getElementById('myChart').style.display = 'none';
    document.getElementById('myButton').style.display = 'none';
}

var previousSelectedValue = null;
function updateValuesAfterChangingType() {
    var selectedRadio = document.querySelector(".radio-input input:checked");
    const moreValueInput = document.getElementById('moreValue');
    const lessValueInput = document.getElementById('lessValue');

    if (selectedRadio.value === "humidity" && previousSelectedValue !== "humidity") {
        previousSelectedValue = "humidity"
        moreValueInput.value = 0;
        lessValueInput.value = 100;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "PM10" && previousSelectedValue !== "PM10") {
        previousSelectedValue = "humidity"
        moreValueInput.value = 0;
        lessValueInput.value = 500;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "PM2n5" && previousSelectedValue !== "PM2n5") {
        previousSelectedValue = "PM2n5"
        moreValueInput.value = 0;
        lessValueInput.value = 250;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "Pressure" && previousSelectedValue !== "Pressure") {
        previousSelectedValue = "Pressure"
        moreValueInput.value = 700;
        lessValueInput.value = 800;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "Temperature" && previousSelectedValue !== "Temperature") {
        previousSelectedValue = "Temperature"
        moreValueInput.value = -30;
        lessValueInput.value = 30;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "AirQualityIndex" && previousSelectedValue !== "AirQualityIndex") {
        previousSelectedValue = "AirQualityIndex"
        moreValueInput.value = 0;
        lessValueInput.value = 500;
        moreValueInput.disabled = false;
        moreValueInput.title = "Введіть значення фільтру...";
        lessValueInput.disabled = false;
        lessValueInput.title = "Введіть значення фільтру...";
    }

    else if (selectedRadio.value === "AllValues" && previousSelectedValue !== "AllValues") {
        previousSelectedValue = "AllValues"
        moreValueInput.value = "Х";
        lessValueInput.value = "Х";
        moreValueInput.disabled = true;
        moreValueInput.title = "Фільтрування для усіх показників неможливе...";
        lessValueInput.disabled = true;
        lessValueInput.title = "Фільтрування для усіх показників неможливе...";
    }

}

function callTwoFunctions() {
    getInfo();
    updateValuesAfterChangingType();
}