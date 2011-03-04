if(!this["SWS"]){
	var SWS={};
}
var DOMAIN_MAIN = 'http://ellip:8888';
SWS.global_scope=this;
SWS.site_url = SWS.global_scope['DOMAIN_MAIN'];

SWS.analytics = {
	track_pageview: function() {
		var url=SWS.site_url+SWS.current_ajax_url;
		SWS.analytics.google(url);
		SWS.analytics.quantcast(url);
	},
	google: function(url) {
		if(SWS.global_scope["pageTracker"]){
			nurl = url.replace(/\/[0-9]+/g, ''); /* Port of Nick's Normalization code */
			pageTracker._trackPageview(nurl);
		}
	},
	quantcast: function(url) {
		// using event:"refresh", having an active call may not be necessary
	}
},

SWS.dialog = {
	optionDefaults: {
		closeable: true,
		closeText: 'X',
		center: true,
		fixed: false,
		modal:true,
		hideFade: true,
		hideShrink: false,
		unloadOnHide:true,
		afterHide:function(){SWS.dialog.active = null;}		
	},
	
	load: function(url, optionParams) {
		if (SWS.dialog.active) {
			SWS.dialog.close(null);
		}
		if (!optionParams) optionParams = {};		
		options = {};
                for (option in SWS.dialog.optionDefaults) {
			if (optionParams[option] != undefined)
				options[option] = optionParams[option];
			else
				options[option] = SWS.dialog.optionDefaults[option];
                }		

		SWS.dialog.active = new Boxy.load(url, options)
				
/*				
		SWS.dialog.active = new Boxy.load(url, {
			closeable: options.closable,
			closeText: 'X',
			center: true,
			fixed: false,
			modal:true,
			hideFade: true,
			hideShrink: false,
			unloadOnHide:true,
			afterHide:function(){SWS.dialog.active = null;}
		});
*/		
	},
	display: function (content){
		if (SWS.dialog.active) { /* For now, one dialog at a time */
			SWS.page.replace_html('#dialog_content', content);
		} else {
			SWS.dialog.active = new Boxy(content, {
				closeable: true,
				closeText: 'X',
				center: true,
				fixed: false,
				modal:true,
				hideFade: true,
				hideShrink: false,
				unloadOnHide:true,
				afterHide:function(){SWS.dialog.active = null;}
		    });
	    }
	},
	close: function(after) {
            jQuery('.close').each(function() {
                $(this).trigger("click");
            });
            SWS.dialog.active = null;
	},
	moveUp: function(distance) {
		// Should work, but doesn't
		//if (SWS.dialog.active) {
			//var points = SWS.dialog.active.getPosition();
			//if (points)
			//	SWS.dialog.active.moveTo(points[0], points[1] - distance);
		//}
		SWS.dialog.distance = distance;
		if ($('.boxy-wrapper')) {
			$('.boxy-wrapper').each(function() {
				value = (parseInt($(this).css("top")) - SWS.dialog.distance) + "px";
				$(this).css("top", value);
			});
		}
	},
	active: null,
	distance: 0
},

SWS.form = {
	submit: function(url, form_id){
	
		if (SWS.page._unload) {
			SWS.page._unload()
			SWS.page._unload = null;
		};
		var meta_data = '';
		if( form_id ) {
			meta_data = jQuery(form_id).serialize();
		}
		jQuery.ajax({
			type: "POST",
			url: url,
			dataType: "script",
			data: meta_data
		});
		return false;
	},
        testClick: function() {
            $('#UserDisclaim[comply]').val(true);
            return false;
        },
	clear_errors: function(form_id){
		jQuery(form_id+' .form-error').remove();
		jQuery(form_id+' li').removeClass('error').find('label .error-description').remove();
	},
	add_field_error: function(form_id, field, description){
		jQuery(form_id+' li'+field).addClass('error').find('label').append('<span class="error-description"> ('+description+')</span>')
	},
	add_error: function(form_id, description){
		jQuery(form_id).prepend('<div class="form-error error">'+description+'</div>')
	},
	disable: function(form_id){
		jQuery(form_id+' input').attr('disabled', 'disabled');
	}
},

SWS.history = {
    _loaded: false,
    init: function() {
    /*
        if (!SWS.history._loaded) {
            $.historyInit(SWS.history.load, null);
            SWS.history._loaded = true;
        }
    */
    },
    add: function(url) {
    //	$.historyLoad(url);
    },
    load: function(url) {
    /*
        if (url[0] == '/') {
                SWS.page.load_url(url, {skip_history: true});
        }*/
    }
},

