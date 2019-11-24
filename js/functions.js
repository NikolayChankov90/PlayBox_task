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
debugger
let imgTag;
function addPhotosClickListener() {
    let images = $(".imgBox img");
    images.click(function () {
        modal.css('display', 'none');
        googleMap.css('display', 'none');
        modalContent.attr('src', $(this).attr('src'));
        let orientation, latLonData, width;
        EXIF.getData(this, function () {
            modalContent.attr('src', $(this).attr('src'));
            let imgId = $(this).attr('id');
            let currentImg = arrayPhotos.find(e => e.id === imgId);
            let imgTag = currentImg.tag;
            let regex = /\bTag:\K\w+/g;
            debugger;
            orientation = EXIF.getTag(this, "Orientation");
            switch (orientation) {
                case 1:
                    break;
                case 3:
                    modalContent.addClass("rotate180");
                    break;
                case 6:
                    modalContent.addClass("rotate90 modal-rotated90 ");
                    break;
                case 8:
                    modalContent.addClass("rotate270 modal-rotated270");
                    break;
            }
            let latestTags = {
                maker: EXIF.getTag(this, "Make"),
                model: EXIF.getTag(this, "Model"),
                speedRatings: EXIF.getTag(this, "ISOSpeedRatings"),
                exposureTime: EXIF.getTag(this, "ExposureTime"),
                fNumber: EXIF.getTag(this, "FNumber"),
                focalLength: EXIF.getTag(this, "FocalLength"),
                dateTaken: EXIF.getTag(this, "DateTime"),
                extract: function () {
                    return (
                        "Camera maker: " + ((this.maker) ? this.maker : 'N/A') + "\n" +
                        "Camera model: " + ((this.model) ? this.model : 'N/A') + "\n" +
                        "ISO: " + ((this.speedRatings) ? this.speedRatings : 'N/A') + "\n" +
                        "Exposure time: " + ((this.exposureTime) ? this.exposureTime.numerator + "/" + this.exposureTime.denominator + "sec" : 'N/A') + "\n" +
                        "F-Stop: " + ((this.fNumber) ? "f/" + this.fNumber : 'N/A') + "\n" +
                        "Focal Length: " + ((this.focalLength) ? this.focalLength + " mm" : 'N/A') + "\n" +
                        "Date taken: " + ((this.dateTaken) ? this.dateTaken : 'N/A') + "\n" +
                        "Tag:" + ((imgTag) ? '#'+imgTag : "N/A")
                    );
                }
            };

            modal.css('display', 'block');
            result.text(latestTags.extract());

            latLonData = getLatLonData(this.exifdata);
            if (latLonData[0] && latLonData[1]) {
                googleMap.css('display', 'block');
                initMap(latLonData[0], latLonData[1]);
            }
            console.log(imgTag);
            // for(let i =0 ; i <imgTag.length ; i++){
            //
            // }
        })
    });
}


function renderImages(data) {
    loadingMsg(true);
    let images ='';
    data.forEach(function (item) {
        images += (`<div class='imgBox'><img id=${item.id} alt=" "  src=Photos/loading_indicator.gif /><p>${item.title}</p></div>`);
    });
    imageContainer.html(images);
    addPhotosClickListener();
    data.forEach(function (item) {
        let imgOrientation;
        item.src = item.location;
        EXIF.getData(item, function () {
            imgOrientation = EXIF.getTag(item, "Orientation");
            let image = $(`#${item.id}`);
            image.attr("src", item.src);
            switch (imgOrientation) {
                case 1:
                    break;
                case 3:
                    image.addClass("rotate180");
                    break;
                case 6:
                    image.addClass("rotate90");
                    break;
                case 8:
                    image.addClass("rotate270");
                    break;
            }
        });
    });
    loadingMsg();
}

// Function for converting Degrees,Minutes,Seconds, to DecimalData ---->>>>>>
/**
 * @return {number}
 */
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    }
    return dd;
}

function initMap(latFinal,lonFinal) {
    let map = new google.maps.Map(document.getElementById('map'),
        {
            center: {lat: latFinal, lng: lonFinal},
            zoom: 12,
            mapTypeId: 'roadmap'
        });
}

function getGPSFormatedData(pos, ref){
    return ConvertDMSToDD(
        parseInt(pos[0].numerator),
        parseFloat(pos[1].numerator),
        parseFloat(pos[2]),
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

function getImageArray(filter, imgIndexStart, numberOfImages) {
    let searchByTag,regexTag,regexTitle,tmpFiltered;
    searchByTag =filter[0] === "#";
    regexTag = new RegExp(filter.replace(/#/g, '').replace(/,/, '|'));
    regexTitle = new RegExp(filter.replace(/,/g, '|'));
    let filteredArrayPhotos=[];

    if (numberOfImages < 1 ) {
        numberOfImages = arrayPhotos.length;
    }
    tmpFiltered = arrayPhotos.filter(function searchFilter (image){
        return searchByTag ? regexTag.test(image.tag) : regexTitle.test(image.title.toLowerCase());
        // if(filter[0] === "#") {
        //     searchByTag = true;
        //     if(filter === ',' ){
        //
        //     }
        // }
        // if(filter !== '') {
        //     for(let i = 0 ; i < filter.length; i ++){
        //         if ( image.title === filter){
        //
        //         }
        //     }
        //    return  "variable to take all tags/titles
        // }

     });

    for (let i = imgIndexStart; i < tmpFiltered.length; i++) {
       filteredArrayPhotos.push(tmpFiltered[i]);
        if (filteredArrayPhotos.length >= numberOfImages) {
            break;
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
        intDom += ("<span class='clickPageNumber' onclick='goToPage("+i+","+limit+")'>"+ "page " + (i+1) + "</span>");
    }
    paginationContainer.html(intDom);
}

function goToPage(pageNum, count) {
    let filter = $("#inputValue").val().toLowerCase();
    let imgIndex = pageNum * count;
    goToItem(filter,imgIndex, count);

}

function goToItem(filter,imgIndex,count) {
    let imagesToDisplay = getImageArray(filter, imgIndex, count);
    const imgCount = getImagesCount();
    RenderPagingView(imgCount);
    renderImages(imagesToDisplay);
}

///// END OF PAGINATION <<----
