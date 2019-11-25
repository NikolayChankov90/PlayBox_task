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
    modalContent.removeClass("modal-rotated90 modal-rotated270 rotate90 rotate180 rotate270 specific90");
    modalContent.removeAttr("src");
});
