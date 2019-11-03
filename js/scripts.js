const modal = $('#myModal'),
    closeDlg = $("#closeDlg"),
    result = $('#exifResult'),
    googleMap = $('#map'),
    modalContent = $('.modal-content');

let image = $('.imgBox img')
image.click(function() {   
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
    })
});

closeDlg.click(function() {
    modal.css('display',"none");
    googleMap.css('display', 'block');
});