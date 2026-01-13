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
    let t_str = m_curr_page_num + ", " + (m_img_swiper.activeIndex + 1) + "," + (m_curr_sub_page + 1);
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
//초기화
function setInitSetting() {

    //$("#id_img_1").attr("src", convFilePath(m_schedule_list.history_file_path));
    //$("#id_img_list .img_zone img").hide();

    $("#id_calendar").show();
    $("#id_calendar_zone").show();
    m_schedule_list.academic_list.forEach(function (item) {
        var current_date = new Date(item.start);
        var end_date = new Date(item.end);

        // 시작일부터 종료일까지 하루씩 더해가며 배열에 push
        while (current_date < end_date) {
            m_academic_events.push({
                id: item.id + "_" + current_date.toISOString().split('T')[0], // ID 중복 방지
                title: item.title,
                start: current_date.toISOString().split('T')[0],
                allDay: true,
                display: 'block' // 텍스트가 꽉 차게 표시되도록 설정
            });

            // 날짜를 하루 더함
            current_date.setDate(current_date.getDate() + 1);
        }
    });


    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');

    // 2. JSON 파일 불러오기 (비동기)
    $.getJSON('data/holiday.json', function (holidayData) {
        m_holiday_list = holidayData;
        // [필터링 로직] 불러온 데이터 중 '이번 달'에 해당하는 공휴일만 찾아서 추가
        holidayData.forEach(function (h) {
            // 날짜 문자열(h.start)이 '2025-12'로 시작하는지 확인
            m_academic_events.push({
                id: 'holiday_' + h.start,
                title: h.title,
                start: h.start,
                allDay: true,
                display: 'block',
                // [중요] 스타일 커스텀을 위한 클래스 및 속성 추가
                classNames: ['holiday-event'], // 위 CSS에서 정의한 클래스
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: '#ff0000' // 백업용
            });
        });
        console.log(m_academic_events);
        //setMakeCalander(now.getMonth() + 1);
    });

    //console.log(m_academic_events);


    // 2. 현재 월 구하기 (getMonth()는 0부터 시작하므로 +1 필요)
    let currentMonth = now.getMonth() + 1;
    //onClickMainMenu($(".list_contents li[code='1']"));
    setTimeout(function () {
        onClickMainMenu($(`.list_contents li[code='${currentMonth}']`));
    }, 100);

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

function onClickMainMenu(_obj) {
    //    console.log(_obj);
    let t_code = $(_obj).attr('code');
    setPage(t_code);
}

function setPage(_code, _isBack = false) {
    $("#id_photo_list").hide();
    $("#id_calendar").hide();
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

    $("#id_calendar").show();
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

    // 현재 날짜를 기준으로 이번 달 1일 구하기
    let now = new Date();
    let targetMonth = _month ? parseInt(_month) : (now.getMonth() + 1);
    let targetYear = now.getFullYear();
    // 1 -> '01' 변환
    let strMonth = String(targetMonth).padStart(2, '0');
    // 해당 월의 1일로 설정 (예: 2025-02-01)
    let targetDate = targetYear + '-' + strMonth + '-01';

    // 캘린더 객체가 이미 존재하면 날짜만 이동 (깜빡임 방지 및 성능 최적화)
    if (m_calendar_obj) {
        m_calendar_obj.gotoDate(targetDate);
        m_calendar_obj.render(); // 확실하게 다시 그리기
    } else {
        var calendar_el = document.getElementById('id_calendar_sch');
        m_calendar_obj = new FullCalendar.Calendar(calendar_el, {
            initialView: 'dayGridMonth',
            initialDate: targetDate,
            locale: 'ko',
            headerToolbar: false,
            contentHeight: 900,
            // 5. 불필요한 아랫줄 제거 (고정 6주가 아닌 해당 월의 주 수만큼만 표시)
            fixedWeekCount: false, // 6. 날짜 형식 변경 (3일 -> 3)
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

            // [핵심 수정] 날짜 렌더링 시점 (색상 및 배경 적용)
            dayCellDidMount: function (info) {
                // 1. toISOString() 대신 현지 시간 기준 날짜 문자열 생성 (밀림 현상 해결)
                var year = info.date.getFullYear();
                var month = String(info.date.getMonth() + 1).padStart(2, '0');
                var day = String(info.date.getDate()).padStart(2, '0');
                var dateStr = year + '-' + month + '-' + day;

                var numberEl = info.el.querySelector('.fc-daygrid-day-number');

                // 기본 요일 색상
                if (numberEl) {
                    if (info.date.getDay() === 0) numberEl.style.color = 'red'; // 일
                    if (info.date.getDay() === 6) numberEl.style.color = 'blue'; // 토
                }

                // 공휴일 체크
                if (m_holiday_list && m_holiday_list.length > 0) {
                    var isHoliday = m_holiday_list.some(function (h) {
                        return h.start === dateStr;
                    });

                    if (isHoliday) {
                        // 클래스 추가만으로 CSS에서 배경색과 글자색을 모두 제어합니다.
                        info.el.classList.add('is-holiday');
                    } else {
                        // 공휴일이 아니면 클래스 제거 (달력 이동 시 잔상 방지)
                        info.el.classList.remove('is-holiday');
                    }
                }
            }
        });
        m_calendar_obj.render();
    }


    //$("#id_calendar").hide();

}
