const modal = $('#myModal'),
    closeDlg = $("#closeDlg"),
    result = $('#exifResult'),
    googleMap = $('#map'),
    modalContent = $('.modal-content'),
    loading = $('#loading');

let imageContainer = $('#imageContainer');
    filter = $("#inputValue").val().toLowerCase();

getPhotos();

closeDlg.click(function() {
    modal.css('display',"none");
    googleMap.css('display', 'block');
});