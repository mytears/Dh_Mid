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

    $('.list_contents li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
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
    $("#id_img_1").attr("src", convFilePath(m_introduce_list.greetings_file_path));
    $("#id_img_2").attr("src", convFilePath(m_introduce_list.symbol_file_path));
    $("#id_img_3").attr("src", convFilePath(m_introduce_list.history_file_path));
    $("#id_img_4").attr("src", convFilePath(m_introduce_list.objective_file_path));
    $("#id_img_list .img_zone img").hide();

    onClickMainMenu($(".list_contents li[code='0']"));
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
//    console.log(_obj);
    let t_code = $(_obj).attr('code');
    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${t_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${t_code}"]`).text());
    setPage(t_code);
}

function setPage(_code) {
    $("#id_img_list").hide();
    $("#id_img_list .img_zone img").hide();
    if (parseInt(_code) < 5) {
        $("#id_img_" + _code).show();
        $("#id_img_list").show();
    } else {
        
    }
}


function setMainReset() {
    onClickMainMenu($(".list_contents li[code='0']"));
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
