let m_curr_page_num = -1;
let m_curr_page = null;
let m_curr_document = null;
let m_status_time_chk = 0;
let m_time_last = 0;
let m_render_num = 0;
let m_contents_json = null;
let m_notice_mode = "";
let m_img_list = [];
let m_clock = null;
let m_notice_list = [];
let m_curr_notice = 1;
let m_curr_notice_ptime = 0;
let m_curr_notice_type = "";
let m_curr_notice_cnt = -1;
let m_notice_timeout = null;
let m_dust_title_list = ['좋음', '보통', '나쁨', '매우나쁨'];
let m_dust_img_list = ['images/img_dust_04.png', 'images/img_dust_03.png', 'images/img_dust_02.png', 'images/img_dust_01.png'];
let m_dust_time_chk = 0;

function setInit() {

    $('.nav_main li, .nav_sub li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    $('.btn_home').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnHome(this);
    });


    $('#id_main_notice').on("touchstart mousedown", function (e) {
        e.preventDefault();
        $('.nav_main li, .nav_gnb li').removeClass('active');
        $(`.nav_main li[code="${1}"], .nav_gnb li[code="${1}"]`).addClass('active');
        setPage("1");
    });

    $('.btn_back').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnBack(this);
    });

    $('.btn_close').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickPopupClose(this);
    });

    var str_iframe = $('iframe').contents();

    $('html, iframe').on('mousedown touchstart', function () {
        m_time_last = new Date().getTime();
    });

    $(str_iframe).on('mousedown touchstart', function () {
        m_time_last = new Date().getTime();
    });


    m_img_swiper = new Swiper('.img_swiper', {
        spaceBetween: 100, //슬라이드 간격
        slidesPerView: 'auto', // 자동으로 슬라이드 너비 설정
        watchOverflow: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
    m_time_last = new Date().getTime();
    setInterval(setMainInterval, 1000);
    setLoadSetting("include/setting.json");

    setInitCheck();
}

function setInitCheck() {
    $('.frame_info iframe').each(function () {
        var iframeWindow = $(this)[0].contentWindow;

        // iframe 내부의 'PAGEACTIVEYN' 확인
        if (iframeWindow.PAGEACTIVEYN === undefined) {
            // 'PAGEACTIVEYN'이 정의되지 않은 경우, 500ms 후에 다시 시도
            setTimeout(function () {
                setInitCheck(); // 재귀적으로 함수 호출
            }, 500);
            return; // 나머지 iframe 체크를 중단하고 재시도
        }
    });
    /*
    setTimeout(function () {
        setHideCover();
    }, 500);
	*/
}

function setLoadSetting(_url) {
    $.ajax({
        url: _url,
        dataType: 'json',
        success: function (data) {
            m_contents_url = data.setting.content_url;
            //키오스크 컨텐츠의 주소
            m_root_url = data.setting.root_url;
            //이미지 로드를 위한 기본 root주소
            m_notice_mode = data.setting.notice_mode;
            //모드가 web이면 파일 주소를 보정함
            m_web_server_port = data.setting.web_server_port;
            //중소기업 중앙회에서는 사용하지 않음
            //console.log("m_contents_url", m_contents_url);
            setContents();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}
//초기화
function setInitSetting() {

    setDateTime();

    setClock();

    setDustJson();
    //setPage("0");

    setTimeout(function () {
        $('.frame_info iframe').each(function (index) {
            var $iframe = $(this); // jQuery 객체
            var el = $iframe[0]; // DOM 객체 (contentWindow 접근용)

            // 함수가 존재하는지 확인 ('function' 타입인지 체크)
            if (el.contentWindow && typeof el.contentWindow.setDataInit === 'function') {
                // 정상적으로 함수 실행
                el.contentWindow.setDataInit(m_contents_json, m_notice_mode);
            } else {
                // 함수가 없는 경우 범인 색출
                var errorMsg = {
                    "순번": index,
                    "파일경로(src)": $iframe.attr('src'),
                    "아이디(id)": $iframe.attr('id'),
                    "클래스(class)": $iframe.attr('class')
                };

                console.warn("⚠ setDataInit 함수가 없는 iframe 발견:", errorMsg);
            }
        });
    }, 500);

    if (m_notice_list.length > 0) {
        setTimeout(setPage, 750, "0");
        //setTimeout(setNoticeDrawInfo, 800, "0");
    } else {
        $('.nav_main li, .nav_gnb li').removeClass('active');
        $(`.nav_main li[code="${1}"], .nav_gnb li[code="${1}"]`).addClass('active');
        //        setTimeout(setPage, 750, "1");        
    }
}

//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_contents_json = data;
            m_notice_list = data.notice_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });

}
//로딩 커버 가리기
function setHideCover() {
    if ($(".cover").css("display") != "none") {
        $('.cover').hide();
    }
}

function setDustJson() {

}

function setDust(_json) {
    console.log("setDust");
    //console.log(_json);
    let t_value = parseInt(_json.pm10_info_num);
    let t_type = getGradeNum10(t_value);
    $("#id_dust_title").html(m_dust_title_list[t_type]);
    $("#id_dust_image").attr("src", m_dust_img_list[t_type]);
    $("#id_dust_value").html(t_value + "㎍/㎥");

}


function getGradeNum10(_num) {
    if (_num == null || _num == undefined || _num == '') {
        return -1;
    } else {
        let t_num = parseFloat(_num);
        if (t_num < 31) {
            return 0;
        } else if (t_num < 81) {
            return 1;
        } else if (t_num < 151) {
            return 2;
        } else {
            return 3;
        }
    }
}

function onClickBtnBack(_obj) {
    if ($("#id_popup_trophy").css("display") != "none") {
        $("#id_popup_trophy").hide();
        return;
    }
    if (m_curr_document != null) {
        m_curr_document.onClickBtnBack();
    }
}

function onClickPopupClose(_obj) {
    $("#id_popup_trophy").hide();
    $("#id_popup_vod").hide();
    $("#id_popup_img").hide();
    $("#id_popup_video_obj")[0].pause();
    $("#id_popup_video_obj")[0].src = '';
}

function onClickBtnHome(_obj) {
    setMainReset();
}

function setMainReset() {

    if (m_notice_list.length > 0) {
        if ($("#id_main_notice").css("display") == "none") {
            setPage("0");
            setNoticeDrawInfo();
        }
    } else {
        //$('.nav_main li, .nav_gnb li').removeClass('active');
        //$(`.nav_main li[code="${1}"], .nav_gnb li[code="${1}"]`).addClass('active');
        //setPage("0");
        $(".landing").show();
    }
    /*
    if ($("#id_main_cont").css("display") == "none") {
        setPage("0");
    }
    */
}

//메인 타이머
function setMainInterval() {
    var time_gap = 0;
    var time_curr = new Date().getTime();

    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
    if (time_gap > 180) {
        m_time_last = time_curr;
        if (getVideoStatus($("#id_popup_video_obj")) == "playing") {
            return;
        }
        setMainReset();
    }

    m_status_time_chk += 1;
    if (m_status_time_chk > 60) {
        m_status_time_chk = 0;
        setCallWebToApp('STATUS', 'STATUS');
        setDateTime();
    }

    m_dust_time_chk += 1;
    if (m_dust_time_chk > 3600) {
        m_dust_time_chk = 0;
        //setDust("");
        setDustJson();
    }
}

function setNoticeDrawInfo() {
    console.log("setNoticeDrawInfo");
    var str_type = '';
    var str_show = '',
        str_hide = '';
    if (m_notice_list.length == 0) return;

    m_curr_notice_cnt++;
    if (m_curr_notice_cnt >= m_notice_list.length) m_curr_notice_cnt = 0;

    var obj = m_notice_list[m_curr_notice_cnt];
    if (m_curr_notice == 1) {
        m_curr_notice = 2;
        str_show = 'id_notice_box_02';
        str_hide = 'id_notice_box_01';
        $('#id_notice_box_01').css('zIndex', 10);
        $('#id_notice_box_02').css('zIndex', 9);
    } else {
        m_curr_notice = 1;
        str_show = 'id_notice_box_01';
        str_hide = 'id_notice_box_02';
        $('#id_notice_box_01').css('zIndex', 10);
        $('#id_notice_box_02').css('zIndex', 9);
    }

    //m_curr_notice_type = obj.type;
    m_curr_notice_type = obj.type = "MOV";
    //console.log(convFilePath(obj.file_path));
    if (obj.type == "MOV") {
        $('#' + str_show + ' > video').attr('src', convFilePath(obj.file_path));
        $('#' + str_show + ' > video').show();
        $('#' + str_show + ' > img').hide();
        $('#' + str_show).children('video')[0].play();
        setCallWebToApp("UNMUTE", "UNMUTE");        
    } else if (obj.type == "IMG") {
        $('#' + str_show + ' > img').attr('src', convFilePath(obj.file_path));
        $('#' + str_show + ' > video').hide();
        $('#' + str_show).children('video')[0].pause();
        $('#' + str_show + ' > img').show();
    }
    m_curr_notice_ptime = parseInt(obj.file_duration);
    if (m_curr_notice_ptime < 5) m_curr_notice_ptime = 5;
    m_curr_notice_ptime = m_curr_notice_ptime * 1000;
    clearTimeout(m_notice_timeout);
    m_notice_timeout = setTimeout(setMainTimeOut, m_curr_notice_ptime);
    setTimeout(setNoticeDrawInfoEnd, 10);
}

function setMainTimeOut() {
    if ($('#id_main_screen_0').css('display') == 'none') {
        return;
    } else {
        setNoticeDrawInfo();
    }
}

function setNoticeDrawInfoEnd() {
    if (m_notice_list.length == 1) {
        if (m_curr_notice == 1) {
            $('#id_notice_box_01').show();
            $('#id_notice_box_02').hide();
        } else {
            $('#id_notice_box_01').hide();
            $('#id_notice_box_02').show();
        }
    } else {
        if (m_curr_notice == 1) {
            $('#id_notice_box_01').show();
            $('#id_notice_box_02').hide();
        } else {
            $('#id_notice_box_01').hide();
            $('#id_notice_box_02').show();
        }
    }
}


function onClickMainMenu(_obj) {
    let t_code = $(_obj).attr('code');
    $('.nav_sub li').removeClass('active');
    $(`.nav_sub li[code="${t_code}"]`).addClass('active');
    setPage(t_code);
}

function setClock() {
    $('.align_top .clock').FlipClock({
        clockFace: 'TwentyFourHourClock',
        showSeconds: false
    });
    $('.align_center .clock').FlipClock({
        clockFace: 'TwentyFourHourClock',
        showSeconds: false
    });
}


function setPage(_code) {
    console.log('index setPage', _code);
    setHideCover();

    $("#id_popup_img").hide();
    $("#id_notice_box_01 video")[0].pause();
    $("#id_notice_box_02 video")[0].pause();
    $("#id_notice_box_01 video")[0].src = '';
    $("#id_notice_box_02 video")[0].src = '';
    $("#id_main_cont").hide();
    $("#id_main_notice").hide();
    $("#id_sub_cont").show();
    $("#id_main_page").hide();
    $(".frame_info").hide();

    switch (_code) {
        case '0':
            $("#id_header").html("");
            m_curr_page = null;
            m_curr_document = null;
            $('.nav_main li, .nav_gnb li').removeClass('active');
            $('#id_main_notice').show();
            //$('#id_main_cont').show();
            break;
        case '1':
            $(".landing").hide();
            setVideosStop();
            $("#id_header").html("학교소개");
            m_curr_page = $('#id_main_frame_intro');
            m_curr_document = m_curr_page.find('iframe')[0].contentWindow;
            m_curr_page.show();
            m_curr_document.setMainReset();
            break;
        case '2':
            $(".landing").hide();
            return;
            setVideosStop();
            $("#id_header").html("학교시설");
            m_curr_page = $('#id_main_frame_info');
            m_curr_document = m_curr_page.find('iframe')[0].contentWindow;
            m_curr_page.show();
            m_curr_document.setMainReset();
            break;
        case '3':
            $(".landing").hide();
            return;
            setVideosStop();
            $("#id_header").html("학사일정");
            m_curr_page = $('#id_main_frame_schedule');
            m_curr_document = m_curr_page.find('iframe')[0].contentWindow;
            m_curr_page.show();
            m_curr_document.setMainReset();
            break;
        case '4':
            $(".landing").hide();
            return;
            setVideosStop();
            $("#id_header").html("갤러리");
            m_curr_page = $('#id_main_frame_gallery');
            m_curr_document = m_curr_page.find('iframe')[0].contentWindow;
            m_curr_page.show();
            m_curr_document.setMainReset();
            break;
    }
}

function setVideosStop() {
    try {
        $("#id_screen_area_01").children("video")[0].pause();
    } catch (err) {}
    try {
        $("#id_screen_area_02").children("video")[0].pause();
    } catch (err) {}
}

function setPopupVod(_obj) {
    setLoadVideo(convFilePath(_obj.file_path));
    $("#id_popup_vod_txt_1").html(_obj.title);
    $("#id_popup_vod").show();
}

function setPopupImg(_obj) {
    m_img_list = _obj.file_list;

    $("#id_popup_img_txt_1").html(_obj.title);
    $("#id_popup_img_txt_2").html(_obj.desc);
    $("#id_popup_img").show();
    setImgListUp();

}

function setPopupTrophy(_obj) {
    //console.log("setPopupTrophy");
    $("#id_popup_trophy_img").attr("src", "");
    $("#id_popup_trophy_img").attr("src", convFilePath(_obj.file_path));
    $("#id_popup_trophy_txt_1").html(_obj.title);
    $("#id_popup_trophy_txt_2").html(_obj.date);
    $("#id_popup_trophy_txt_3").html(_obj.winner);
    $("#id_popup_trophy_txt_4").html(_obj.award);
    $("#id_popup_trophy").show();
}

function setLoadVideo(_url) {
    $("#id_popup_video_obj").attr('src', convFilePath(_url));
    $("#id_popup_video_obj")[0].play();
}


function setImgListUp() {
    $('#id_img_swiper_wrapper').html("");
    if (m_img_list.length == 0) {
        return;
    }

    let r_html = "";
    for (let i = 0; i < m_img_list.length; i += 1) {
        r_html += "<div class='img_zone swiper-slide'>";
        r_html += "    <img src=" + convFilePath(m_img_list[i].file_path) + ">";
        r_html += "</div>";
    }
    $('#id_img_swiper_wrapper').append(r_html);

    m_img_swiper.slideTo(0, 0);
    m_img_swiper.update();
}

function setDateTime() {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let day = today.getDay(); // 요일
    let rour = today.getHours();
    let min = today.getMinutes();
    let t_day_list = ["일", "월", "화", "수", "목", "금", "토"];

    rour = rour.toString().padStart(2, '0');
    min = min.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    date = date.toString().padStart(2, '0');
    $(".date").html(`${year}.${month}.${date} (${t_day_list[day]})`);
    $(".time").html(`${rour}:${min}`);
}

//비디오 재생 정보
function getVideoStatus(_vod) {
    var video = $(_vod)[0];

    if (video.readyState === 0) {
        return "not loaded"; // 비디오가 로드되지 않음
    } else if (video.ended) {
        return "ended"; // 비디오가 끝까지 재생됨
    } else if (video.paused && video.currentTime > 0) {
        return "paused"; // 비디오가 일시 중지 상태
    } else if (video.currentTime > 0 && !video.paused) {
        return "playing"; // 비디오가 재생 중
    } else if (video.readyState >= 3) {
        return "loaded"; // 비디오가 로드되었지만 재생 중이 아님
    } else {
        return "unknown"; // 다른 상태
    }
}
