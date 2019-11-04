
function getPhotos() {
    $.getJSON("./json/photos.json", function(data){
        arrayPhotos = data;
        renderImages(data);
    })
}
function loadingMsg(doShow, message){
    if(doShow){
        if(!message){
            message = 'Loading Please Wait.....';
        }
        loading.html(`<p>${message}</p>`)
        loading.show();
        return;
    }
    loading.hide();
}

function addPhotosClickListener(){
    let images = $('.imgBox img');
    images.click(function() {
        modalContent.attr('src', $(this).attr('src'));
        modal.css('display', 'block');
        googleMap.css('display','none');

        EXIF.getData(this, function() {
            let latLonData;

            result.text(EXIF.pretty(this));

            latLonData = getLatLonData(this.exifdata);

            if (latLonData[0] && latLonData[1]) {
                googleMap.css('display','block');
                initMap(latLonData[0], latLonData[1]);
            }
        });
    });
}

function renderImages(data) {
    loadingMsg(true);
    data.forEach(function (item) {
        imageContainer.append(`<div class='imgBox'><img id=${item.id} src=${item.location} /><p>${item.title}</p></div>`);
    });
    addPhotosClickListener();
    loadingMsg();
}

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
    loadingMsg(true);
    let filter=$("#inputValue").val().toLowerCase();
    $(".imgBox").hide();
    $('.imgBox').each(function(){
        if($(this).text().toLowerCase().indexOf(filter) !== -1) {
            $(this).show();
        } 
    });
    loadingMsg();
};

////////////////////////////////////////////// Pagination /////////////////////////////////////

let start;
    limit = 12 ,
    photos = [],
    arrayPhotos= [];


function goToPage(pageNum){
    start = pageNum + (limit - pageNum);
    createFilteredArray();
}

function createFilteredArray(){

    filtering();
    sorting();
    paging(); 
    renderImages(filteredArrayPhotos); 


    function filtering() {
         filteredArrayPhotos = arrayPhotos.slice(start,end) {
            start = (pageNum-1)*limit,
            end = (pageNum*limit)
        }
    }


    function sorting () {

    }

    function paging () { 
        filteredArrayPhotos.forEach(function(photo, index){
            if(index >= (pageNum*limit) || index < (pageNum*limit+limit)){
                photos.push(photo);
        }
    })}
}



