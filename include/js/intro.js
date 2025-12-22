let m_this_name = "intro";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_introduce_list = [];
let m_trophy_list = [];

let m_contents_json = null;
let m_main_swiper = null;

function setInit() {
    console.log(m_this_name + " Init");
    if (this.PAGEACTIVEYN == true) {
        setLoadSetting("include/setting.json");
    }

    $('.nav_snb li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    m_main_swiper = new Swiper('.main_swiper', {
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
    $("#id_img_0").attr("src", convFilePath(m_introduce_list.greetings_file_path));
    $("#id_img_1").attr("src", convFilePath(m_introduce_list.objective_file_path));
    $("#id_img_2").attr("src", convFilePath(m_introduce_list.symbol_file_path));
    $("#id_img_3").attr("src", convFilePath(m_introduce_list.history_file_path));
    $("#id_img_4").attr("src", convFilePath(m_introduce_list.special_file_path));
    $("#id_img_list .img_zone img").hide();

    setTrophyListUp();
    onClickMainMenu($(".nav_snb li[code='0']"));
}

function setTrophyListUp() {
    $('#id_main_swiper_wrapper').html("");
    if (m_trophy_list.length == 0) {
        return;
    }
    let t_max = 15;
    let t_html = "";
    let r_html = "";
    let page_cnt = Math.ceil(m_trophy_list.length / t_max);
    for (let i = 0; i < page_cnt; i += 1) {
        t_html += "<ul id='id_main_wrap_" + i + "' class='swiper-slide'>";
        t_html += "</ul>";
    }
    $('#id_main_swiper_wrapper').append(t_html);
    for (let i = 0; i < m_trophy_list.length; i += 1) {
        let t_id = Math.floor(i / t_max);
        r_html += "<li onClick='javascript:onClickItem(" + i + ");'>";
        r_html += "    <button>";
        r_html += "        <div class='img_zone'>";
        r_html += "            <img src=" + convFilePath(m_trophy_list[i].file_path) + ">";
        r_html += "        </div>";
        r_html += "    </button>";
        r_html += "</li>";
        $('#id_main_wrap_' + t_id).append(r_html);
        r_html = "";
    }

    m_main_swiper.slideTo(0, 0);
    m_main_swiper.update();
}

function onClickItem(_id) {
    if (this.PAGEACTIVEYN == false) {
        window.parent.setPopupTrophy(m_trophy_list[_id]);
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
            m_introduce_list = data.introduce_list;
            m_trophy_list = data.trophy_list;
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
    m_trophy_list = m_contents_json.trophy_list;
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
    $("#id_img_list").hide();
    $("#id_trophy_list").hide();
    $("#id_img_list .img_zone img").hide();
    if (parseInt(_code) < 5) {
        $("#id_img_" + _code).show();
        $("#id_img_list").show();
    } else {
        $("#id_trophy_list").show();
        m_main_swiper.slideTo(0, 0);
        m_main_swiper.update();
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
