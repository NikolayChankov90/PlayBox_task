
function getPhotos() {
    $.getJSON("./json/photos.json", function(data) {
        arrayPhotos = data;
       goToPage(0, limit);
    })
}
function loadingMsg(doShow, message){
    if(doShow){
        if(!message){
            message = 'Loading Please Wait.....';
        }
        loading.html(`<p>${message}</p>`);
        loading.show();
        return;
    }
    loading.hide();
}

// Modal Dialog ------>>>>>>
function addPhotosClickListener(){
    let images = $(".imgBox img");
    images.click(function() {

        modalContent.attr('src', $(this).attr('src'));
        modalContent.attr("alt", $(this).attr("alt") )
        modal.css('display', 'block');
        googleMap.css('display','none');
        let currentImageTag = $(this).attr("data-category");


        EXIF.getData(this, function() {
            let latLonData,
        latestTags = {
            maker: EXIF.getTag(this, "Make"),
            model: EXIF.getTag(this, "Model"),
            speedRatings: EXIF.getTag(this, "ISOSpeedRatings"),
            exposureTime: EXIF.getTag(this, "ExposureTime"),
            fNumber: EXIF.getTag(this, "FNumber"),
            focalLength: EXIF.getTag(this, "FocalLength"),
            dateTaken: EXIF.getTag(this, "DateTime"),
            extract: function () {
                return ("Camera maker: " + this.maker + "\n" + "Camera model: " + this.model + "\n" + "ISO: " + this.speedRatings + "\n" +
                    "Exposure time: " + this.exposureTime.numerator + "/" + this.exposureTime.denominator + " sec" + "\n" + "F-Stop: f/ " + this.fNumber + "\n" + "Focal Length: " + this.focalLength + " mm" + "\n" +
                    "Date taken: " + this.dateTaken + "\n" + "Tag: " + currentImageTag);
            }
        };

    result.text(latestTags.extract());

    latLonData = getLatLonData(this.exifdata);

    if (latLonData[0] && latLonData[1]) {
        googleMap.css('display','block');
        initMap(latLonData[0], latLonData[1]);
    }
})
});

}

function renderImages(data) {
    loadingMsg(true);
    let images= "";
    data.forEach(function (item) {
        images += (`<div class='imgBox'><img id=${item.id} src=${item.location} data-category=${item.tags} /><p>${item.title}</p></div>`);
    });
    imageContainer.html(images);
    addPhotosClickListener();
    loadingMsg();
}

// Function for converting Degrees,Minutes,Seconds, to DecimalData ---->>>>>>

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction === "S" || direction === "W") {
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
        focalLength = null;

    if (exifdata.GPSLatitude && exifdata.GPSLatitude.length > 0) {
        lat = getGPSFormatedData(exifdata.GPSLatitude, exifdata.GPSLatitudeRef);
    }
    if (exifdata.GPSLongitudeRef && exifdata.GPSLongitudeRef.length > 0) {
        lon = getGPSFormatedData(exifdata.GPSLongitude, exifdata.GPSLongitudeRef);
    }
    return [lat, lon];
}

// Pagination ---->>>>>>

let limit = 12;
let arrayPhotos = [];

function getImageArray( filter, imgIndexStart, numberOfImages ) {
    let filteredArrayPhotos = [];
    let ofsCntr = 0;

    if ( numberOfImages <1 ) {
        numberOfImages = arrayPhotos.length;
    }

    if ( filter !== '' ) {

        const tmpFiltered = arrayPhotos.filter(image => image.title.toLowerCase().indexOf(filter) >= 0);
        for ( let arrayKey in tmpFiltered ) {
            const elem = tmpFiltered[arrayKey];
            if ( ofsCntr < imgIndexStart )
            {
                ofsCntr++;
                continue;
            }
            ofsCntr++;

            filteredArrayPhotos.push(elem);
            if ( filteredArrayPhotos.length >= numberOfImages )
                break;
        }
    } else {
        for (let arrayKey in arrayPhotos) {
            const elem = arrayPhotos[arrayKey];
            if (ofsCntr < imgIndexStart ){
                ofsCntr++;
                continue;
            }
            ofsCntr++;

            filteredArrayPhotos.push(elem);
            if ( filteredArrayPhotos.length >= numberOfImages ) break;
        }
    }
    return filteredArrayPhotos;
}

function getImagesCount() {
    let filter = $("#inputValue").val().toLowerCase();
    const imgs = getImageArray(filter,0,-1);
    return imgs.length;
}

function RenderPagingView(itemsCount) {
    totalPages = Math.ceil(itemsCount / limit);
    let paginationContainer = $("#pagination");
    let intDom ="";
    for (let i = 0; i < totalPages; i++) {
        intDom += ("<span class='clickPageNumber' onclick='goToPage("+i+","+limit+")'>" + (i+1) + "</span>");
    }
    paginationContainer.html(intDom);
}

function goToPage(pageNum, count) {

    let filter = $("#inputValue").val().toLowerCase();
    let imgIndex = pageNum * count;
    goToItem(filter,imgIndex, count);

}

function goToItem(filter,imgIndex,count) {
     let imagesToDisplay =  getImageArray(filter, imgIndex, count);
     const imgCount = getImagesCount();
     RenderPagingView(imgCount);
     renderImages(imagesToDisplay);
 }


