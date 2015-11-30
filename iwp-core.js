var SubwayTools = {}; //namespace
SubwayTools.About = "SubwayIWP Core Javascript v0.1";
SubwayTools.debug = false;
SubwayTools = {
    Initialize: function(d) {
        if (d && d == "debug") {
            SubwayTools.debug = true;
            SubwayTools.log("debugging enabled");
        }

        if (typeof console == "undefined") {
            this.console = {
                log: function() {
                },
                info: function() {
                },
                error: function() {
                },
                warn: function() {
                }
            };
        }

    },
    InjectJs: function(src, id) {
        if (!src) return;

        var s = document.createElement('script');
        var tmpId;

        if (typeof(id) != "undefined") {
            tmpId = id.replace(/\s+/g, '');
        } else {
            var t = src.split(/[/ ]+/).pop();
            tmpId = t.split(".")[0];

            SubwayTools.log("Will Use JS Injection ID: ", tmpId);
        }


        if (document.getElementById(tmpId)) {
            SubwayTools.log("JS Library Already Injected: ", tmpId);
            return;
        }
        ;
        $(s).attr("id", tmpId);
        $(s).attr("src", src);
        $(s).attr("type", "text/javascript");

        document.getElementsByTagName('head')[0].appendChild(s);
    },
    InjectCss: function(src, id) {
        if (!src) return;

        var s = document.createElement('link');
        var tmpId;

        if (typeof(id) != "undefined") {
            tmpId = id.replace(/\s+/g, '');
        } else {
            var t = src.split(/[/ ]+/).pop();
            tmpId = t.split(".")[0];
        }

        if (document.getElementById(tmpId)) {
            SubwayTools.log("CSS Library Already Injected: ", tmpId);
            return;
        }
        $(s).attr("id", tmpId);
        $(s).attr("href", src);
        $(s).attr("rel", "stylesheet");
        document.getElementsByTagName('head')[0].appendChild(s);
    },
};
SubwayTools.log = function(msg, el) {
    if ((typeof console != "undefined") && (typeof console.log != "undefined") && (SubwayTools.debug == true)) {
        if (!el) {
            console.log(msg);
        } else {
            console.log(msg, el);
        }
    }
};
SubwayTools.isPageEditor = function () {
    if (typeof window.Sitecore == "undefined") {
        return false;
    }
    if (typeof window.Sitecore.PageModes == "undefined" || window.Sitecore.PageModes == null) {
        return false;
    }
    return window.Sitecore.PageModes.PageEditor != null;
};

