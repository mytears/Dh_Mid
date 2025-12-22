<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INFORMATION</title>
    <link rel="stylesheet" href="include/css/lib/swiper.css">
    <link rel="stylesheet" href="include/css/lib/flipclock.css">
    <link rel="stylesheet" href="include/css/common.css">
    <link rel="stylesheet" href="include/css/default.css">
    <link rel="stylesheet" href="include/css/style.css">
    <link rel="stylesheet" href="include/css/index.css">
    <link rel="stylesheet" href="include/css/index.css">

    <script src="include/js/lib/gsap.min.js"></script>
    <script src="include/js/lib/ScrollToPlugin.min.js"></script>
    <script src="include/js/lib/swiper.js"></script>
    <script src="include/js/lib/jquery-3.7.1.min.js"></script>
    <script src="include/js/lib/flipclock.js"></script>
    <script src="include/js/comm.js"></script>
    <script src="include/js/index.js"></script>

</head>

<body>
    <div class="cover">
        <div class="loading-spinner"></div>
    </div>
    <main id="id_main_notice" class="list_main">
        <div id="id_page_notice_list" class="notice_main">
            <div id="id_notice_box_01" class="notice_box" style="display:none;">
                <img src="">
                <video muted preload>
                    <source src="">
                </video>
            </div>
            <div id="id_notice_box_02" class="notice_box" style="display:none;">
                <img src="">
                <video muted preload>
                    <source src="">
                </video>
            </div>
        </div>
    </main>
    <main id="id_main_cont" class="main" style="display: none">
        <div class="align_top">
            <div class="clock"></div>
            <div class="date">2024.08.13 (화)</div>
        </div>
        <div class="title_main">
            <img src="images/img_title.png" alt="">
        </div>
        <nav class="nav_main">
            <ul>
                <li code="1">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
                <li code="2">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
                <li code="3">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
                <li code="4">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
                <li code="5">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
                <li code="6">
                    <a>
                        <img src="" alt="">
                    </a>
                </li>
            </ul>
        </nav>
    </main>

    <main id="id_sub_cont" class="sub">
        <div class="img_sub_01 bg_deco"><img src="images/img_sub_01.png" alt=""></div>
        <div class="img_sub_02 bg_deco"><img src="images/img_sub_02.png" alt=""></div>
        <div class="img_sub_03 bg_deco"><img src="images/img_sub_03.png" alt=""></div>
        <div class="img_sub_04 bg_deco"><img src="images/img_sub_04.png" alt=""></div>

        <div class="sub_container area_main">
            <div class="container">
                <header id="id_header">학교안내</header>
                <div class="sub_page_main">
                    <div id="id_main_frame_history" class="frame_info">
                        <iframe allowTransparency="true" name="frame_history" src="history"></iframe>
                    </div>
                    <div id="id_main_frame_info" class="frame_info">
                        <iframe allowTransparency="true" name="frame_info" src="info"></iframe>
                    </div>
                    <div id="id_main_frame_intro" class="frame_info">
                        <iframe allowTransparency="true" name="frame_intro" src="intro"></iframe>
                    </div>
                    <div id="id_main_frame_situation" class="frame_info">
                        <iframe allowTransparency="true" name="frame_situation" src="situation"></iframe>
                    </div>
                    <div id="id_main_frame_schedule" class="frame_info">
                        <iframe allowTransparency="true" name="frame_schedule" src="schedule"></iframe>
                    </div>
                    <div id="id_main_frame_activity" class="frame_info">
                        <iframe allowtransparency="true" name="frame_activity" src="activity"></iframe>
                    </div>
                </div>
            </div>
        </div>

        <div id="id_popup_trophy" class="popup_bg" style="display:none;">
            <div class="popup popup_trophy">

                <b><img src="images/ico_photo.png" alt="">트로피 전시관</b>
                <span></span>

                <div class="inner">
                    <div class="img_zone">
                        <img id="id_popup_trophy_img" src="" alt="">
                    </div>

                    <table>
                        <tbody>
                            <tr class="tr_01">
                                <th>대회명</th>
                                <td id="id_popup_trophy_txt_1">제12회 한국학원총연합회장흥군지부장기
                                    초·중학생 주산경기대회</td>
                            </tr>
                            <tr class="tr_02">
                                <th>수상일</th>
                                <td id="id_popup_trophy_txt_2">1988.5.28. </td>
                            </tr>
                            <tr class="tr_03">
                                <th>수상자</th>
                                <td id="id_popup_trophy_txt_3">대덕국민학교</td>
                            </tr>
                            <tr class="tr_04">
                                <th>수여기관</th>
                                <td id="id_popup_trophy_txt_4">한국학원총연합회 장흥군지부</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button class="btn_close"><img src="images/btn_close.png" alt=""></button>
            </div>
        </div>
        <div id="id_popup_vod" class="popup_bg ">
            <div class="popup popup_photo">

                <b><img src="images/ico_video.png" alt="">영상갤러리</b>
                <strong id="id_popup_vod_txt_1"></strong>
                <span></span>

                <div class="vod_zone">
                    <video id="id_popup_video_obj" preload>
                        <source src="">
                    </video>
                </div>

                <button class="btn_close"><img src="images/btn_close.png" alt=""></button>
            </div>
        </div>
        <div id="id_popup_img" class="popup_bg ">
            <div class="popup popup_photo">

                <b><img src="images/ico_photo.png" alt="">사진갤러리</b>
                <strong id="id_popup_img_txt_1"></strong>
                <span></span>

                <div id="id_img_list" class="">
                    <div id="id_swiper" class="img_swiper">
                        <div id="id_img_swiper_wrapper" class="swiper-wrapper">
                            <div class="img_zone">
                                <img src="" alt="">
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                </div>
                <!--
                <div class="img_zone">
                    <img id="id_popup_img_img" src="" alt="">
                </div>

                <ul class="dot">
                    <li class="active"><button></button></li>
                    <li><button></button></li>
                    <li><button></button></li>
                </ul>
