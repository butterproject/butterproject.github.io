var butter = {
    initialize: function() {
        this.polyfill();
        i18n.init({fallbackLng: 'en'}, function() {
	        $("html").i18n();
	        var desktop_version = $("#get-app").attr("data-version");
	        var android_version = $("#get-app").attr("data-version-android");
	        $(".download .btn-main").html(i18n.t("download.text", {postProcess: 'sprintf', sprintf: [desktop_version]}));
	        $(".download .btn-main.icon-android").html(i18n.t("download.text", {postProcess: 'sprintf', sprintf: [android_version]}));
        });
    },
    headroom: function() {
	$(".headroom").headroom({
		"tolerance": 8,
		"offset": 10,
		"classes": {
			"initial": "animated",
			"pinned": "slideDown",
			"unpinned": "slideUp"
		}
	});
    },
    polyfill: function() {
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
            window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame']
                                       || window[vendors[i]+'CancelRequestAnimationFrame'];
        }
    },
    detectUA: function(platform, ua) {
        if (/Mac/.test(platform)) {
            return 'mac';
        } else if (/Win/.test(platform)) {
            return 'win';
        } else if (/Android/.test(ua)) {
            return 'android';
        } else if (/Lin/.test(platform)) {
            if (/x86_64/.test(platform)) {
                return 'lin-64';
            } else {
                return 'lin-32';
            }
        } else {
            return;
        }
    },
    getAndroidVersion: function () {
        $.get('https://ci.butterproject.org/android/mobile/release', function(resp) {
            var version = resp.mobile.release["armeabi-v7a"].versionName;
            var newUrl = 'https://get.butterproject.org/android/' + version + '/mobile-armeabi-v7a-release-' + version + '.apk';
            if(version.indexOf("0") == 0) {
                version = version.substring(2, version.length);
            }
            $('a[data-os="Android"]').attr('href', newUrl).html(i18n.t("download.text", { defaultValue: "Download Beta %s", postProcess: 'sprintf', sprintf: [version] }));
        }, 'json');
    },
    updateDownloads: function(platform, ua) {
        document.body.className += ' ' + (this.detectUA(platform, ua) || 'nope');
    },
    updateStatus: function(el, url) {
        $.get(url, function(resp) {
            $(el).addClass(resp.status.indicator);
        }, 'json');
    },
    smoothScroll: function() {
        $('a[data-scroll][href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 800);
                    return false;
                }
            }
        });
    },
};

butter.initialize();
butter.headroom();
butter.getAndroidVersion();
butter.updateDownloads(navigator.platform, navigator.userAgent);
butter.updateStatus('#status', 'https://butterproject.statuspage.io/api/v1/status.json');
butter.smoothScroll();