SubwayTools.Utils = {
    GetCookieValue: function (cookieName) {
        if (!cookieName) return null;

        var nameEq = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEq) == 0)
                return c.substring(nameEq.length, c.length);
        }
        return null;
    },
    GetQueryString: function () {
        var params;
        params = document.URL.split('?')[1];
        if (!params) return false;
        return params;
    },
    GetQueryStringValue: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    UpdateQueryString: function (param, value, url) {
        if (!url) url = window.location.toString();
        if (url.lastIndexOf('?') <= 0) url = url + "?";

        var re = new RegExp("([?|&])" + param + "=.*?(&|$)", "i");
        if (url.match(re))
            return url.replace(re, '$1' + param + "=" + value + '$2');
        else
            return url.substring(url.length - 1) == '?'
              ? url + param + "=" + value
              : url + '&' + param + "=" + value;
    },
    EncodeHTML: function (string) {
        return string.replace(/\\/g, '\\\\').
          replace(/\u0008/g, '\\b').
          replace(/\t/g, '\\t').
          replace(/\n/g, '\\n').
          replace(/\f/g, '\\f').
          replace(/\r/g, '\\r').
          replace(/'/g, '\\\'').
          replace(/"/g, '\\"');
    },
    DecodeHTML: function (string) {
        return string.replace('\\\\', /\\/g).
          replace('\\b', /\u0008/g).
          replace('\\t', /\t/g).
          replace('\\n', /\f/g).
          replace('\\f', /\f/g).
          replace('\\r', /\r/g).
          replace('\\\'', /'/g).
          replace('\\"', /"/g);
    }
};
SubwayTools.Geo = {
    GetCurrentLocation: function () {
        if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(this.GeoSuccess, this.GeoError);
        } else {
            this.GeoError({ code: "4" });
        }
    },
    GeoSuccess: function (position) {
        console.log("Geolocation Retrieved");
        console.log("Longitude: ", position.coords.longitude);
        console.log("Latitude: ", position.coords.latitude);
    },
    GeoError: function (err) {
        if (err.code == 1) {
            console.log("GeoError: ", "User denied request for location info.");
        } else if (err.code == 2) {
            console.log("GeoError: ", "Location information is unavailable.");
        } else if (err.code == 3) {
            console.log("GeoError: ", "Request to get your location timed out.");
        } else if (err.code == 4) {
            console.log("GeoError: ", "Geolocation is not supported on this device.");
        } else {
            console.log("GeoError: ", "An unknown error occurred while requesting your location");
        }
    }
};
SubwayTools.Screen = {
    Size: function() {
        if ($(document).width() < 768) {
            return 'xs';
        } else if ($(document).width() < 992) {
            return 'sm';
        } else if ($(document).width() < 1200) {
            return 'md';
        } else if ($(document).width() >= 1200) {
            return 'lg';
        } else {
            return 'md';
        }
    },
    Is: function(x) {
        return (this.Size() === x.toLowerCase());
    },
    IsNot: function(x) {
        return !this.Is(x);
    }
};
SubwayTools.Tracking = {
    RemoveUrlParameter: function(url, parameter) {
        var urlparts = url.split('?');

        if (urlparts.length >= 2) {
            var urlBase = urlparts.shift(); //get first part, and remove from array
            var queryString = urlparts.join("?"); //join it back up

            var prefix = encodeURIComponent(parameter) + '=';
            var pars = queryString.split(/[&;]/g);
            for (var i = pars.length; i-- > 0;)               //reverse iteration as may be destructive
                if (pars[i].lastIndexOf(prefix, 0) !== -1)   //idiom for string.startsWith
                    pars.splice(i, 1);
            url = urlBase + '?' + pars.join('&');
        }
        return url;
    },
    GetUrlParameter: function(url, parameter) {
        var vars = [], hash;
        var q = url.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars[parameter];
    }
};

/********************\
 * Global Variables *
\********************/
var trackingChannelOverride = "";
var trackingTitleOverride = "";


/* Tracking Functions */
function LogToOmniture(pageChannel, pageTitle) {
    try
    {
        window.s.pageName = pageTitle.replace("&", "and");
        window.s.server = "SubwayDevelopment"; // "subway.com";
        window.s.channel = pageChannel.replace("&", "and");
        window.s.pageType = "";
    }
    catch (e) { }
    

}
function LogPageForTracking() {
    var currChannel;
    var currTitle;
    if (trackingTitleOverride == "") {
        if (window.trackingTitle != "") {
            currTitle = window.trackingTitle;
        }
        else {
            currTitle = document.title;
        }
    }
    else {
        currTitle = trackingTitleOverride;
    }

    if (trackingChannelOverride == "") {
        if (window.trackingChannel != "") {
            currChannel = window.trackingChannel;
        }
        else {
            currChannel = "Other";
        }
    }
    else {
        currChannel = trackingChannelOverride;
    }

    //Log to Omniture
    LogToOmniture(currChannel, currTitle);
}
function LogLinkForTracking(windowLabel, debug) {
    try {
        window.s.linkTrackVars = 'prop16';
        window.s.tl(this, 'o', windowLabel);
        if (debug === true) {
            alert("s.tl(" + this + ", 'o', '" + windowLabel + "');" + " - windowId: " + s.prop16);
        }
    }
    catch (e) { }
    
}

/*****************\
 * YouTube Embed *
\*****************/
var YouTubeMedia = (function () {
    var yt = {}, players = new Array();
    yt.init = function () {
        if (!("YT" in window)) {
            var tag = document.createElement("script");
            //tag.src = document.location.protocol + "//www.youtube.com/iframe_api";
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScript = document.getElementsByTagName("script")[0];
            firstScript.parentNode.insertBefore(tag, firstScript);
        }
    };

    yt.imageUrl = function (id) {
        return "//img.youtube.com/vi/" + id + "/0.jpg";
    };
    yt.getPlayer = function (id) {
        return players[id];
    };
    yt.playPlayer = function(id) {
        players[id].playVideo();
    };
    yt.pausePlayer = function (id) {
        players[id].pauseVideo();
    };
    yt.stopPlayer = function (id) {
        players[id].stopVideo();
    };
    yt.destroyPlayer = function (id) {
        if (id in players) {
            players[id].destroy();
            delete players[id];
        }
    };
    yt.initPlayer = function (id, videoId) {
        if ("YT" in window) {
            //yt.init();
            //window.YTConfig = { 'host': document.location.protocol + '//www.youtube.com' };
            window.YTConfig = { 'host': 'https://www.youtube.com' };
            players[id] = new YT.Player(id, {
                width: '100%',
                height: '390',
                videoId: videoId,
                playerVars: {
                    origin: document.location.origin,
                    showinfo: 0,
                    rel: 0,
                    autohide: 0,
                    autoplay: 1,
                    modestbranding: 1
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        }
    };

    function onPlayerReady(event) {
        try {
            event.playVideo();
        } catch (ex) { }
    }
    function onPlayerStateChange(event) {
        try {
            switch (event.data) {
                case YT.PlayerState.PLAYING:
                    break;
                case YT.PlayerState.PAUSED:
                    break;
                case YT.PlayerState.BUFFERING:
                    break;
                case YT.PlayerState.CUED:
                    break;
                case YT.PlayerState.ENDED:
                    break;
            }
        }
        catch (ex) { }
    }
    return yt;
})();

/*****************\
 * Media Modal   *
\*****************/
var mediaModal = {
    BuildModal: function (trigSelect, modalId, headerTitle, footerTitle, htmlContent, displayCloseButton, isYouTube) {
        if (htmlContent === null) return;
        if (!modalId) modalId = "modalEmbed";

        var html = '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="PopupModal" aria-hidden="true">';
        html += '<div class="modal-dialog">';
        html += '<div class="modal-content">';

        if (headerTitle) {
            html += '<div class="modal-header" style="padding:10px;">';
            html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
            html += '<h3 class="modal-title" style="color:#527A4B; font-family: ProximaNova, Arial, Helvetica, sans-serif; font-size: 20px; text-align: left;margin-left:3%;line-height:30px">' + headerTitle + '</h3>';
            html += '</div>';//modal-header
        }

        html += '<div class="modal-body" style="padding:10px;">';

        if (isYouTube === true) {
            html += '<div class="responsive-video widescreen">';
            html += '<div class="videowrapper" id="' + modalId.split('yt_').pop(1) + '"></div>';
            html += '</div>';
        } else {
            html += htmlContent;
        }
        html += '</div>';//modal-body

        html += '<div class="modal-footer" style="text-align:left;">';
        html += '<div class="col-xs-10" style="padding-left:10px;">';
        if (footerTitle) {
            html += '<h3 class="modal-title" style="color: #527A4B; font-family: ProximaNova, Arial, Helvetica, sans-serif; font-size: 20px;margin-left:0;line-height:30px;">' + footerTitle + '</h3>';
        }
        html += '</div>';

        html += '<div class="col-xs-2" style="padding-right:10px;">';
        if (displayCloseButton) {
            html += '<button type="button" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close fa-2x"></i></button>';
        }
        html += '</div>';

        html += '</div>';//modal-footer
        html += '</div>';//modal-content
        html += '</div>';//modal-dialog
        html += '</div>';//modal

        $("#content-wrap").append($(html));

        var targ = $(trigSelect);
        if (targ.length > 0) {
            targ.attr("data-toggle", "modal");
            targ.attr("data-target", "#" + modalId);
            targ.css("cursor", "pointer");
        } else {
            $("#" + modalId).modal();
        }

        $("#" + modalId).on("hidden.bs.modal", function () {
            $(this).remove();
            YouTubeMedia.destroyPlayer(modalId.split('yt_').pop(1));
        });

        /* --- youtube --- */
        if (isYouTube === true) {
            var videoId = modalId.split('yt_').pop(1);
            YouTubeMedia.initPlayer(videoId, videoId);
        }
    },
    BuildFlashObject: function (sourceUrl, width, height) {
        if (!sourceUrl) return false;

        var object, param;

        object = document.createElement("object");
        $(object).attr("data", sourceUrl);
        $(object).attr("width", (width && width.length > 0) ? width : "auto");
        $(object).attr("height", (height && height.length > 0) ? height : "auto");
        $(object).attr("id", "flashvideo");
        $(object).attr("type", "application/x-shockwave-flash");
        $(object).attr("style", "max-width:100%!important;");
        param = document.createElement("param");
        $(param).attr("name", "wmode");
        $(param).attr("value", "transparent");
        object.appendChild(param);

        return object;
    },
    YouTube: function (videoId, videoTitle) {
        if (!videoId) return;
        var title = (videoTitle) ? videoTitle : " ";
        this.BuildModal(null, "yt_" + videoId, '', title, "", true, true);
    },
    FlashVideo: function (swfUrl, videoTitle, width, height, displayCloseButton) {
        var title, w, h, src;
        title = (!videoTitle) ? " " : videoTitle;

        if (!$("html").hasClass("flash") || !swfUrl) return;

        if (SubwayTools.Screen.Is("xs")) {
            src = this.BuildFlashObject(swfUrl);
        } else {
            w = (width && width.length > 0) ? width : "auto";
            h = (height && height.length > 0) ? height : "auto";
            src = this.BuildFlashObject(swfUrl, w, h);
        }
        this.BuildModal(null, "flashVideoModal", '', title, src.outerHTML, displayCloseButton, false);
    },
    Popup: function (html, videoTitle, displayCloseButton) {
        if (!html || !videoTitle) return;

        if ($("#popup-modal").length > 0) {
            $("#popup-modal").remove();
            $(".modal-backdrop.in").removeClass("in");
        }

        this.BuildModal(null, "popup-modal", '', videoTitle, html, displayCloseButton, false);
    },
    applyImageMap: function (targetImage, identifier, shape, coords, title) {
        if ((!targetImage || !identifier || !shape || !coords)) return;
        var map, area, targ = ('#' + identifier);

        map = document.createElement("MAP");
        $(map).attr("id", identifier);
        $(map).attr("name", identifier);

        area = document.createElement("AREA");
        $(area).attr("href", "#imagemap");
        
        $(area).attr("alt", title);
        $(area).attr("title", title);
        $(area).attr("shape", shape);
        $(area).attr("coords", coords);
        
        map.appendChild(area);

        $(targetImage).attr("usemap", targ).parent().parent().append($(map));
    }
};
function getDayPart() {
    var dpMorning = "morning",
      dpDaytime = "noon",
      dpEvening = "night",
      dpMorningStart = 6,
      dpDaytimeStart = 11,
      dpEveningStart = 17;

    var currDp, currHour, currDate = new Date();
    currHour = currDate.getHours();

    if ((currHour >= dpEveningStart) || (currHour < dpMorningStart)) {
        currDp = dpEvening;
    } else if (currHour >= dpMorningStart && currHour < dpDaytimeStart) {
        currDp = dpMorning;
    } else if (currHour >= dpDaytimeStart && currHour < dpEveningStart) {
        currDp = dpDaytime;
    }
    return currDp != null ? currDp : dpDaytime;
}

var waitForFinalEvent = function () {
    var b = {};
    return function(c, d, a) {
        a || (a = "SUBWAY");
        b[a] && clearTimeout(b[a]);
        b[a] = setTimeout(c, d);
    };
}();

$(document).ready(function () {
    $("html").addClass(typeof swfobject !== "undefined" && swfobject.getFlashPlayerVersion().major !== 0 ? "flash" : "no-flash");
    $("body").addClass("background-" + getDayPart());

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style');
        msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
        document.querySelector('head').appendChild(msViewportStyle);
    }

    //ORIGINAL FUNCTION
    $(".scroll-to-top").on("click", function () {
        $('html, body').animate({
            scrollTop: $("header.container").offset().top
        }, 500);
    });

    
    //$(".scroll-to-top").on("click", function () {
    //    try{
    //        $('html, body', window.parent.iframe).animate({
    //            scrollTop: $("header.container").offset().top
    //        }, 500);
    //    }
    //    catch (e) {
    //        alert(e);
    //        //$(".scroll-to-top").css("display", "none");
    //        //iFrameBorder        
    //        // $("#mainTbl").css("top", "10px");
    //        try {
    //            $('html, body', window.parent.iframe).animate({
    //                scrollTop: 1000
    //            }, 500);
    //        } catch (e) { alert('Err2: ' + e); }
    //    }   

           

    //});

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
});

/* ---- Prototype Extensions ----- */
String.prototype.replaceDoubleQuotes = function() {
    return this.replace(/"/g, "'");
};
String.prototype.startsWith = function(str) {
    return str.length > 0 && this.substring(0, str.length) === str;
};
String.prototype.endsWith = function(str) {
    return str.length > 0 && this.substring(this.length - str.length, this.length) === str;
};


/* ---- Handlebars.JS Helpers ---- */
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
Handlebars.registerHelper("foreach", function (arr, options) {
    if (options.inverse && !arr.length)
        return options.inverse(this);
    
    return jQuery.map(arr, (function (item, index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last = index === arr.length - 1;
        return options.fn(item);
    })).join('');
});
Handlebars.registerHelper("PromoLink", function (linkUrl, linkTarget, linkTitle, flashVideo, mdImage, xsImage, analyticId) {
    if (!xsImage || !mdImage) return "";

    var wrapper = document.createElement("div"),
      image = document.createElement("img"),
      promoLink = document.createElement("a"),
      promoEmbed = document.createElement("div");
    $(promoEmbed).attr("class", "marquee-media");
    $(promoEmbed).attr("data-src-md", mdImage);
    $(promoEmbed).attr("data-src-xs", xsImage);
    $(promoEmbed).attr("data-link", linkUrl.replaceDoubleQuotes());
    $(promoEmbed).attr("data-link-target", linkTarget);
    $(promoEmbed).attr("data-link-title", linkTitle);
    $(image).attr("class", "marquee-image img-responsive");

    promoEmbed.appendChild(image);

    if (flashVideo.length > 0 && $("html").hasClass("flash")) {
        $(promoEmbed).attr("data-src-flv", flashVideo);
    }

    promoLink.href = linkUrl.replaceDoubleQuotes();
    promoLink.target = linkTarget;
    promoLink.title = linkTitle;
    
    promoLink.appendChild(image);

    if (analyticId && analyticId.length > 1) {
        $(promoLink).attr("data-tracking", analyticId);
    }

    promoEmbed.appendChild(promoLink);

    wrapper.appendChild(promoEmbed);
    return wrapper.innerHTML;
});
Handlebars.registerHelper("PromoContentIsValid", function (fragText, fragImage, desktopImage, mobileImage, options) {
    return ((fragText.length > 0) && (fragImage.length > 0) && (desktopImage.length > 0) && (mobileImage.length > 0)) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper("buildDropHeader", function (data) {
    var div = document.createElement("div"), section, link;
    $(div).attr("style", "width:" + data.Width + "px; overflow: hidden");
    if (data.SubSections && data.SubSections[0].IsSiteSection) {
        $.each(data.SubSections, function (index, value) {
            section = document.createElement("div");
            $(section).attr("class", (index == 0) ? "nav-header  nav-header-col-1 hidden-xs clearfix" : "nav-header nav-header-col-2 hidden-xs clearfix");
            link = document.createElement("a");
            $(link).attr("id", this.Id);
            $(link).attr("href", this.Url);
            $(link).attr("title", this.Title);
            link.innerHTML = (new Handlebars.SafeString(this.DisplayName)).toString();
            section.appendChild(link);
            div.appendChild(section);
        });
    } else {
        section = document.createElement("div");
        $(section).attr("class", "nav-header hidden-xs clearfix");

        link = document.createElement("a");
        $(link).attr("id", this.Id);
        $(link).attr("href", data.Url);
        $(link).attr("title", data.Title);
        link.innerHTML = (new Handlebars.SafeString(data.HeaderText)).toString();

        section.appendChild(link);
        div.appendChild(section);
    }

    return div.innerHTML;
});
Handlebars.registerHelper("buildSubSection", function (data) {
    var ul, li, image, link, wrap = document.createElement("div");
    var cnt = 1;
    var menuCount = 1;
    var totalMenuColumns = data.length;
    if (totalMenuColumns > 0 && data[0].IsSiteSection) { /* Nested Site Sections */
        var iterateMenuColumns = function (totalColumns) {
            var totalColumnNumber = totalColumns;
            return function (index, element) {
                ul = document.createElement("ul");
                $(ul).attr("class", "list-unstyled site-sections clearfix");
                $(ul).attr("data-sub-section", this.Title);

                var separatorContent = document.createElement("a");
                var separator = document.createElement("li");
                $(separatorContent).attr("id", this.Id);
                $(separatorContent).attr("href", this.Url);
                $(separatorContent).attr("target", this.UrlTarget);
                separatorContent.textContent = this.Title;
                $(separator).attr("class", "visible-xs nav-separator disabled");
                separator.appendChild(separatorContent);
                ul.appendChild(separator);
                var maxSubSections = (data.length < 2) ? 0 : (data[0].SubSections.length > data[1].SubSections.length) ? data[0].SubSections.length : data[1].SubSections.length;
                var func = function (currentMenuColumn) {
                    var c = currentMenuColumn;
                    return function (index, element) {
                        li = document.createElement("li");
                        var cssClass = (c == 1) ? "nested-section-left" : "nested-section-right";
                        $(li).addClass(cssClass); //Menu Items
                        if (!this.ShowOnMobile) {

                            $(li).addClass("hidden-xs");
                        }
                        if (!this.ShowOnTablet) {

                            $(li).addClass("hidden-sm");
                        }

                        if (this.Icon) {
                            image = document.createElement("img");
                            $(image).attr("src", this.Icon);
                            $(image).attr("class", "nav-icon");
                            li.appendChild(image);
                        }
                        link = document.createElement("a");
                        $(link).attr("id", this.Id);
                        $(link).attr("href", this.Url);
                        $(link).attr("target", this.UrlTarget);
                        link.innerHTML = (new Handlebars.SafeString(this.Title)).toString();
                        li.appendChild(link);
                        ul.appendChild(li);
                    };
                };

                $.each(this.SubSections, func(menuCount));
                ++menuCount;
                wrap.appendChild(ul);
                ++cnt;
            };
        };

        $.each(data, iterateMenuColumns(totalMenuColumns));

    } else { /* no nested site section */
        ul = document.createElement("ul");
        $(ul).attr("class", "list-unstyled site-sections");

        $.each(data, function () {
            li = document.createElement("li");

            if (this.Icon) {
                image = document.createElement("img");
                $(image).attr("src", this.Icon);
                $(image).attr("class", "nav-icon");
                li.appendChild(image);
            }

            if (!this.ShowOnMobile) {
                $(li).attr("class", "hidden-xs");
            }
            if (!this.ShowOnTablet) {
                $(li).attr("class", "hidden-sm");
            }

            link = document.createElement("a");
            $(link).attr("id", this.Id);
            $(link).attr("href", this.Url);

            if (this.UrlTarget) {
                $(link).attr("target", this.UrlTarget);
            } else {
                $(link).attr("target", "_self");
            }

            if (this.Indented) {
                $(link).attr("style", "padding-left:25px;");
            }

            link.innerHTML = (new Handlebars.SafeString(this.Title)).toString();
            $(ul).attr("style", "width: 50%");

            li.appendChild(link);
            ul.appendChild(li);
        });
        wrap.appendChild(ul);
    }
    return new Handlebars.SafeString(wrap.innerHTML);
});

Handlebars.registerHelper('getFooterText', function (unformattedString) {
    var returnString = unformattedString.replace("$StoreCount", storeCount);
    returnString = returnString.replace("$CountryCount", countryCount);
    return new Handlebars.SafeString(returnString.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
});

Handlebars.registerHelper("buildDropTag", function (onMobile, onTablet, sectionId, extraClasses) {
    if (onMobile || onTablet) {
        if (onMobile && onTablet) {
            return '<li class="dropdown ' + extraClasses + '" data-section-id="' + sectionId + '">';
        } else if (onMobile && !onTablet) {
            return '<li class="dropdown hidden-sm ' + extraClasses + '" data-section-id="' + sectionId + '">';
        } else if (onTablet && !onMobile) {
            return '<li class="dropdown hidden-xs ' + extraClasses + '" data-section-id="' + sectionId + '">';
        }
    } else {
        return '<li class="dropdown hidden-xs hidden-sm ' + extraClasses + '" data-section-id="' + sectionId + '">';
    }
});
Handlebars.registerHelper("MarqueeEditorTag", function (cellId) {
    if (cellId.length && SubwayTools.isPageEditor()) {
        var button, scriptlet;

        scriptlet = "javascript:Sitecore.PageModes.PageEditor.postRequest('webedit:fieldeditor(referenceId={1AF227E9-9E62-4E11-B92D-412D7C07CC89},command={A6FB45C7-73EC-47A8-97EC-B4BA64FE60CD},fields=Hyperlink|Mobile|Desktop|Flash Video|Fragment Image|Fragment Text|Analytics ID,renderingId={64644E1A-A8F6-4272-9B6D-F694EA64356D},id=" + cellId + ")',null,false);";

        button = document.createElement("a");
        $(button).attr("href", "#");
        $(button).attr("class", "btn btn-danger btn-xs edit-marquee-cell");
        $(button).attr("style", "display:none;");
        button.innerHTML = "<i class='fa fa-2x fa-edit pull-left'></i>Edit Cell";
        $(button).attr("onclick", scriptlet);
        return button.outerHTML;
    }
    return "";
});

//Adobe pdf
function MM_jumpMenu(targ, selObj, restore) { //v3.0
    var target;
    if(navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1) {
        target = "_self";
    }
    else {
        target = "_blank";
    }
    window.open(selObj.options[selObj.selectedIndex].value, target);
    if (restore) selObj.selectedIndex = 0;
}
