
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
    let images = $(".imgBox img");
    images.click(function() {
        
        modalContent.attr('src', $(this).attr('src'));
        modalContent.attr("alt", $(this).attr("alt") )
        modal.css('display', 'block');
        googleMap.css('display','none');
        currentImageTag = $(this).attr("alt");
         
        EXIF.getData(this, function() {
            let latLonData;

            cameraMaker =("Camera maker: " + EXIF.getTag(this, "Make"));
            cameraModel = "Camera model: " +  EXIF.getTag(this, "Model");
            speedRatings = "ISO: " + EXIF.getTag(this, "ISOSpeedRatings");
            exposureTime = "Exposure time: " + EXIF.getTag(this, "ExposureTime");
            fNumber = "F-Stop:" + "f/" +EXIF.getTag(this, "FNumber ");
            focalLength ="Focal Length: " + EXIF.getTag(this, "FocalLength"); +"mm"; 
            dateTaken = "Date taken: " +EXIF.getTag(this, "DateTime")
            
          latestTags = {
             maker :         EXIF.getTag(this, "Make"),
             model :         EXIF.getTag(this, "Model"),
             speedRatings :  EXIF.getTag(this, "ISOSpeedRatings"),
             exposureTime :  EXIF.getTag(this, "ExposureTime"),
             fNumber :       EXIF.getTag(this, "FNumber "),
             focalLength :   EXIF.getTag(this, "FocalLength"),
             dateTaken :     EXIF.getTag(this, "DateTime") ,
             extract : function() {
                 return ("Camera maker: " + this.maker + "\n" + "Camera model: " + this.model + "\n" + "ISO: " + this.speedRatings + "\n" +
                  "Exposure time: " + this.exposureTime + "\n" + "F-Stop: f/ " + this.fNumber +  "\n" + "Focal Length: " + this.focalLength + " mm" + "\n"+
                  "Date taken: " + this.dateTaken + "\n" + "Tags: "+ currentImageTag )
             }

            };
    
            result.text(latestTags.extract());

            latLonData = getLatLonData(this.exifdata);

            if (latLonData[0] && latLonData[1]) {
                googleMap.css('display','block');
                initMap(latLonData[0], latLonData[1]);
            };
        })
    });

}



function renderImages(data) {
    loadingMsg(true);
    data.forEach(function (item) {
        imageContainer.append(`<div class='imgBox'><img id=${item.id} src=${item.location} alt=${item.tags} /><p>${item.title}</p></div>`);
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

let start,
    end,
    limit = 12 ,
    photos = [],
    arrayPhotos= [];

let pageNum = function() {

};
    
const goToPage = pageNum => {
    start = pageNum + (limit - pageNum);
    createFilteredArray();
};

function createFilteredArray(){

let filteredArrayPhotos;

    filtering();
    sorting();
    preparePaging(); 
    renderImages(filteredArrayPhotos); 

}
    
    function filtering() {
        checkFilter = $("#inputValue").val().toLowerCase();
        filteredArrayPhotos = arrayPhotos.filter(function(){
        if ( this.text().toLowerCase().indexOf(checkFilter) ){
            filterImages();
        }else {
            return;
        }
    })

    function sorting() {
        filteredArrayPhotos = arrayPhotos.slice(start,end)
        start = (pageNum-1)*limit;
        end = (pageNum*limit);
    }
  

    function preparePaging () {
        filteredArrayPhotos.forEach(function (photo, index) {
            if (index >= (pageNum * limit) & index < (pageNum * limit + limit)) {
                photos.push(photo);
            }
        });
    }


}


let taggsss = arrayPhotos[3];


/*
    let pageNum = function() {
        return Math.ceil(arrayPhotos.length / limit);
*/




