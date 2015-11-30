/*!
 * navigation.js
 * Responsive Navigation Menu
 * written by:  David Amato
 */
$(function () {
    var activeDropMenu = null;
    var template = Handlebars.compile($("#template-navigation").html());
    $("#navigation-block").html(template(window.navigationJson));

    $(".navbar-collapse").on("show.bs.collapse", function () {
        $(".navbar-collapse.in").collapse("toggle");
    });

    $("li.dropdown").on({
        "show.bs.dropdown": function (e) {
            $(e.relatedTarget).toggleClass("disabled");
        },
        "hide.bs.dropdown": function (e) {
            $(e.relatedTarget).removeClass("disabled");
        },
        "mouseover": function (e) {
            if (SubwayTools.Screen.IsNot("xs")) {
                var self = $(this);
                var to = e.relatedTarget || e.toElement;
                var dropmenu = self.find("ul.dropdown-menu");
                activeDropMenu = dropmenu;
                $("li.dropdown.open").removeClass("open");
                self.addClass("open");
                $(to).addClass("disabled");
                if ($("header.container").width() < (dropmenu.position().left + dropmenu.width())) {
                    dropmenu.css("right", "5px");
                }
            }
        },
        "mouseout": function (e) {

            if (SubwayTools.Screen.IsNot("xs")) {
                var target = e.relatedTarget || e.toElement;
                if (!$(target).hasClass("top-counts") && $(target).parents(".top-counts").length < 1) {
                    $("li.dropdown.open").removeClass("open");
                } else if ($(target).hasClass("top-counts")) {


                    $(target).mousemove(function (e) {
                        try {
                            if (activeDropMenu == null) return;
                            var leftEdge = activeDropMenu.offset().left;
                            var rightEdge = activeDropMenu.width() + activeDropMenu.offset().left;
                            if (e.pageX < leftEdge || e.pageX > rightEdge) {
                                $("li.dropdown.open").removeClass("open");
                                activeDropMenu = null;
                            }
                        } catch (err) {
                            window.console && window.console.log(err);
                        }
                    });
                }
            }
        },
        "click": function (e) {
            var to = e.target ? e.target : (e.relatedTarget || e.toElement);
            if ((!SubwayTools.Screen.Is("xs") && ($(to).parents(this).length > 0)) || !$(this).hasClass("open")) {
                e.stopPropagation();
            }
        },
        "touchstart": function (e) {
            return;
            /*
            the following code controls the expansion of super nav
            main menus;            
            var self = $(this);
            if (!self.hasClass("open")) {
                e.stopPropagation();
                e.preventDefault();
                $("li.dropdown.open").removeClass("open");
                self.addClass("open");
                var dropmenu = self.find("ul.dropdown-menu");
                if ($("header.container").width() < (dropmenu.position().left + dropmenu.width())) {
                    dropmenu.css("right", "5px");
                }
            }
            */
        }
    });

    $("select.languageDropdown").find("option[value='" + SubwayTools.ContextLanguage + "']").attr("selected", true);

    $(document).ready(function () {
        var locatorUrl;
        $("select.languageDropdown").on("change", function () {
            var self = $(this);
            var url = window.location.href,
              host = window.location.host,
              protocol = window.location.protocol,
              path = window.location.pathname,
              qs = window.location.search,
              newUrl;

            var pathArray = path.split('/');
            if (pathArray.length > 0 && pathArray[1] != null) {
                if (((pathArray[1].length == 2) || (pathArray[1].indexOf("-") !== -1))) {
                    newUrl = url.replace(pathArray[1], self.val());
                } else {
                    newUrl = protocol + "//" + host + "/" + self.val() + path + qs;
                }
                window.location.href = newUrl;
            }
        });

        locatorUrl = $("li.store-locator a.dropdown-toggle").attr("href");
        $("#drop-locator-input").click(function (e) {
            $("#drop-locator-input").removeClass("disabled");
            if(typeof console != 'undefined')console.log($("#drop-locator-input").html());
        });

        $("#navbar-locator-input, #drop-locator-input").keypress(function (e) {
            var query = $(this).val();
            var code = (e.keyCode ? e.keyCode : e.which);

            if (query.length > 0) {
                $(".nav-locator-form .error-label").hide();
            }
            if (code == 13) {
                e.preventDefault();

                if (query.length > 0) {
                    goLocate(query);
                } else {
                    $(".nav-locator-form .error-label").show();
                    $(this).focus();
                }
            }
        });

        $(".locator-go-btn").click(function () {
            var self = $(this), textInput, inputControl;

            inputControl = $(self.attr("data-input"));
            textInput = inputControl.val();

            if (!textInput || textInput.length <= 0) {
                $(".nav-locator-form .error-label").show();
                inputControl.focus();
            } else {
                goLocate(textInput);
            }
        });

        function goLocate(searchQuery) {
            var url, lang = SubwayTools.ContextLanguage;

            if (locatorUrl != null && locatorUrl.length > 0) {
                url = locatorUrl + "?zip=" + encodeURIComponent(searchQuery);
            } else if (lang && lang.length > 0) {
                url = "/" + lang + "/locator";
            } else {
                url = "/locator?zip=" + encodeURIComponent(searchQuery);
            }
            window.location.replace(url);
        }

        $(".locator-option.advanced-search").attr("href", locatorUrl);
        $(".locator-option.current-location").on("click", function () {
            $(this).find("i.fa").toggleClass("fa-play-circle fa-cog fa-spin");
            $("*").css("cursor", "wait");
            initLocatorWithCurrentLocation();
        });

        var initLocatorWithCurrentLocation = function () {
            if (Modernizr.geolocation) {
                if (typeof (window.google) == 'undefined' || !window.google.load) {
                    $.getScript('//www.google.com/jsapi', function () {
                        window.google.load("maps", "3", { callback: getZipCode, other_params: 'sensor=false' });
                    });
                } else {
                    window.google.load("maps", "3", { callback: getZipCode, other_params: 'sensor=false' });
                }
            } else goLocate("");


            function getZipCode() {
                var fallback = setTimeout(function () { fail('10 seconds expired'); }, 10000);

                navigator.geolocation.getCurrentPosition(function (pos) {
                    clearTimeout(fallback);
                    var point = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    new google.maps.Geocoder().geocode({ 'latLng': point }, function (res, status) {
                        if (status == google.maps.GeocoderStatus.OK && typeof res[0] !== 'undefined') {
                            var zip = res[0].formatted_address.match(/,\s\w{2}\s(\d{5})/);
                            if (zip) {
                                goLocate(zip[1]);
                            } else goLocate("");
                        } else {
                            goLocate("");
                        }
                    });
                }, function (err) {
                    fail(err.message);
                });
            };
            function fail(msg) {
                if (SubwayTools.debug == true) {
                    console.log(msg);
                }
            }
        };
    });
});