SWS.nav = {
	
    handle: function(hash) {
	switch (hash) {
	    case 'home':
		window.location = SWS.site_url;
		break;
	    case '/':  // GO TO teaser broken for now, just do normal site reload
		if (SWS.player.playerAppState != "WORKOUT_TEASER")
		{
		    SWS.dialog.load('/site/confirm', {'closable':false, 'closeText':''});

		} else {
		    window.location = hash;					
		}
		break;			
	    default:
		SWS.page.load_url(hash);
		//SWS.player.setAppState("WORKOUT_TEASER");
	}		
    }
},

SWS.notice = {
	create: function (msg, type) {
		return Boxy.alert(msg, null, {closeable: true});
	},
	confirm: function (msg, url) {
		Boxy.confirm(msg, function() {SWS.page.load_url(url)});
		return false;
	}
},

SWS.page = {
	redirect: function(url){
	     location.href=url;
        },
	replace_html: function(content_id,content){
		if($(content_id)){
			SWS.page.cleanup_links(content_id);
			$(content_id).html(content);
			SWS.page.process_links(content_id);
		}
	},
	cleanup_links: function(obj){
		if(!obj){
			links = $('a');
		}else{
			links = $(obj).find('a');
		}
		for(var i=0;i<links.length;i++){
			links[i].onclick=null;
		}
	},
	process_links: function(obj){
		if(!obj){
			links = $('a');
		}else{
			links = $(obj).find('a');
		}
		for(var i=0;i<links.length;i++){
			var link=links[i];
			var href=link.getAttribute("href");
			//if(link.getAttribute("graceful")&&href[0]!="#"&&!link.onclick){
			if((href && href[0]!="#")&&!link.onclick){
				var hrefArray = href.split("\/");
				if(SWS.www.get_protocol(href)==location.protocol){
					href=href.replace(/http(s*)\:\/\/[^\/]*/,"");
				}
				link.setAttribute("href","#"+href);
				link.onclick=SWS.page.get_link_onclick(href,link.getAttribute("force_ajax"));
			}
		}
	},
	get_link_onclick: function(url, force){
		return function(ev){
			//SWS.util.stop_event(ev);
			SWS.page.load_url(url,{force_ajax: force});
			return (SWS.www.get_protocol(url)==location.protocol);
		};
	},
	set_ajax_url: function(url){
		SWS._followed_ajax_link=true;
		SWS.current_ajax_url=SWS.www.process_url(url);
	},	
	reload: function() {
		SWS.page.load_url(SWS.current_ajax_url);
	},
	load_url: function(url,options){ 
		
		if(!options){
			options={};
		}
		var sep="?";
		if(url&&url.indexOf("?")!=-1){
			sep="&";
		}
		if(SWS.www.get_protocol(url)!=location.protocol){
			options.force_refresh=true;
		}
		if(options.force_refresh){
			if(SWS.current_song && SWS.current_song.playing){
				var token=SWS.song.get_continuation_params();
				url+=sep+Hash.toQueryString(token);
			}
			location.href=url;
			return;
		}else{
			if(!options.emulate_nonajax){
				SWS.page.set_ajax_url(url);
			}
			var meta_data={
				//prev_nav:SWS.context.nav,
				//prev_subnav:SWS.context.subnav,
				//prev_username:SWS.context?PPL.context.viewed_username:""
			};
			if (SWS.page._unload) {
				SWS.page._unload()
				SWS.page._unload = null;
			};
			//$('#ajax_loader').show();
			jQuery.ajax({
				type: "POST",
				url: url,
				dataType: "script",
				data:meta_data
			});
			SWS._loading_page=true;
			if(!options.skip_history){
				SWS.history.add(url);
			}
		}
	},
	on_unload: function(func) {
		SWS.page._unload = func;
	}
},

