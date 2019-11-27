const modal = $('#myModal'),
    closeDlg = $("#closeDlg"),
    result = $('#exifResult'),
    googleMap = $('#map'),
    modalContent = $('.modal-content'),
    loading = $('#loading');

let imageContainer = $('#imageContainer');
getPhotos();
addPhotosClickListener();

closeDlg.click(function() {
    modal.css('display',"none");
    googleMap.css('display', 'block');
    modalContent.removeClass("modal-rotated90 rotate90 rotate180 rotate270");
    modalContent.removeAttr("src");
});
