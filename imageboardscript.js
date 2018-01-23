(function() {

    var app = new vue({
        el:'#main',  //html elemnt with id main
        data: {
            heading: 'something here'
            headingClassName: 'heading'
        } //everything in "data" will automatically rerender

    });


})();  //all inside the iife