SWS.player = {

    /* playingStates are:
            playingStateBuffering - the track is loading and not yet playing
            playingStateComplete -  the track has completed playback
            playingStateIdle     -  prior to loading any track
            playingStateLoadError - the last load attempt failed
            playingStateLoaded    - track is loaded but not playing
            playingStateLoading   - track is in the process of loading
            playingStateLoadingRetrying - the last load attempt failed, trying again
            playingStatePaused  - the track is paused
            playingStatePlaying -  the track is playing
            playingStateSeeking - the track is seeking
    */

    appState: "WORKOUT_LIST",
	debug: false,
    error: false,
    isPlayerLoaded: false,
    playerAppState: null,  // As reported by the player
    playerHandle: false,
    playingState: "",
    states: {WORKOUT_TEASER: {width: 690, height: 145},
            WORKOUT_DETAIL: {width: 690, height: 650},
            WORKOUT_LIST: {width: 690, height: 538},
            WORKOUT_PERFORM: {width: 690, height: 650}
            },
    workout: {},
    workout_title: false,
    workout_id: null,

    appStateWidth: function() {
        var temp = eval("SWS.player.states." + SWS.player.appState).width;
        return temp;
    },

    appStateHeight: function() {
        var temp = eval("SWS.player.states." + SWS.player.appState).height;
        return temp;
    },

    // TODO: change alert to ...
    callPlayer: function(eventObj) {
        SWS.player.ensure_init(function() {
            try {
                var tempObj = SWS.player.normalizeObject(eventObj);
                var jsonStr = JSON.stringify(tempObj);
                SWS.player.playerHandle.handleContainerEvent(jsonStr);
            } catch (err) {
                    alert("callPlayer error on : " + eventObj.type);
            }
        });
    },

    defaultFlashvars: function() {
        var flashVarsObj = player_default_flashvars;
        return flashVarsObj;
    },
    
    ensure_init: function(func){
        setTimeout(function(){
            if(SWS._initialized && SWS.player.isPlayerLoaded){
                func();
            }else{
                SWS.player.ensure_init(func);
            }
        },100);
    },

    getWorkout: function() {
        SWS.player.callPlayer({type:'getWorkout'});
    },

    // CALLED BY THE FLASH PLAYER ------------------------------------------
    handlePlayerEvent: function(playerEvent) {
        var eventObj = eval('(' + playerEvent + ')');

		if (SWS.player.debug)
			$('#debug-txt').html($('#debug-txt').html()+'<br>'+playerEvent);

        if (!SWS.player.isPlayerLoaded) {
                var IS_IE = (navigator.appVersion.match('MSIE')) ? (true) : (false);
                SWS.player.playerHandle = (IS_IE) ? (window[SWS.player.flashvars['javascript_id']]) : (document[SWS.player.flashvars['javascript_id']]);
                SWS.player.isPlayerLoaded = true;
        }

        switch (eventObj.type) {
            case "logout":
                break;
            case "loggedIn":
                //refreshHeader();
                break;
            case "req_state":
                SWS.player.setAppState(eventObj.value);
                break;
            case "state":
                SWS.player.appPlayerState = eventObj.value;
                SWS.player.setAppState(SWS.player.appPlayerState);
                break;
            case "playerStateChange":
                SWS.workout = eventObj.workout;
                break;
            case "userDetail": // returns {userId}
                SWS.navigation.navUserProfileById(eventObj.userId);
                break;
            case "error":
                alert("PlayerError: " + eventObj.message); 
                break;
            case "workout":
                SWS.player.workout_title = eventObj.title;
                SWS.player.workout_id = eventObj.id;
                break;
        }
    },

    isLoading: function() {
        return (SWS.player.isPlayerLoaded && 
            SWS.player.workout && 
            SWS.player.workout.appState == "playingStateLoading");
    },

    isPlaying: function() {
        return (SWS.player.isPlayerLoaded && 
            SWS.player.workout && 
            SWS.player.workout.appState == "playingStatePlaying");
    },

    isPaused: function() {
        return (SWS.player.isPlayerLoaded &&
            SWS.player.workout &&
            SWS.player.workout.appState == "playingStatePaused");
    },

    load: function(loadObject) {
        SWS.player.setFlashvars(loadObject);
        SWS.player.workout_id = SWS.player.flashvars.workout_id;

        var filepath = SWS.player.flashvars.player_baseurl + "/";
        // TODO: do this only in devmode, or perhaps on forced reload (can player tell that it's out of date?)

        if (SWS.player.flashvars.use_loader) {
            filepath += SWS.player.flashvars.loader_name + ".swf";
        } else {
            filepath += SWS.player.flashvars.player_name + ".swf";
        }

        /* Do this to force cache busting  */
        var time = new Date();
        filepath += "?" + time.getTime();

        /* This can be used for re-initializing the player - in error scenario's
        if ((SWS.player.playerHandle) && (loadObject.parentDiv)) {
            swfobject.removeSWF(SWS.player.flashvars['javascript_id']);
            $("<div id='"+loadObject.parentDiv+"'></div>").appendTo("#myTestPlayer");
        }
        */

        var params = {
            wmode: "transparent",
            bgcolor: "#ffffff",
            allowscriptaccess: "sameDomain",
            allowfullscreen: "true"
        };
        var attributes = {
            id: "flexPlayer",
            name: SWS.player.flashvars['javascript_id']
        };

        // Read parent size?
        swfobject.embedSWF(filepath, SWS.player.flashvars.parent_div, SWS.player.appStateWidth(), SWS.player.appStateHeight(), FLASH_MINREV, "/players/expressInstall.swf", SWS.player.flashvars, params, attributes);
        // This might be preferrable for re-initializing the player
        //swfobject.createSWF(SWS.player.filepath, loadObject.parentDiv, loadObject.width, loadObject.height, FLASH_MINREV, "/players/expressInstall.swf", PPL.player.flashvars, params, attributes);
    },

    loadWorkout: function(id, isLoadIfPlaying) {
        if (!SWS.player.isPlaying() || isLoadIfPlaying) {
            SWS.player.workout_id = id;
            SWS.player.callPlayer({type:'loadWorkout', workoutId:id});
        }
    },

    // TODO: remove this from here - can we extend this object in "debug mode" 
    mockWorkoutObj: function(remote_id) {
        return {
            instructor: 'testArtist',
            duration: '30',
            image: '',
            title: 'testTitle'
        };
    },

    normalizeObject: function(obj) {
        for (param in obj) {
            if (!obj[param]) obj[param] = "";
        }
        return obj;
    },

    setAppState: function(newState) {
        if (!eval("SWS.player.states."+newState))
            throw ("No state " + newState + " defined");
        // We could get tricker with the states structure, but we may need
        // state->state specific transitions which would seem complicated

		callObject = {type:'setAppState'};

        switch (newState) {
            case "WORKOUT_TEASER":
                $('#html-wrapper').height(300);
                $('#html-wrapper').show();
                $('#main-search').show();
                break;
            case "WORKOUT_LIST":
                $('#html-wrapper').height(300);
                $('#html-wrapper').show();
                $('#main-search').show();
                break;
            case "WORKOUT_DETAIL":
                $('#main-search').hide();
                break;
            case "WORKOUT_BROWSE":
                $('#html-wrapper').height(100);
                $('#html-wrapper').show();
                break;
            case "WORKOUT_PERFORM":
                if (SWS.user.uid < 1) {
                    SWS.dialog.load('/user/perform');
                    return;
                } else if (SWS.user.hasComplied < 1) {
                    statements = encodeURIComponent("SWS.player.setAppState(\"WORKOUT_PERFORM\")");
                    SWS.dialog.load("/user/disclaim?statements=" + statements);
                    return;
                }
				callObject.playFirstStage = 1;
                $('#html-wrapper').hide();
                break;
        }

        SWS.player.appState = newState;
        $('#flexPlayer').height(SWS.player.appStateHeight());
        $('#flexPlayer').width(SWS.player.appStateWidth());
        // Sync's state
        if (SWS.player.appState != SWS.player.playerAppState) {
			callObject.appState = SWS.player.appState;
            SWS.player.callPlayer(callObject);
            //SWS.player.callPlayer({type:'setAppState', appState:SWS.player.appState});
		}
    },

    setFlashvars: function (loadObject) {
        SWS.player.flashvars = player_default_flashvars;
        if (loadObject) {
            for (flashvar in SWS.player.flashvars) {
                if (loadObject[flashvar] != undefined) SWS.player.flashvars[flashvar] = loadObject[flashvar];
            }
        }
    },

    /**
     *  If player is in tease mode, and this is a different workout id than
     *  currently displayed, then load the new workout id in tease mode.
     *
     *  If the player is already showing this workout in tease mode, then
     *  load the workout and switch to WORKOUT_DETAIL mode.
     *
     *  If the app is already in the WORKOUT_DETAIL state, then leave it in
     *  that state
     */
    teaseOrLoadWorkout: function(id) {
        if ((SWS.player.appState == "WORKOUT_TEASER") &&
            (SWS.player.workout_id == id)) {
            SWS.player.setAppState("WORKOUT_DETAIL");
        } else {
            SWS.player.workout_id = id;
            SWS.player.callPlayer({type:'teaseWorkout', workoutId:id});
        }
    },

    userLogin: function(user_id) {
        if (SWS.player.isPlayerLoaded)
            SWS.player.callPlayer({type:'userLogin', userId:user_id});
    },

    userLogout: function() {
        if (SWS.player.isPlayerLoaded)
            SWS.player.callPlayer({type:'userLogout'});
    }
},

