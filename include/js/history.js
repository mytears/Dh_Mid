let m_this_name = "history";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_history_list = [];
let m_trophy_list = [];

let m_contents_json = null;
let m_main_swiper = null;
let m_people_swiper = null;
let m_photo_swiper = null;
let m_alumni_swiper = null;

let m_img_list = [];
let m_people_list = [];
let m_photo_list = [];
let m_akumni_list = [];

let m_curr_page_num = 0;
let m_curr_sub_page = -1;

function setInit() {
    console.log(m_this_name + " Init");
    if (this.PAGEACTIVEYN == true) {
        setLoadSetting("include/setting.json");
    }

    $('.list_contents li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    m_people_swiper = new Swiper('#id_people_list .img_swiper', {
        spaceBetween: 200, //슬라이드 간격
        centeredSlides: true,
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

    m_photo_swiper = new Swiper('#id_photo_list .img_swiper', {
        spaceBetween: 200, //슬라이드 간격
        centeredSlides: true,
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

    m_alumni_swiper = new Swiper('#id_alumni_list .img_swiper', {
        spaceBetween: 200, //슬라이드 간격
        centeredSlides: true,
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
}

function getPage() {
    let t_str = m_curr_page_num + ", 0, 0";
    if (m_curr_page_num == 2) {
        t_str = m_curr_page_num + ", " + (m_people_swiper.activeIndex + 1) + "," + (m_curr_sub_page + 1);
    } else if (m_curr_page_num == 3) {
        t_str = m_curr_page_num + ", " + (m_photo_swiper.activeIndex + 1) + "," + (m_curr_sub_page + 1);
    } else if (m_curr_page_num == 4) {
        t_str = m_curr_page_num + ", " + (m_alumni_swiper.activeIndex + 1) + "," + (m_curr_sub_page + 1);
    }

    return t_str;
}

function setPopupClose(){
    m_curr_sub_page = -1;
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
            setContents();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}
//초기화
function setInitSetting() {

    setImgListUp("people");
    setImgListUp("photo");
    setImgListUp("alumni");

    $("#id_img_1").attr("src", convFilePath(m_history_list.history_file_path));
    $("#id_img_2").attr("src", convFilePath(m_history_list.people_file_path));
    //$("#id_img_3").attr("src", convFilePath(m_history_list.history_file_path));
    $("#id_img_4").attr("src", convFilePath(m_history_list.alumni_file_path));
    $("#id_img_list .img_zone img").hide();

    onClickMainMenu($(".list_contents li[code='1']"));
}
//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_history_list = data.history_list;
            m_img_list = data.history_list.photo_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}

function setImgListUp(_type) {

    if (_type == "people") {
        m_img_list = m_people_list;
    } else if (_type == "photo") {
        m_img_list = m_photo_list;
    } else if (_type == "alumni") {
        m_img_list = m_alumni_list;
    }

    $('#id_' + _type + '_swiper_wrapper').html("");
    if (m_img_list.length == 0) {
        return;
    }
    let t_max = 8;
    let t_html = "";
    let r_html = "";
    let page_cnt = Math.ceil(m_img_list.length / t_max);
    for (let i = 0; i < page_cnt; i += 1) {
        t_html += "<ul id='id_" + _type + "_wrap_" + i + "' class='swiper-slide'>";
        t_html += "</ul>";
    }
    $('#id_' + _type + '_swiper_wrapper').append(t_html);
    for (let i = 0; i < m_img_list.length; i += 1) {
        let t_id = Math.floor(i / t_max);
        r_html += "<li onClick='javascript:onClickImg(" + i + ");'>";
        r_html += "    <button>";
        r_html += "        <span class='img_zone'>";
        r_html += "            <div class='cover'></div>";
        r_html += "            <img src=" + convFilePath(m_img_list[i].file_list[0].file_path) + ">";
        r_html += "        </span>";
        r_html += "        <span class='txt_zone'>";
        r_html += "            <b>" + m_img_list[i].title + "</b>";
        r_html += "            <i>" + m_img_list[i].date + "</i>";
        r_html += "        </span>";
        r_html += "    </button>";
        r_html += "</li>";
        $("#id_" + _type + "_wrap_" + t_id).append(r_html);
        r_html = "";
    }
    if (_type == "people") {
        m_people_swiper.slideTo(0, 0);
        m_people_swiper.update();
    } else if (_type == "photo") {
        m_photo_swiper.slideTo(0, 0);
        m_photo_swiper.update();
    } else if (_type == "alumni") {
        m_alumni_swiper.slideTo(0, 0);
        m_alumni_swiper.update();
    }
}

function onClickImg(_id) {
    m_curr_sub_page = _id;
    if (this.PAGEACTIVEYN == false) {
        window.parent.setPopupImg(m_img_list[_id], _id);
    }
}

function setDataInit(_contents, _notice_mode) {
    m_notice_mode = _notice_mode;
    setInit();
    m_contents_json = _contents;
    m_header = m_contents_json.header;
    m_history_list = m_contents_json.history_list;

    m_people_list = m_contents_json.history_list.people_list;
    m_photo_list = m_contents_json.history_list.photo_list;
    m_alumni_list = m_contents_json.history_list.alumni_list;

    setInitSetting();
}

function onClickMainMenu(_obj) {
    //    console.log(_obj);
    let t_code = $(_obj).attr('code');
    setPage(t_code);
}

function setPage(_code) {
    $("#id_people_list").hide();
    $("#id_photo_list").hide();
    $("#id_alumni_list").hide();
    $("#id_img_list").hide();
    $("#id_img_list .img_zone img").hide();

    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${_code}"]`).text());

    m_curr_page_num = parseInt(_code);

    if (m_curr_page_num == 1) {
        $("#id_img_" + _code).show();
        $("#id_img_list").show();
    } else if (m_curr_page_num == 2) {
        m_people_swiper.slideTo(0, 0);
        $("#id_people_list").show();
    } else if (m_curr_page_num == 3) {
        m_photo_swiper.slideTo(0, 0);
        $("#id_photo_list").show();
    } else if (m_curr_page_num == 4) {
        m_alumni_swiper.slideTo(0, 0);
        $("#id_alumni_list").show();
    }
}

function setSubPage(_num, _cnt) {
    console.log("setSubPage", _num, _cnt);
    let t_num = parseInt(_num) - 1;
    let t_list = [];
    if (m_curr_page_num == 2) {
        m_people_swiper.slideTo(t_num, 0);
        t_list = m_people_list;
    } else if (m_curr_page_num == 3) {
        m_photo_swiper.slideTo(t_num, 0);
        t_list = m_photo_list;
    } else if (m_curr_page_num == 4) {
        m_alumni_swiper.slideTo(t_num, 0);
        t_list = m_alumni_list;
    }
    _cnt -= 1;
    //console.log(t_num, _cnt,t_list.length);
    if (_cnt >= 0 && t_list.length > 0) {
        let t_cnt = _cnt;
        console.log(t_cnt);
        if (t_cnt < t_list.length) {
            onClickImg(t_cnt);
        }
    }
}

function setMainReset() {
    m_curr_sub_page = -1;
    onClickMainMenu($(".list_contents li[code='1']"));
}


function onClickBtnBack() {
    window.parent.setMainReset();
}


function setMainInterval() {
    var time_gap = 0;
    var time_curr = new Date().getTime();

    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
}

function setDateTime() {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let day = today.getDay(); // 요일
    let rour = today.getHours();
    let min = today.getMinutes();
}
