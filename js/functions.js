
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
        loading.html(`<p>${message}</p>`);
        loading.show();
        return;
    }
    loading.hide();
}

// Modal Dialog
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
    data.forEach(function (item) {
        imageContainer.append(`<div class='imgBox'><img id=${item.id} src=${item.location} data-category=${item.tags} /><p>${item.title}</p></div>`);
    });
    addPhotosClickListener();
    loadingMsg();
}

// Function for converting Degrees,Minutes,Seconds, to DecimalData -->

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


//Sort Images by name function 
function filterImagesByName(){
    loadingMsg(true);
    let filter=$("#inputValue").val().toLowerCase();
    $(".imgBox").hide();
    $('.imgBox').each(function(){
        if($(this).text().toLowerCase().indexOf(filter) >= 0 ) {
            $(this).show();
        }
    });

    loadingMsg();
}

function filterImagesByTagName(){
    loadingMsg(true);
    let filterTag=$("#inputValueTag").val().toLowerCase();
    $(".imgBox").hide();
    $('.imgBox').each(function(){
        if( $('img', this).attr('data-category').toLowerCase().indexOf(filterTag) !== -1) {
            $(this).show();
        }
    });
    loadingMsg();
}

function filteringArrayPhotos () {
    inputFilter = $("#inputValue").val().toLowerCase();
    filteredArrayPhotos = arrayPhotos.filter(function () {
        for (let i = 0 ; i < arrayPhotos.length; i++) {
            if (this.text().toLowerCase().indexOf(inputFilter)) {
                return this[i];
            }
        }
    });
}

////////////////////////////////////////////// Pagination /////////////////////////////////////
let start,
    limit = 12;
    photos = [];
    arrayPhotos= [];

function goToPage(pageNum){
    start = pageNum+(limit-pageNum);
    createFilteredArray()
}

function createFilteredArray(){

    filtering();
    sorting()
    preparePaging()
    renderImages(filteredArrayPhotos)

  function filtering() {
      let inputFilter = $("#inputValue").val().toLowerCase();
      filteredArrayPhotos = arrayPhotos.filter(function () {

      })
  }

  function sorting() {

  }

  function preparePaging() {
       let pageNum =

      filteredArrayPhotos.forEach(function(photo, index){
          if(index >= (pageNum*limit) && index < (pageNum*limit+limit)){
              photos.push(photo);
          }
      });

  }



}

/*
let start,
    limit = 12 ,
    currentPage= 1,
    photos = [],
    arrayPhotos= [];

function goToPage (pageNum) {
    start = pageNum + (limit - pageNum);
    createFilteredArray(photos);
}

function createFilteredArray() {
    let filteredArrayPhotos;
    let numberOfPages = Math.ceil(arrayPhotos.length / limit);
    let pageNumber = document.getElementById('page_number').getElementsByClassName('clickPageNumber');


    function prevNextButtons () {

    }

    filteringArrayPhotos();
    sortingArrayPhotos()
    preparePaging();
    renderImages(filteredArrayPhotos);

    let selectedPage = function() {
        for (let i = 0; i < page_number.length; i++) {
            if (i === currentPage - 1) {
                pageNumber[i].style.opacity = "1.0";
            }
            else {
                pageNumber[i].style.opacity = "0.5";
            }
        }
    };
    let prevPage = function() {
        if(current_page > 1) {
            current_page--;
            changePage(current_page);
        }
    };

    let nextPage = function() {
        if(current_page < numPages()) {
            current_page++;
            changePage(current_page);
        }
    };

    let checkButtonOpacity = function() {
        currentPage === 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
        currentPage === numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
    };

    let changePage = function(page) {

        if (page < 1) {
            page = 1;
        }
        if (page > (numPages() -1)) {
            page = numPages();
        }

        renderImages(filteredArrayPhotos);
    };

    let numPages = function() {
        return Math.ceil(arrayPhotos.length / limit);
    };


    function filteringArrayPhotos () {
      let inputFilter = $("#inputValue").val().toLowerCase();
        let filteredArrayphotos = arrayPhotos.filter(function () {
            for (let i = 0 ; i < arrayPhotos.length; i++) {
                if (this.text().toLowerCase().indexOf(inputFilter)) {
                    return this[i];
                }
            }
        })
    }

    function sortingArrayPhotos(){

    }

    function preparePaging(){
        filteredArrayPhotos.forEach(function(photo, index) {
            if (index >= (pageNum * limit) && index < (pageNum * limit + limit)) {
                photos.push(photo);
            }
        });
    }

}
*/

































/*
    function filteringArrayPhotos () {
        inputFilter = $("#inputValue").val().toLowerCase();
        filteredArrayPhotos = arrayPhotos.filter(function () {
            for (let i = 0 ; i < arrayPhotos.length; i++) {
                if (this.text().toLowerCase().indexOf(inputFilter)) {
                    return this[i];
                }
            }
        });
    }

    function sortingArrayPhotos() {
        let begin = ((currentPage - 1) * limit);
        let end = begin + limit;
        filteredArrayPhotos = arrayPhotos.slice(begin, end);

    }

    function preparePaging() {
        filteredArrayPhotos.forEach(function (photo, index) {
            if (index >= (pageNum * limit) && index < (pageNum * limit + limit)) {
                photos.push(photo);
            }
        });
        goToPage();
    }

*/















