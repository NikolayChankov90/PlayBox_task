const modal = $('#myModal'),
    closeDlg = $("#closeDlg"),
    result = $('#exifResult'),
    googleMap = $('#map'),
    modalContent = $('.modal-content'),
    loading = $('#loading');

let imageContainer = $('#imageContainer'),
    pageNumber = $('#pageNumber');

getPhotos();
addPhotosClickListener();

closeDlg.click(function() {
    modal.css('display',"none");
    googleMap.css('display', 'block');
});