let m_this_name = "history";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_history_list = [];

let m_contents_json = null;
let m_curr_cate_num = "0";

function setInit() {
    console.log(m_this_name + " Init");
    if (this.PAGEACTIVEYN == true) {
        setLoadSetting("include/setting.json");
    }

    $('.nav_snb li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    $('.dep1 li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCoverMenu(this);
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

//초기화
function setInitSetting() {
    if(m_history_list_0.length!=0){
        $("#id_img_00").attr("src", convFilePath(m_history_list_0.history_file_path));
        $("#id_img_01").attr("src", convFilePath(m_history_list_0.symbol_file_path));
        $("#id_img_02").attr("src", convFilePath(m_history_list_0.graduate_file_path));
    }
    if(m_history_list_1.length!=0){
        $("#id_img_10").attr("src", convFilePath(m_history_list_1.history_file_path));
        $("#id_img_11").attr("src", convFilePath(m_history_list_1.symbol_file_path));
        $("#id_img_12").attr("src", convFilePath(m_history_list_1.graduate_file_path));
    }
    $("#id_img_list .img_zone img").hide();

    //onClickMainMenu($(".nav_snb li[code='0']"));
}
//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_history_list_0 = getHistoryList(data.history_list,"CATE_01");
            m_history_list_1 = getHistoryList(data.history_list,"CATE_02");
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}

function getHistoryList(_list, _code){
    let t_list = [];
    for(var i=0;i<_list.length;i+=1){
        if(_list[i].category == _code){
            t_list = _list[i];
            break;
        }
    }
    
    return t_list;
}

function setDataInit(_contents, _notice_mode){
    m_notice_mode = _notice_mode;
    setInit();
    m_contents_json = _contents;
    m_header = m_contents_json.header;
    m_history_list_0 = getHistoryList(m_contents_json.history_list,"CATE_01");
    m_history_list_1 = getHistoryList(m_contents_json.history_list,"CATE_02");
    setInitSetting();
}

function onClickMainMenu(_obj) {
    let t_code = $(_obj).attr('code');
    $('.nav_snb li').removeClass('active');
    $(`.nav_snb li[code="${t_code}"]`).addClass('active');
    setPage(t_code);
}

function onClickCoverMenu(_obj) {
    let t_code = $(_obj).attr('code');
    setCoverPage(t_code);
}

function setCoverPage(_code) {
    m_curr_cate_num = _code.substr(0,1);
    //$("#id_img_list .img_zone img").hide();
    //$("#id_img_" + _code).show();
    
    onClickMainMenu($(".nav_snb li[code='"+_code.substr(1,1)+"']"));
    $(".nav_snb").show();
    $(".history").hide();
}

function setPage(_code) {
    $("#id_img_list .img_zone img").hide();
    $("#id_img_" + m_curr_cate_num+_code).show();
}

function setMainReset() {
    $(".nav_snb").hide();
    $(".history").show();
}


function onClickBtnBack() {
    
    if ($(".history").css("display") == "none") {
        $(".history").show();
        $(".nav_snb").hide();
        return;
    }
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
