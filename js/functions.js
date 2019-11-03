const loading = $('#loading')
const limit = 12;
const totalCount = 0;
const totalPages = 0;

let imageContainer = $('#imageContainer');
function renderImages(data) {
    data.forEach(function (item) {
        imageContainer.append(`<div id='imgBox'><img id=${item.id} src=${item.location}><p>${item.title}</p></div>`);
   })
   loadingMsgHide();
};

$.getJSON("/json/photos.json", function (data) {
    /*totalCount = data.length;
    if (totalPages > 12) {
        totalPages = Math.round(totalPages / 12);
        // TODO apend pages */
    
    renderImages(data);
});

///Page load Function
function loadingMsg(){
    loading.show()
};
function loadingMsgHide() {
    loading.hide()
 };

// Function for converting Degrees,Minutes,Seconds, to DecimalData -->
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1; 
    }
    return dd;
}

function initMap(latFinal,lonFinal) {

    let map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: latFinal, lng: lonFinal},
            zoom: 12,
            mapTypeId: 'roadmap'
        });

}

function getGPSFormatedData(pos, ref){
    return ConvertDMSToDD(
        parseFloat(pos[0].numerator),
        parseFloat(pos[1].numerator),
        parseInt(pos[2]),
        ref
    );
}

function getLatLonData(exifdata){
    let lat = null,
        lon = null;

    if (exifdata.GPSLatitude && exifdata.GPSLatitude.length > 0) {
        lat = getGPSFormatedData(exifdata.GPSLatitude, exifdata.GPSLatitudeRef);
    }
    if (exifdata.GPSLongitudeRef && exifdata.GPSLongitudeRef.length > 0) {
        lon = getGPSFormatedData(exifdata.GPSLongitude, exifdata.GPSLongitudeRef);
    }
    return [lat, lon];
}

function findImage(){
    let input = $('#inputValue');
    let container = $('#imgBox');
    let pText = $("#imgBox p");
    for (var i = 0 ; i < pText.length ; i++) {
       let index = pText[0];
       let txtValue = pText.textContent()|| pText.innerText();
    }
}
