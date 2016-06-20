/**
 * Created by lenovo on 16-6-19.
 */

var timer = setTimeout(function(){
        console.log('timeout 1 s');

        console.log(timer==null);
        clearTimeout(timer);
        console.log(timer ==null);
    }, 1000);




