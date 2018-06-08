// importing scroll library and dependencies
import $ from 'jquery';
import scrollTo from 'jquery.scrollto';
import localScroll from 'jquery.localscroll';

function LocalScroll() {

    let _duration = 800;

    function exports(selector) {

        $(function($){
        	$(selector).localScroll({
                duration: _duration
        	});
        });
    }

    exports.duration = function(_) {
        // _ expects an integer
        if (_ === 'undefined') return _duration;
        _duration = _;
        return this;
    };

    return exports;

}

export default LocalScroll;
