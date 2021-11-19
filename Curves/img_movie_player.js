"use strict";
// © 2014, 2017 Xah Lee, http://xahlee.info/
// 2017-08-31
var f_cycle_image = (function (_a) {
    var p_img_path_list = _a.p_img_path_list, p_img_tag_id = _a.p_img_tag_id, p_backforth_loop = _a.p_backforth_loop;
    var fps = 4;
    var timeoutID;
    var isPlaying = false;
    var v_backforth_loop = ((p_backforth_loop === undefined) ? (true) : (p_backforth_loop));
    var v_is_play_forward = !v_backforth_loop;
    var v_imgEle = document.getElementById(p_img_tag_id);
    var v_currentIndex = 0;
    var v_n = p_img_path_list.length;
    // pre load images
    p_img_path_list.map((function (x) { (new Image()).src = x; }));
    var f_switchImg = (function () {
        if (v_backforth_loop) {
            switch (v_currentIndex) {
                case 0:
                    if (!v_is_play_forward) {
                        f_switchToNextImg();
                        (v_is_play_forward = !v_is_play_forward);
                    }
                    else {
                        f_switchToPrevImg();
                    }
                    break;
                case v_n - 1:
                    if (v_is_play_forward) {
                        f_switchToPrevImg();
                        (v_is_play_forward = !v_is_play_forward);
                    }
                    else {
                        f_switchToNextImg();
                    }
                    break;
                default:
                    if (v_is_play_forward) {
                        f_switchToNextImg();
                    }
                    else {
                        f_switchToPrevImg();
                    }
            }
        }
        else {
            if (v_is_play_forward) {
                f_switchToNextImg();
            }
            else {
                f_switchToPrevImg();
            }
        }
    });
    var f_switchToNextImg = (function () {
        var v_nextIndex = (v_currentIndex + 1) % v_n;
        v_imgEle.setAttribute("src", p_img_path_list[v_nextIndex]);
        v_currentIndex = v_nextIndex;
    });
    var f_switchToPrevImg = (function () {
        var v_prevIndex = (v_currentIndex + v_n - 1) % v_n;
        v_imgEle.setAttribute("src", p_img_path_list[v_prevIndex]);
        v_currentIndex = v_prevIndex;
    });
    var f_keyboard = (function (p_keydownEvent) {
        /* (right arrow) */
        if (p_keydownEvent.keyCode === 39) {
            f_switchToNextImg();
        }
        if (p_keydownEvent.keyCode === 37) {
            f_switchToPrevImg();
        }
        /* (left arrow) */
    });
    var f_mouseWheel = (function (x) {
        f_stopPlay();
        if (x.deltaY > 0) {
            x.preventDefault();
            f_switchToNextImg();
        }
        if (x.deltaY < 0) {
            x.preventDefault();
            f_switchToPrevImg();
        }
    });
    var f_play = (function () {
        (isPlaying ? null : (timeoutID = setInterval(f_switchImg, 1000 / fps)));
        isPlaying = true;
    });
    var f_stopPlay = (function () {
        clearInterval(timeoutID);
        isPlaying = false;
    });
    var f_play_or_pause = (function () {
        (isPlaying ? f_stopPlay() : f_play());
    });
    if (v_imgEle) {
        {
            var divLayer = document.createElement("div");
            divLayer.style.position = "absolute";
            divLayer.innerHTML = "<div id=\"ui_16069\" style=\"position:absolute;\nmargin:4rem 1rem 1rem 0.5rem;\nfont-size:1rem;\ncolor:green;\nuser-select:none;\nz-index:4528;\n\">\n <span id=\"" + (p_img_tag_id + 'button_play') + "\" style=\"padding:0.1rem; border: solid 2px gray;border-radius:0.5rem;\">PLAY</span><br><br>\n <span id=\"" + (p_img_tag_id + 'button_left') + "\" style=\"padding:0.1rem; border: solid 2px gray;border-radius:0.5rem;\">PREV</span><br><br>\n <span id=\"" + (p_img_tag_id + 'button_right') + "\" style=\"padding:0.1rem; border: solid 2px gray;border-radius:0.5rem;\">NEXT</span><br><br>\n</div>\n";
            v_imgEle.parentNode.insertBefore(divLayer, v_imgEle);
        }
        document.getElementById(p_img_tag_id + 'button_play')
            .addEventListener("click", f_play_or_pause, false);
        document.getElementById(p_img_tag_id + 'button_left')
            .addEventListener("click", (function () { f_stopPlay(); f_switchToPrevImg(); }), false);
        document.getElementById(p_img_tag_id + 'button_right')
            .addEventListener("click", (function () { f_stopPlay(); f_switchToNextImg(); }), false);
        v_imgEle.addEventListener("wheel", f_mouseWheel, false);
        v_imgEle.addEventListener("click", f_play_or_pause, false);
    }
    document.body.addEventListener("keydown", f_keyboard, false);
});
