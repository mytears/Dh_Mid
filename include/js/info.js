let m_this_name = "info";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_infomation_list = [];

let m_contents_json = null;
let m_target_json = null;
let m_building_num = 0;

let m_curr_page_num = 0;
let m_curr_floor_num = 0;
let m_curr_spot_num = 0;

let m_back_list = [];

const m_building_txt_list = [
    // [0] 영역: A로 시작 (본관)
    [
        ["보건실", "한빛서재", "과학실", "행정실", "2-1", "2-2"],
        ["방송실", "교무실", "교장실", "3-1", "3-2", "3-3", "3-4"],
        ["2-3", "2-4", "1-1", "제2교무실", "1-2", "1-3", "1-4"]
    ],
    // [1] 영역: B로 시작 (특별관)
    [
        ["기술가사실"],
        ["음악실"],
        ["영어교과교실"],
        ["Wee클래스실", "회의실"],
        ["미술실"],
        ["컴퓨터실"]
    ],
    // [2] 영역: C로 시작
    [
    ]
];


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

function getPage() {
    console.log("m_curr_spot_num", m_curr_spot_num);
    let t_str = m_curr_page_num + ", " + m_curr_floor_num + ", " + m_curr_spot_num;
    return t_str;
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
    //$("#id_img_0").attr("src",convFilePath(m_infomation_list.all_view_file_path));
    //$("#id_img_1").attr("src",convFilePath(m_infomation_list.floor_1st_file_path));
    //$("#id_img_2").attr("src",convFilePath(m_infomation_list.floor_2nd_file_path));
    //$("#id_img_3").attr("src",convFilePath(m_infomation_list.kinder_file_path));
    //$(".img_zone img").hide();

    //setPage("0");
    //onClickMainMenu($(".list_contents li[code='0']"));
    $("#id_img_main").show();
    $("#id_img_0").attr("src", convFilePath(m_main_map));
    $(".title").hide();
    $('.list_contents li').removeClass('active');
}

//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_infomation_list = data.infomation_list;
            m_main_map = m_infomation_list.main_file_path;
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
    m_infomation_list = m_contents_json.infomation_list;
    m_main_map = m_infomation_list.main_file_path;
    setInitSetting();
}

function setLEDModeOn() {
    m_mode = "LED";
    $(".sub .wrap").addClass("led");
}


function onClickMainMenu(_obj) {
    //console.log(_obj);
    let t_code = $(_obj).attr('code');
    setPage(t_code);
}

function setPage(_code, _isBack = false) {
    //$(".img_zone img").hide();
    $("#id_img_main").hide();
    $("#id_img_list").show();
    $(".title").show();

    //$("#id_img_"+_code).show();
    m_curr_page_num = parseInt(_code);
	
    if (!_isBack) {
        m_back_list.push(m_curr_page_num);
    }
    
    if (m_curr_page_num == 0) {
        $("#id_img_main").show();
        $("#id_img_list").hide();
        $(".title").hide();
        $('.list_contents li').removeClass('active');
        return;
    }

    m_building_num = parseInt(_code) - 1;
    m_target_json = null;
    if (m_building_num == 0) {
        m_target_json = m_infomation_list.main_building;
    } else if (m_building_num == 1) {
        m_target_json = m_infomation_list.sub_building;
    }
    //console.log(m_target_json.length);

    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${_code}"]`).text());

    let htmlContent0 = "";
    $(".list_map").html(htmlContent0);
    for (var i = m_target_json.length - 1; i >= 0; i -= 1) {
        htmlContent0 += `<li code="${i}"><button>${m_target_json[i].floor}</button></li>`;
    }
    $(".list_map").html(htmlContent0);

    $('.list_map li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnFloor(this);
    });

    onClickBtnFloor($(".list_map li[code='0']"));
    //setFloor(m_building_num,0);
}

function setSubPage(_num, _cnt) {
    _num -= 1;
    _cnt -= 1;
    if (_num >= 0) {
        onClickBtnFloor($(".list_map li[code='" + _num + "']"));
        if (_cnt >= 0) {
            console.log(_cnt);
            onClickBtnSpot($(".list_area li").eq(_cnt));
        }
    }

}

function onClickBtnFloor(_obj) {
    let t_i = parseInt($(_obj).attr("code"));
    $(".floor").html(m_target_json[t_i].floor);
    setFloor(m_building_num, t_i);
}

function setFloor(_building, _floor) {
    m_curr_floor_num = _floor + 1;

    $('.list_map li').removeClass("active");
    $($(".list_map li[code='" + _floor + "']")).addClass("active");

    $("#id_img_left").attr("src", convFilePath(m_target_json[_floor].file_path));
    const prefix = ["A", "B", "C"]; // 0:A, 1:B, 2:C
    let htmlContent0 = "";
    let htmlContent1 = "";
    $(".areaLink").html(htmlContent0);
    $(".list_area").html(htmlContent1);

    // _building과 _floor 인덱스를 사용하여 데이터에 직접 접근
    // 예: m_building_txt_list[0][1] -> 건물 A의 2층 데이터
    const targetList = m_building_txt_list[_building][_floor];
    const char = prefix[_building];
    let groupNum = _floor + 1;

    
    if (targetList) {

        targetList.forEach((text, iIdx) => {
            const itemNum = iIdx + 1;
            // 클래스명 규칙: area + A/B/C + 층번호 + - + 순번
            const className = `area${char}${groupNum}-${itemNum}`;

            htmlContent0 += `    <li class="${className}"><button>${text}</button></li>`;
            htmlContent1 += `    <li code="${className}"><button>${text}</button></li>`;
        });
    }

    // 결과를 .container에 삽입
    $(".areaLink").html(htmlContent0);
    $(".list_area").html(htmlContent1);

    m_curr_spot_num = 0;

    $('.list_area li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickBtnSpot(this);
    });
}

function onClickBtnSpot(_obj) {
    $('.list_area li').removeClass("active");
    $(_obj).addClass("active");
    //console.log($(_obj).attr('code'));
    $('.areaLink li').removeClass("active");
    $(`.areaLink .${$(_obj).attr('code')}`).addClass("active");

    let idx = $(_obj).index();
    m_curr_spot_num = idx + 1;
    console.log("m_curr_spot_num", m_curr_spot_num);

}

function setMainReset() {
    m_back_list = [];
    //    onClickMainMenu($(".list_contents li[code='1']"));
    $("#id_img_main").show();
    $("#id_img_list").hide();
    $(".title").hide();
    onClickMainMenu($(".list_contents li[code='1']"));

}


function onClickBtnBack() {
    
    // 리스트가 비어있으면 메인 리셋
    if (m_back_list.length == 0) {
        window.parent.setMainReset();
        return; // 함수 종료
    }

    // 1. 마지막에 저장된 것을 지움 (pop 사용, 변수에 재할당 금지)
    m_back_list.pop(); 
    console.log(m_back_list);
    // 2. 지우고 나서 남은게 있는지 확인
    if (m_back_list.length == 0) {
        // 지웠더니 더 이상 갈 곳이 없다면? -> 메인 리셋으로 가거나 처리 필요
        window.parent.setMainReset();
    } else {
        // 3. 그 다음에 마지막인걸(이전 페이지) 가져와서 이동
        let t_page = m_back_list[m_back_list.length - 1];
        console.log(t_page);
        setPage(t_page, true);
    }
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
