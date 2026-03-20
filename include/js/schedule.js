let m_this_name = "schedule";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_schedule_list = [];
let m_trophy_list = [];

let m_contents_json = null;
let m_main_swiper = null;
let m_img_swiper = null;
let m_academic_events = [];
let m_holiday_list = [];

let m_curr_page_num = 0;
let m_curr_sub_page = -1;
let m_back_list = [];

let m_calendar_obj = null;


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
    let t_str = m_curr_page_num + ", " + 0 + "," + 0;
    return t_str;
}

function setPopupClose() {
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


// 초기화 함수 수정
function setInitSetting() {
    $("#id_calendar").show();
    $("#id_calendar_zone").show();

    // 1. 일반 학사 일정 데이터 가공
    m_schedule_list.academic_list.forEach(function (item) {
        var current_date = new Date(item.start);
        var end_date = new Date(item.end);

        while (current_date < end_date) {
            m_academic_events.push({
                id: item.id + "_" + current_date.toISOString().split('T')[0],
                title: item.title,
                start: current_date.toISOString().split('T')[0],
                allDay: true,
                display: 'block'
            });
            current_date.setDate(current_date.getDate() + 1);
        }
    });

    // 2. 공휴일 데이터 로드 (비동기)
    $.getJSON('data/holiday.json', function (holidayData) {
        // [중요] 전역 변수에 데이터 저장
        m_holiday_list = holidayData;

        // 공휴일을 이벤트 리스트에도 추가 (조건 없이 전체 추가)
        holidayData.forEach(function (h) {
            m_academic_events.push({
                id: 'holiday_' + h.start,
                title: h.title,
                start: h.start,
                allDay: true,
                display: 'block',
                classNames: ['holiday-event'],
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: '#ff0000'
            });
        });

        // ============================================================
        // [핵심 해결] 데이터 로드가 완전히 끝난 이 시점에 메인 메뉴 클릭 트리거
        // 이렇게 해야 캘린더가 생성될 때 공휴일 데이터가 확실하게 존재합니다.
        // ============================================================
        var now = new Date();
        var currentMonth = now.getMonth() + 1;

        // setTimeout 없이 바로 실행해도 안전합니다.
        onClickMainMenu($(`.list_contents li[code='${currentMonth}']`));
    });
}



//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_schedule_list = data.schedule_list;
            //m_img_list = data.schedule_list.photo_list;
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
    m_schedule_list = m_contents_json.schedule_list;
    setInitSetting();
}


function setLEDModeOn() {
    m_mode = "LED";
    $(".sub .wrap").addClass("led");
}


function onClickMainMenu(_obj) {
    //    console.log(_obj);
    let t_code = $(_obj).attr('code');
    setPage(t_code);
}

function setPage(_code, _isBack = false) {
    $("#id_photo_list").hide();
    //    $("#id_calendar").hide();
    //$("#id_calendar_zone_sch").css("top", "2160px");
    $("#id_img_list").hide();
    $("#id_img_list .img_zone img").hide();

    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${_code}"]`).text());

    m_curr_page_num = parseInt(_code);

    if (!_isBack) {
        m_back_list.push(m_curr_page_num);
    }

    //    $("#id_calendar").show();
    //$("#id_calendar_zone_sch").show();
    //$("#id_calendar_zone_sch").css("top", "0px");
    setMakeCalander(m_curr_page_num);
}

function setSubPage(_num, _cnt) {
    console.log("setSubPage", _num, _cnt);
    let t_num = parseInt(_num) - 1;
    if (m_curr_page_num == 5) {
        m_img_swiper.slideTo(t_num, 0);

        console.log(t_num);
        _cnt -= 1;
        //console.log(t_num, _cnt,t_list.length);
        if (_cnt >= 0 && m_img_list.length > 0) {
            let t_cnt = _cnt;
            console.log(t_cnt);
            if (t_cnt < m_img_list.length) {
                onClickImg(t_cnt);
            }
        }
    }
}


function setMainReset() {
    m_back_list = [];
    m_curr_sub_page = -1;

    // 1. 현재 날짜 구하기
    let now = new Date();
    // 2. 현재 월 구하기 (getMonth()는 0부터 시작하므로 +1 필요)
    let currentMonth = now.getMonth() + 1;

    // 3. 현재 월에 해당하는 code를 찾아 클릭 트리거
    // 예: 5월이면 code='5'인 요소를 찾음
    onClickMainMenu($(`.list_contents li[code='${currentMonth}']`));
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


function setMakeCalander(_month) {

    // 1. 날짜 계산
    let now = new Date();
    let targetMonth = _month ? parseInt(_month) : (now.getMonth() + 1);
    let targetYear = now.getFullYear();
    let strMonth = String(targetMonth).padStart(2, '0');
    let targetDate = targetYear + '-' + strMonth + '-01';

    // 2. [핵심 변경] 기존 달력이 있으면 페이지 이동(gotoDate) 대신 파괴(destroy)합니다.
    // 이렇게 해야 DOM이 완전히 새로 그려지며 dayCellDidMount가 100% 실행됩니다.
    if (m_calendar_obj) {
        m_calendar_obj.destroy();
        m_calendar_obj = null;
    }

    // 3. 달력 새로 생성
    var calendar_el = document.getElementById('id_calendar_sch');

    // 비워진 엘리먼트에 새로 생성
    m_calendar_obj = new FullCalendar.Calendar(calendar_el, {
        initialView: 'dayGridMonth',
        initialDate: targetDate, // 계산된 날짜로 시작
        locale: 'ko',
        headerToolbar: false,
        contentHeight: 900,
        fixedWeekCount: false,

        dayCellContent: function (info) {
            var number = info.dayNumberText.replace('일', '');
            return {
                html: '<div>' + number + '</div>'
            };
        },
        dayMaxEvents: true,
        dayHeaderContent: function (arg) {
            var week_days = ['일', '월', '화', '수', '목', '금', '토'];
            return week_days[arg.date.getDay()];
        },
        events: m_academic_events,

        // 스타일 적용 로직
        dayCellDidMount: function (info) {
            var cellYear = info.date.getFullYear();
            var cellMonth = info.date.getMonth() + 1;
            var cellDay = info.date.getDate();

            var numberEl = info.el.querySelector('.fc-daygrid-day-number');

            // 요일 색상
            if (numberEl) {
                if (info.date.getDay() === 0) numberEl.style.color = '#d9534f';
                if (info.date.getDay() === 6) numberEl.style.color = '#337ab7';
            }

            // 공휴일 체크 (숫자 비교 방식)
            if (m_holiday_list && m_holiday_list.length > 0) {
                var isHoliday = m_holiday_list.some(function (h) {
                    var parts = h.start.split('-');
                    if (parts.length === 3) {
                        var hYear = parseInt(parts[0], 10);
                        var hMonth = parseInt(parts[1], 10);
                        var hDay = parseInt(parts[2], 10);
                        return hYear === cellYear && hMonth === cellMonth && hDay === cellDay;
                    }
                    return false;
                });

                if (isHoliday) {
                    // 이제 무조건 로그가 찍혀야 정상입니다.
                    // console.log("공휴일 적용됨:", cellMonth, cellDay);
                    info.el.classList.add('is-holiday');
                } else {
                    info.el.classList.remove('is-holiday');
                }
            }
        }
    });

    // 4. 렌더링
    m_calendar_obj.render();
}
