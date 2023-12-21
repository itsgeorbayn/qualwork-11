function changeAnim() {
    const valueToColor = {
        "value1": '1',
        "value2": '2',
        "value3": '3',
        "value4": '4',
        "value5": '5',
        "value6": '6',
        "value7": '7',
        "value8": '8',
        "value9": '9'
    };
    setColor(valueToColor[document.getElementById('select').value]);
}

function setColor(valueSelect) {
    var style = document.documentElement.style;;
    var computedStyle = getComputedStyle(document.documentElement);

    style.setProperty('--colorAnimationDefault', computedStyle.getPropertyValue('--colorAnimation' + valueSelect));
    style.setProperty('--colorSolidDefault', computedStyle.getPropertyValue('--colorSolid' + valueSelect));
    style.setProperty('--colorShadowDefault', computedStyle.getPropertyValue('--colorShadow' + valueSelect));
}


var selectElement = document.getElementById('select');

var savedValue = localStorage.getItem('selectedValue');

if (savedValue) {
    selectElement.value = savedValue;
}
document.getElementById("select").addEventListener("change", function () {
    localStorage.setItem('selectedValue', selectElement.value);
    changeAnim();
});