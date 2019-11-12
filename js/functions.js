window.onload=addPhotosClickListener;
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
        modalContent.attr("alt", $(this).attr("alt"));
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
        images += (`<div class='imgBox'><img id=${item.id} src=${item.location} data-category=${item.tag} /><p>${item.title}</p></div>`);
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

function getImageArray(filter, imgIndexStart, numberOfImages) {  /// Тази функция съм я преправил кажи речи цялата след като добавих search by tag в сравнение с предния commit 10.11.2019.
    let filteredArrayPhotos = [];
    let tagSign = "#";
    const searchByTag = filter[0] === tagSign;
    let searchCondition = searchByTag ? filter.slice(1) : filter;

    if (numberOfImages < 1 ){
        numberOfImages = arrayPhotos.length;
    }

    let tmpFiltered = arrayPhotos.filter(
        searchByTag ? image =>  image.tag.indexOf(searchCondition) >= 0 :
            image => image.title.toLowerCase().indexOf(searchCondition) >= 0);

    for (let i = imgIndexStart; i < tmpFiltered.length; i++) {
        filteredArrayPhotos.push(tmpFiltered[i]);

        if (filteredArrayPhotos.length >= numberOfImages) {
            break;
        }
    }
    return filteredArrayPhotos;
}
/////////////////////////////////////////////////////////////////SEARCH BY MULTIPLE TAGS  , but pagination is not working now:
// function getImageArray(filter, imgIndexStart, numberOfImages) {
//     let filteredArrayPhotos = [];
//     let tagSign = "#";
//     searchByTag = filter[0] === tagSign;
//
//     let searchCondition = searchByTag ? filter.slice(1) : filter;
//
//     let tmpFiltered = arrayPhotos.filter(searchFilter);
//     console.log(tmpFiltered);
//
//     function searchFilter(image) {
//         let tagPattern = new RegExp(filter.replace(/,/g, '|').replace(/#/g, '') );
//         let titlePattern = new RegExp(filter.replace(/,/g, '|'));
//         return searchByTag ? tagPattern.test(image.tag) : titlePattern.test(image.title);
//     }
//
//     for (let i = imgIndexStart; i < tmpFiltered.length ; i++) {
//         filteredArrayPhotos.push(tmpFiltered[i]);
//
//         if (filteredArrayPhotos.length >= numberOfImages) {
//             break;
//         }
//     }
//     return filteredArrayPhotos;
//
// }


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
///// END OF PAGINATION <<----


