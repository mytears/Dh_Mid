let m_this_name = "education";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_education_list = [];
let m_trophy_list = [];

let m_contents_json = null;
let m_main_swiper = null;
let m_img_swiper = null;
let m_academic_events = [];
let m_meal_events = [];
let m_event_events = [];
let m_holiday_list = [];

let m_curr_page = 0;
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

    m_img_swiper = new Swiper('.img_swiper', {
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
    let t_str = m_curr_page + ", " + (m_img_swiper.activeIndex + 1) + "," + (m_curr_sub_page + 1);
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

    setImgListUp();

    $("#id_img_1").attr("src", convFilePath(m_education_list.history_file_path));
    $("#id_img_list .img_zone img").hide();

    onClickMainMenu($(".list_contents li[code='1']"));
    $("#id_calendar").show();
    $("#id_calendar_zone_sch").show();
    $("#id_calendar_zone_meal").show();
    $("#id_calendar_zone_event").show();

    m_education_list.academic_list.forEach(function (item) {
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


    m_education_list.meal_list.forEach(function (item) {
        var current_date = new Date(item.start);
        var end_date = new Date(item.end);

        // 시작일부터 종료일까지 하루씩 더해가며 배열에 push
        while (current_date < end_date) {
            m_meal_events.push({
                id: item.id + "_" + current_date.toISOString().split('T')[0], // ID 중복 방지
                title: item.description.replace(/\n/g, '<br>'),
                start: current_date.toISOString().split('T')[0],
                allDay: true,
                display: 'block' // 텍스트가 꽉 차게 표시되도록 설정
            });

            // 날짜를 하루 더함
            current_date.setDate(current_date.getDate() + 1);
        }
    });


    m_education_list.event_list.forEach(function (item) {
        var current_date = new Date(item.start);
        var end_date = new Date(item.end);

        // 시작일부터 종료일까지 하루씩 더해가며 배열에 push
        while (current_date < end_date) {
            m_event_events.push({
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

    $(".calendar_title").html(now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0'));
    var currentMonthPrefix = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var firstDayOfMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';
    // 2. JSON 파일 불러오기 (비동기)
    $.getJSON('data/holiday.json', function (holidayData) {
        m_holiday_list = holidayData;
        // [필터링 로직] 불러온 데이터 중 '이번 달'에 해당하는 공휴일만 찾아서 추가
        holidayData.forEach(function (h) {
            // 날짜 문자열(h.start)이 '2025-12'로 시작하는지 확인
            if (h.start.startsWith(currentMonthPrefix)) {
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
                m_meal_events.push({
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
                m_event_events.push({
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
            }
        });
        console.log(m_academic_events);
        setMakeCalander();
    });

    //console.log(m_academic_events);


}
//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_education_list = data.education_list;
            m_img_list = data.education_list.photo_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
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
        r_html += "            <div class='cover'></div>";
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
    m_education_list = m_contents_json.education_list;
    m_img_list = m_contents_json.education_list.photo_list;
    setInitSetting();
}

function onClickMainMenu(_obj) {
    //    console.log(_obj);
    let t_code = $(_obj).attr('code');
    setPage(t_code);
}

function setPage(_code) {
    $("#id_photo_list").hide();
    $("#id_calendar").hide();
    $("#id_calendar_zone_sch").css("top", "2160px");
    $("#id_calendar_zone_meal").css("top", "2160px");
    $("#id_calendar_zone_event").css("top", "2160px");
    $("#id_img_list").hide();
    $("#id_img_list .img_zone img").hide();

    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${_code}"]`).text());

    m_curr_page = parseInt(_code);

    if (m_curr_page == 1) {

    } else if (m_curr_page == 2) {
        $("#id_calendar").show();
        //$("#id_calendar_zone_sch").show();
        $("#id_calendar_zone_sch").css("top", "0px");
    } else if (m_curr_page == 3) {
        $("#id_calendar").show();
        //$("#id_calendar_zone_meal").show();
        $("#id_calendar_zone_meal").css("top", "0px");
    } else if (m_curr_page == 4) {
        $("#id_calendar").show();
        //$("#id_calendar_zone_event").show();
        $("#id_calendar_zone_event").css("top", "0px");

    } else if (m_curr_page == 5) {
        m_img_swiper.slideTo(0, 0);
        $("#id_photo_list").show();

    }
}

function setSubPage(_num, _cnt) {
    console.log("setSubPage", _num, _cnt);
    let t_num = parseInt(_num) - 1;
    if (m_curr_page == 5) {
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


function setMakeCalander() {

    var calendar_el = null;
    var calendar_obj = null;

    calendar_el = document.getElementById('id_calendar_sch');
    // 현재 날짜를 기준으로 이번 달 1일 구하기
    var now = new Date();
    var firstDayOfMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';
    //console.log(m_academic_events);
    calendar_obj = new FullCalendar.Calendar(calendar_el, {
        initialView: 'dayGridMonth',
        initialDate: firstDayOfMonth,
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

            // 공휴일 체크 및 스타일 적용
            if (m_holiday_list && m_holiday_list.length > 0) {
                var isHoliday = m_holiday_list.some(function (h) {
                    return h.start === dateStr;
                });

                if (isHoliday) {
                    // 1) 날짜 숫자 색상 빨간색으로 변경
                    if (numberEl) {
                        numberEl.style.color = '#d9534f';
                    }
                    // 2) [요청사항] 배경색 변경 (#fff5f5)
                    info.el.style.backgroundColor = '#fff5f5';
                }
            }
        }
    });

    calendar_obj.render();


    calendar_el = document.getElementById('id_calendar_meal');
    // 현재 날짜를 기준으로 이번 달 1일 구하기
    var now = new Date();
    var firstDayOfMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';
    //console.log(m_academic_events);
    calendar_obj = new FullCalendar.Calendar(calendar_el, {
        initialView: 'dayGridMonth',
        initialDate: firstDayOfMonth,
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

        events: m_meal_events,

        // [추가] 이벤트의 타이틀을 HTML로 렌더링하는 설정
        eventContent: function (arg) {
            return {
                html: '<div class="fc-event-title">' + arg.event.title + '</div>'
            };
        },

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

            // 공휴일 체크 및 스타일 적용
            if (m_holiday_list && m_holiday_list.length > 0) {
                var isHoliday = m_holiday_list.some(function (h) {
                    return h.start === dateStr;
                });

                if (isHoliday) {
                    // 1) 날짜 숫자 색상 빨간색으로 변경
                    if (numberEl) {
                        numberEl.style.color = '#d9534f';
                    }
                    // 2) [요청사항] 배경색 변경 (#fff5f5)
                    info.el.style.backgroundColor = '#fff5f5';
                }
            }
        }
    });

    calendar_obj.render();


    calendar_el = document.getElementById('id_calendar_event');
    // 현재 날짜를 기준으로 이번 달 1일 구하기
    var now = new Date();
    var firstDayOfMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';
    //console.log(m_academic_events);
    calendar_obj = new FullCalendar.Calendar(calendar_el, {
        initialView: 'dayGridMonth',
        initialDate: firstDayOfMonth,
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

        events: m_event_events,

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

            // 공휴일 체크 및 스타일 적용
            if (m_holiday_list && m_holiday_list.length > 0) {
                var isHoliday = m_holiday_list.some(function (h) {
                    return h.start === dateStr;
                });

                if (isHoliday) {
                    // 1) 날짜 숫자 색상 빨간색으로 변경
                    if (numberEl) {
                        numberEl.style.color = '#d9534f';
                    }
                    // 2) [요청사항] 배경색 변경 (#fff5f5)
                    info.el.style.backgroundColor = '#fff5f5';
                }
            }
        }
    });

    calendar_obj.render();

    $("#id_calendar").hide();

}