SWS.user = {
    uid: 0,
    hasComplied: 0,
    login: function(url, username, password) {
        // return javascript to execute (userid, etc)
        // Close form, or display login problem for re-submission
        loginData = serialize(username, password);
        jQuery.ajax({
                type: "POST",
                url: url,
                dataType: "script",
                data:meta_data
        });		
    },
    loginToSignup: function() {
        SWS.dialog.close();
        SWS.dialog.load('/user/registration');
    },
    on_login: function(user_id, user_name){
        $('#base-page-signout').show();
        $('#base-page-signin').hide();
        $('#user-menu-display').html(user_name);
        SWS.player.userLogin(user_id);
    },
    on_logout: function(){
        $('#base-page-signout').hide();
        $('#base-page-signin').show();
        SWS.page.reload();
        SWS.player.userLogout();
    }
};

/*
SWS.resize = {
    init: function (adIds) {
        // bind the resize function
        $(window).bind('resize', function() {
            SWS.resize.calc_size();
        });
        SWS.resize.calc_size();
    },
    calc_size: function() {
        var width = $(document).width();
        if( width < 1280 ) {
            $('#gutter-skyscraper').hide();
        }
        else {
            $('#gutter-skyscraper').show();
            SWS.ads.load();
        }
    }
};
*/

