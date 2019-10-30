(function getImages (){
    arrayImg.forEach(function (item){
        imageContainer.append(`<img id=${item.title} src=photos/${item.filename}.jpg>`)
    })
}());

const $img = $("#imageContainer img")
$img.click(function() {
    $('.modal-content').attr('src', $(this).attr('src'));
    modal.css('display', 'block');
    EXIF.getData(this, function() {
    
        const make = EXIF.getAllTags(this);
            let exifData = Object.entries(make).map(([property, value]) => {
                return `${property}: ${value}`;
            })
            result.text(exifData.join('\n'));

           
            if (this.exifdata.GPSLatitude && this.exifdata.GPSLatitude.length > 0) {
                let latDegree = parseFloat(this.exifdata.GPSLatitude[0].numerator);
                let latMinute = parseFloat(this.exifdata.GPSLatitude[1].numerator);
                let latSecond = parseInt(this.exifdata.GPSLatitude[2]);
                let latDirection = this.exifdata.GPSLatitudeRef;
                latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
            }
            
            if (this.exifdata.GPSLongitudeRef && this.exifdata.GPSLongitudeRef.length > 0) {
                let lonDegree = parseFloat(this.exifdata.GPSLongitude[0].numerator);
                let lonMinute = parseFloat(this.exifdata.GPSLongitude[1].numerator);
                let lonSecond = parseInt(this.exifdata.GPSLongitude[2]);
                let lonDirection = this.exifdata.GPSLongitudeRef;
                lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
            }

            if (latFinal && lonFinal) {
                initMap(latFinal, lonFinal);
            } else {
                googleMap.css('display','none');

            }
    })
})

// Function for converting Degrees,Minutes,Seconds, to DecimalData -->
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1; 
    }
    return dd;
};


function initMap(latFinal,lonFinal) {
    mapOptions = {
        center: {lat: latFinal, lng: lonFinal},
        zoom: 12,
        mapTypeId: 'roadmap'
    };
    let map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

};
            
function spanClick() {
    modal.css('display',"none");
    googleMap.css('display', 'block');
};


//Махнах imgCurrent = document.getElementById('current) за Exif data-та , тъй като при клик екстрактваше 
//данните, но ги запазваше едни и същи за всеки image. Заместих imgCurrent с this. 