-->

                <p id="id_popup_img_txt_2"></p>

                <button class="btn_close"><img src="images/btn_close.png" alt=""></button>

                <!--

                <div class="btn_slide">
                    <button class="btn_prev"><img src="images/btn_prev.png" alt=""></button>
                    <button class="btn_next"><img src="images/btn_next.png" alt=""></button>
                </div>
-->

            </div>
        </div>
        <div class="btn_zone">
            <div class="group_btn">
                <a class="btn_home"><img src="images/btn_home.png" alt=""></a>
                <button class="btn_back"><img src="images/btn_back.png" alt=""></button>
            </div>
        </div>
        <section class="area_side">
            <div class="align_top"><img src="images/img_daedeok.png" alt=""></div>
            <div class="align_center">
                <!--                <div class="time"></div>-->
                <div class="clock"></div>
                <div class="date">2024.08.13 (화)</div>
                <div class="dust">
                    <div class="dust_img">
                        <img id="id_dust_image" src="images/img_dust_04.png" alt="">
                    </div>
                    <div class="dust_info">
                        <strong>미세먼지</strong>
                        <b id="id_dust_title">좋음</b>
                        <i id="id_dust_value">14㎍/㎥</i>
                    </div>
                </div>
            </div>
            <nav class="nav_gnb">
                <ul>
                    <li code="1">
                        <a>
                            <span><img src="images/ico_gnb_01.png" alt=""></span>
                            <i>역사관</i>
                        </a>
                    </li>
                    <li code="2" class="active">
                        <a>
                            <span><img src="images/ico_gnb_02.png" alt=""></span>
                            <i>학교안내</i>
                        </a>
                    </li>
                    <li code="3">
                        <a>
                            <span><img src="images/ico_gnb_03.png" alt=""></span>
                            <i>학교소개</i>
                        </a>
                    </li>
                    <li code="4">
                        <a>
                            <span><img src="images/ico_gnb_04.png" alt=""></span>
                            <i>학교현황</i>
                        </a>
                    </li>
                    <li code="5">
                        <a>
                            <span><img src="images/ico_gnb_05.png" alt=""></span>
                            <i>학사일정</i>
                        </a>
                    </li>
                    <li code="6">
                        <a>
                            <span><img src="images/ico_gnb_06.png" alt=""></span>
                            <i>교육활동</i>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>
    </main>
    <!--
    <div class="main_content">
        <div class="clock_zone">
            <div class="clock">
            </div>
        </div>
    </div>
-->
</body></html>
<script language="javascript">
    var MAINPARENTCUSTOMCODE = true;
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(setInit, 100);
    });

</script>