SWS.workout = {
    loadFromList: function(wid, elem) {
        $('.workoutListItem').each(function() {
            $(this).removeClass('selected');
        });
        $('#'+elem).addClass('selected');
        SWS.player.loadWorkout(wid);
    }
},

SWS.www = {
    get_protocol: function(url){
        var a=url.substr(0,5);
        if (a=="http:") {
            return "http:";
        }
        if (a=="https") {
            return "https:";
        }
        return location.protocol;
    },
    process_url: function(url){
        return url.replace(/\s/g,"%20").replace(SWS.site_url,"");
    },
    get_url_from_anchor: function(){
        var url=document.location.href;
        var pos=url.indexOf("#");
        if (pos!=-1) {
            return SWS.www.process_url(url.substr(pos+1));
        } else {
            return null;
        }
    },
    get_url_without_anchor: function(){
        var url=document.location.href;
        var pos=url.indexOf("#");
        if (pos!=-1) {
            return SWS.www.process_url(url.substr(0,pos));
        } else {
            return SWS.www.process_url(url);
        }
    }
},

SWS.init=function(){
	//SWS.page.process_links();
	//SWS.history.init();

	if (!SWS.player.isPlayerLoaded && SWS.global_scope.player_load_object) {
		SWS.player.load(SWS.global_scope.player_load_object);
	}	

	if (location.href.indexOf('debug_player') > 0)
		SWS.player.debug = true;
	
	//Rewrite and prepare links of right-hand sub navigation
/*	
	$('a.ajax').each(function() {
		if ($(this).hasClass('modal')) {
			$(this).click(function(e) {
				SWS.dialog.load(this.getAttribute('href'))
				e.preventDefault();
			});			
		} else {
			//$(this).attr('target', 'demo-frame');
			$(this).click(function(e) {
				//Set the hash to the actual page without ".html"
				e.preventDefault();	
				hash = this.getAttribute('href');
				SWS.nav.handle(hash);
				window.location.hash = hash;
			});			
		}				
	});
*/
	$('a.ajax').live('click', function(e) {
		if ($(this).hasClass('modal')) {
			e.preventDefault();			
			SWS.dialog.load(this.getAttribute('href'));
		} else {
			e.preventDefault();
			hash = this.getAttribute('href');
			SWS.nav.handle(hash);
			window.location.hash = hash;			
		}
	});

	SWS._initialized=true;

	//SWS.player.ensure_init(PPL.ads.init);
};
