const imageContainer = $("#imageContainer"),
    modal = $('#myModal'),
    closeDlg = $("#closeDlg"),
    result = $('#exifResult'),
    googleMap = $('#map'),
    modalContent = $('.modal-content'),
    arrayImg = [
    {
        filename: "20140222_131314",
        title:"img1",  
    },
    {
        filename:"20140712_203709",
        title:"img2",
    },
    {
        filename:"20190318_182928",
        title:"img3"
    },
    {
        filename:"20190422_181219",
        title:"img4"
    },
    {
        filename:"20190511_180050",
        title:"img5"
    },
    {
        filename:"20190906_193018",
        title:"img6"
    },
    {
        filename:"20190913_191835",
        title:"img7"
    },
    {
        filename:"20190910_191927",
        title:"img8"
    },
    {
        filename:"20190831_142446",
        title:"img9"
    },
    {
        filename:"20190820_203648",
        title:"img10"
    },
    {
        filename:"20190803_185342",
        title:"img11"
    },
    {
        filename:"20190729_194138",
        title:"img12"
    }
];

renderImages(arrayImg);

const image = $("#imageContainer img");

image.click(function() {
    let latFinal, lonFinal;

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