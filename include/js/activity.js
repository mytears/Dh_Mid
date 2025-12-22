let m_this_name = "activity";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_activity_list = [];
let m_vod_list = [];
let m_img_list = [];

let m_contents_json = null;
let m_img_swiper = null;
let m_vod_swiper = null;

function setInit() {
    console.log(m_this_name + " Init");
    if (this.PAGEACTIVEYN == true) {
        setLoadSetting("include/setting.json");
    }

    $('.nav_snb li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    m_vod_swiper = new Swiper('.vod_swiper', {
        spaceBetween: 500, //슬라이드 간격
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

    m_img_swiper = new Swiper('.img_swiper', {
        spaceBetween: 500, //슬라이드 간격
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

    m_vod_list = m_activity_list.video_list;
    m_img_list = m_activity_list.photo_list;
    if(m_vod_list.length==0){
        $(".no_bg").show();
    }else{
        $(".no_bg").hide();
    }
    setImgListUp();
    setVodListUp();
    onClickMainMenu($(".nav_snb li[code='0']"));
}

function setVodListUp() {
    $('#id_vod_swiper_wrapper').html("");
    if (m_vod_list.length == 0) {
        return;
    }
    let t_max = 8;
    let t_html = "";
    let r_html = "";
    let page_cnt = Math.ceil(m_vod_list.length / t_max);
    for (let i = 0; i < page_cnt; i += 1) {
        t_html += "<ul id='id_vod_wrap_" + i + "' class='video swiper-slide'>";
        t_html += "</ul>";
    }
    $('#id_vod_swiper_wrapper').append(t_html);
    for (let i = 0; i < m_vod_list.length; i += 1) {
        let t_id = Math.floor(i / t_max);
        r_html += "<li onClick='javascript:onClickVod(" + i + ");'>";
        r_html += "    <button>";
        r_html += "        <span class='img_zone'>";
        r_html += "            <img src=" + convFilePath(m_vod_list[i].thumbnail) + ">";
        r_html += "        </span>";
        r_html += "        <span class='txt_zone'>";
        r_html += "            <b>" + m_vod_list[i].title + "</b>";
        r_html += "            <i>" + m_vod_list[i].date + "</i>";
        r_html += "        </span>";
        r_html += "    </button>";
        r_html += "</li>";
        $('#id_vod_wrap_' + t_id).append(r_html);
        r_html = "";
    }

    m_vod_swiper.slideTo(0, 0);
    m_vod_swiper.update();
}

function setImgListUp() {
    $('#id_img_swiper_wrapper').html("");
    if (m_img_list.length == 0) {
        return;
    }
    let t_max = 8;
    let t_html = "";
    let r_html = "";
    let page_cnt = Math.ceil(m_img_list.length / t_max);
    for (let i = 0; i < page_cnt; i += 1) {
        t_html += "<ul id='id_img_wrap_" + i + "' class='swiper-slide'>";
        t_html += "</ul>";
    }
    $('#id_img_swiper_wrapper').append(t_html);
    for (let i = 0; i < m_img_list.length; i += 1) {
        let t_id = Math.floor(i / t_max);
        r_html += "<li onClick='javascript:onClickImg(" + i + ");'>";
        r_html += "    <button>";
        r_html += "        <span class='img_zone'>";
        r_html += "            <img src=" + convFilePath(m_img_list[i].file_list[0].file_path) + ">";
        r_html += "        </span>";
        r_html += "        <span class='txt_zone'>";
        r_html += "            <b>" + m_img_list[i].title + "</b>";
        r_html += "            <i>" + m_img_list[i].date + "</i>";
        r_html += "        </span>";
        r_html += "    </button>";
        r_html += "</li>";
        $('#id_img_wrap_' + t_id).append(r_html);
        r_html = "";
    }

    m_img_swiper.slideTo(0, 0);
    m_img_swiper.update();
}

function onClickVod(_id) {
    if (this.PAGEACTIVEYN == false) {
        window.parent.setPopupVod(m_vod_list[_id]);
    }
}

function onClickImg(_id) {
    if (this.PAGEACTIVEYN == false) {
        window.parent.setPopupImg(m_img_list[_id]);
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
            m_activity_list = data.activity_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });

}

function setDataInit(_contents, _notice_mode) {
    m_notice_mode = _notice_mode;
    setInit();
    m_contents_json = _contents;
    m_header = m_contents_json.header;
    m_introduce_list = m_contents_json.introduce_list;
    m_activity_list = m_contents_json.activity_list;
    setInitSetting();
}

function onClickMainMenu(_obj) {
    //console.log(_obj);
    let t_code = $(_obj).attr('code');
    $('.nav_snb li').removeClass('active');
    $(`.nav_snb li[code="${t_code}"]`).addClass('active');
    setPage(t_code);
}

function setPage(_code) {
    $("#id_vod_list").hide();
    $("#id_img_list").hide();
    switch (_code) {
        case '0':
            $("#id_img_list").show();
            m_img_swiper.slideTo(0, 0);
            m_img_swiper.update();
            break;
        case '1':
            $("#id_vod_list").show();
            m_vod_swiper.slideTo(0, 0);
            m_vod_swiper.update();
            break;
    }
}


function setMainReset() {
    onClickMainMenu($(".nav_snb li[code='0']"));
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
