const loading = $('#loading')

let imageContainer = $('#imageContainer');
function renderImages(data) {
    do {loadingMsg()}
    while (data.forEach(function (item) {
        imageContainer.append(`<div class='imgBox'><img class="jsonImage" id=${item.id} src=${item.location}><p>${item.title}</p></div>`);
   }));
   loadingMsgHide();
};
$.getJSON("/json/photos.json", function (data) {
    renderImages(data);
    
    /*const limit = 12;
      const totalCountImages = 0;
      const totalPages = 0;
      totalCountImages = data.length;

    if (totalCountImages > 12 ) {
        totalPages = Math.ceil(totalPages / 12);

        renderImages(data);

    }

    */

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


//Sort Images by name function 
function filterImages(){
    loadingMsg();
    let filter=$("#inputValue").val().toLowerCase();
    $(".imgBox").hide();
    $('.imgBox ').each(function(){
        if($(this).text().toLowerCase().indexOf(filter) != -1) {
            $(this).show();
        } 
    });
    loadingMsgHide();
};