/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
var username = "";
var isOwner = false;
var room = "";
var isMod = false;
var count = 0;

function sendJson(data) {
    ws.send(data);
}
function clearMessages() {
    var messages = $(".message");
    for(var i = 0; i<messages.length; i++) {
        messages[i].remove()
    }
}
function hideModButtons() {
    var buttons = $(".modbuttons");
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        $(button).css({"display": "none"})
    }
    $("#banlist-btn").css({"display": "none"})
}
function set_cookie(key, value) {
    Cookies.set(key, value, {"path": "/"});
}
function get_cookie(key) {
    return Cookies.get(key);
}
function remove_cookie(key) {
    Cookies.remove(key);
}
function showModButtons() {
    if (isOwner || isMod) {
        var buttons = $(".modbuttons");
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            $(button).css({"display": "inline-block"})
        }
        $("#banlist-btn").css({"display": "inline-block"});
    }
}
function hideOwnerButtons() {
    var buttons = $(".ownerbuttons");
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        $(button).css({"display": "none"})
    }
    hideModButtons();
}
function showOwnerButtons() {
    if (isOwner) {
        var buttons = $(".ownerbuttons");
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            $(button).css({"display": "block"})
        }
        showModButtons()
    }
}
function iyt(url) {
    var _url = new URL(url);
    if (_url.hostname === "www.youtu.be" || _url.hostname === "youtu.be" || _url.hostname == "m.youtu.be") {
        $("#box-2").show();
        var id = url.split("/");
        var id = id[id.length-1];
        var ifr = document.createElement("iframe");
        ifr.setAttribute("class", "h-48 w-full video")
        ifr.setAttribute("allowfullscreen", "true");
        ifr.setAttribute("src", "https://youtube.com/embed/" + id + "?loop=1");
        document.getElementById("box-2").appendChild(ifr);
    }
    if (_url.hostname === "www.youtube.com" || _url.hostname === "youtube.com" || _url.hostname == "m.youtube.com") {
        $("#box-2").show();
        var id = url.split("watch?v=")[1];
        var ifr = document.createElement("iframe");
        ifr.setAttribute("class", "h-48 w-full video");
        ifr.setAttribute("allowfullscreen", "true");
        ifr.setAttribute("src", "https://youtube.com/embed/" + id + "?loop=1");
        document.getElementById("box-2").appendChild(ifr);
    }
    var _i = _url.pathname.split(".");
    var _l = _i[_i.length -1];
    if (_l === "jpeg" || _l === "jpg" || _l === "png" || _l === "gif") {
        $("#box-2").show();
        var i = document.createElement("img");
        i.setAttribute("class", "w-full h-48 image");
        i.setAttribute("src", url);
        document.getElementById("box-2").appendChild(i);
        $(i).on("click", function(){
            window.open("intent:" + url + "#Intent;end", "_blank");
       });
    }
    if (_l === "mp3" || _l === "ogg" || _l === "wav") {
        $("#box-2").show();
        var audio = document.createElement("audio");
        var smp3 = document.createElement("source");
        var sogg = document.createElement("source");
        var swav = document.createElement("source");
        smp3.setAttribute("type", "audio/mp3");
        sogg.setAttribute("type", "audio/ogg");
        swav.setAttribute("type", "audio/wav");
	    smp3.setAttribute("src", url);
        sogg.setAttribute("src", url);
        swav.setAttribute("src", url);
        audio.setAttribute("class", "my-1 w-full, audio");
        audio.setAttribute("controls", "true");
        audio.appendChild(smp3);
        audio.appendChild(sogg);
        audio.appendChild(swav);
        document.getElementById("box-2").appendChild(audio);
    }
    if (_l === "mp4" || _l === "webm") {
        $("#box-2").show();
        var video = document.createElement("video");
        var smp4 = document.createElement("source");
        var swebm = document.createElement("source");
        smp4.setAttribute("type", "video/mp4");
	    swebm.setAttribute("type", "video/webm");
        smp4.setAttribute("src", url);
        swebm.setAttribute("src", url);
        video.setAttribute("class", "my-1 w-full video");
        video.setAttribute("controls", "true");
        video.appendChild(smp4);
        video.appendChild(swebm);
        document.getElementById("box-2").appendChild(video);
    }
    if (
        _url.hostname != "www.youtube.com" && _url.hostname != "youtube.com" &&
        _url.hostname != "www.youtu.be" && _url.hostname != "youtu.be" &&
        _url.hostname != "m.youtube.com" && _url.hostname != "m.youtu.be" &&
        _l != "mp3" &&
        _l != "ogg" &&
        _l != "webm"&&
        _l != "mp4" &&
        _l != "png" &&
        _l != "jpg" &&
        _l != "jpeg"&&
        _l != "gif") {
        console.log("OPENNING: " + url);
        window.open(url, "_blank");
    }
    $("#register").hide();
    $("#join").hide();
    $("#login").hide();
    $("#create").hide();
    $("#ul").hide();
    $("#banlist").hide();
    $("#forgot").hide();
    $("#settings").hide();
}
$("#box-2-x").on("click", function(){
    $("#box-2").hide();
    var video = $(".video");
    var image = $(".image");
    var audio = $(".audio");
    for(var i=0; i<video.length; i++){video[i].remove();}
    for(var i=0; i<image.length; i++){image[i].remove();}
    for(var i=0; i<audio.length; i++){audio[i].remove();}
});
$("#log-btn").on("click", function(){
    if($(this).text() == "Login") {
        $("#box-2").show();
        $("#register").hide();
        $("#join").hide();
        $("#login").show();
        $("#create").hide();
        $("#ul").hide();
        $("#banlist").hide();
        $("#forgot").hide();
        $("#settings").hide();
    }
    if ($(this).text() == "Logout"){
        var m = {"logout": 1}
        var s = JSON.stringify(m);
        sendJson(s);
        $(this).text("Login");
        $("#join-btn").hide();
        $("#userlist-btn").hide();
        $("#create-room-btn").hide();
        $("#banlist-btn").hide();
        $("#reg-btn").show();
        $("#settings-btn").hide()
        $("#login-status").text("");
        clearMessages();
        $("#title").html("");
        $("#description").html("");
        $("#forgot-btn").show();


    }
});

function Linkify(inputText) {
    //URLs starting with http://, https://
    var replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = inputText.replace(replacePattern1, '<span style="color: blue; cursor: pointer; text-decoration: underline;" class="visit:visited" onclick="iyt(\'$1\')">$1</span>');

    return replacedText
}

$("#log-user").val(get_cookie("user"));
$("#log-password").val(get_cookie("password"));
$("#submit-login-btn").on("click", function(){
    var user = $("#log-user").val();
    $("#log-user").val("");
    var password = $("#log-password").val();
    $("#log-password").val("");
    var m = {"login":1, "user": user, "password": password};
    var s = JSON.stringify(m);
    username = user.toLowerCase();
    sendJson(s);
    remove_cookie("user");
    remove_cookie("password");
    set_cookie("user", user);
    set_cookie("password", password);

});
$("#submit-join-btn").on("click", function(){
    var r = $("#j-room");
    var rv = r.val();
    r.val("");
    room = rv.toLowerCase();
    var m = {"join": 1, "room": rv};
    var s = JSON.stringify(m);
    sendJson(s);
    remove_cookie("room")
    set_cookie("room", rv);
    room = rv.toLowerCase();
})
$("#userlist-btn").on("click", function(){
    $("#box-2").show();
    $("#register").hide();
    $("#join").hide();
    $("#login").hide();
    $("#create").hide();
    $("#ul").show();
    $("#banlist").hide();
    $("#forgot").hide();
    $("#settings").hide();

});

$("#join-btn").on("click", function(){
    $("#box-2").show();
    $("#register").hide();
    $("#join").show();
    $("#login").hide();
    $("#create").hide();
    $("#ul").hide();
    $("#banlist").hide();
    $("#create").hide();
    $("#forgot").hide();
    $("#settings").hide();
});
$("#reg-btn").on("click", function(){
    $("#box-2").show();
    $("#register").show();
    $("#join").hide();
    $("#login").hide();
    $("#create").hide();
    $("#ul").hide();
    $("#banlist").hide();
    $("#create").hide();
    $("#forgot").hide();
    $("#settings").hide();
});
$("#create-room-btn").on("click", function(){
    $("#box-2").show();
    $("#register").hide();
    $("#join").hide();
    $("#login").hide();
    $("#create").hide();
    $("#ul").hide();
    $("#banlist").hide();
    $("#create").show();
    $("#forgot").hide();
    $("#settings").hide();
});
$("#banlist-btn").on("click", function(){
    $("#box-2").show();
    $("#register").hide();
    $("#join").hide();
    $("#login").hide();
    $("#create").hide();
    $("#ul").hide();
    $("#banlist").show();
    $("#create").hide();
    $("#forgot").hide();
    $("#settings").hide();
});
$("#forgot-btn").on("click", function(){
  $("#box-2").show();
  $("#register").hide();
  $("#join").hide();
  $("#login").hide();
  $("#create").hide();
  $("#ul").hide();
  $("#banlist").hide();
  $("#create").hide();
  $("#forgot").show();
  $("#settings").hide();
});
$("#settings-btn").on("click", function(){
  $("#box-2").show();
  $("#register").hide();
  $("#join").hide();
  $("#login").hide();
  $("#create").hide();
  $("#ul").hide();
  $("#banlist").hide();
  $("#create").hide();
  $("#forgot").hide();
  $("#settings").show();
});
$("#submit-forgot-btn").on("click", function() {
  var email = $("#forgot-password")
  var ev = email.val();
  email.val("");
  var m = {"forgotpassword": 1, "email": ev, "name": $("#forgot-user").val()};
  var s = JSON.stringify(m);
  sendJson(s);
});
$("#submit-roombg").on("click", function() {
    m = {"setchatbg": 1, "url": $("#roombg-input").val()}
    sendJson(JSON.stringify(m));
})
$("#submit-profile-image").on("click", function(){
    var _ = $("#settings-profile-image");
    var url = _.val();
   _.val("");
   var m = {"setprofileimg": 1, "url": url};
   var s = JSON.stringify(m);
   sendJson(s);
 });

$("#submit-user-background-image").on("click", function(){
    var _ = $("#settings-user-background-image");
    var url = _.val();
   _.val("");
   var m = {"setbg": 1, "url": url};
   var s = JSON.stringify(m);
   sendJson(s);
 });

$("#submit-create-btn").on("click", function(){
    var c = $("#cr");
    var cr = c.val();
    var title = $("#cr-title").val();
    var description = $("#cr-description").val();
    c.val("");
    var m = {"create": 1, "room": cr, "title": title, "description": description};
    var s = JSON.stringify(m);
    sendJson(s);
});
$("#msg").keyup(function(e){
    if (e.which == 13){
        var message = $("#msg")
        if (message.val().length === 0 || message.val() == " " || message.val() == ""){
            message.val("")
        } else{
            var v = message.val();
            var m = {"msg": 1, "body": v};
            var s = JSON.stringify(m);
            sendJson(s);
            message.val("");
        }

        return false;
    }
});

$("#submit-room-title").on("click", function(){
    var title = $("#room-title").val();
    var m = JSON.stringify({"settitle": 1, "title": title})
    sendJson(m);

})
$("#submit-add-mod").on("click", function(){
    var mod = $("#mod").val();
    var m = {"mod": 1, "mode": "add", "target": mod}
    sendJson(JSON.stringify(m));
});
$("#submit-remove-mod").on("click", function(){
    var mod = $("#mod").val();
    var m = {"mod": 1, "mode": "remove", "target": mod}
    sendJson(JSON.stringify(m));
});
$("#submit-room-description").on("click", function(){
    sendJson(JSON.stringify({"setdescription": 1, "description": $("#room-description").val()}))
})
$("#submit-register-btn").on("click", function(){
    var email = $("#reg-email").val();
    var user = $("#reg-username").val();
    var password = $("#reg-password").val();
    var m = {
        "register": 1,
        "email": email,
        "user": user,
        "password": password
    }
    var s = JSON.stringify(m);
    sendJson(s);
});
$("#alert-x").on("click", function() {
    $("#alert").hide();
});
function addMessage(user, uuid, mid, ts, message) {
    message = Linkify(message);
    var element = document.createElement("div");
    $(element).css({"background-image": "url('https://animechatbox.xyz:4441/user_bg/?user=" + user + "&ts="+ new Date().getTime()+"')"});
    element.setAttribute("data-msgid", mid);
    element.setAttribute("class", "message border-2 border-solid border-gray-300 rounded-xl shadow mx-3 my-3 h-32");
    element.setAttribute("data-uuid", uuid);
    element.setAttribute("data-user", user);
    var time = document.createElement("span");
    time.setAttribute("class", "time");
    time.innerText = ts;
    var modb = document.createElement("div");
    modb.setAttribute("class", "modbuttons");
    var b = document.createElement("span");
    var delmsg = document.createElement("span");
    delmsg.id = "mod-delete-message"
    delmsg.innerText = "Delete Message";
    delmsg.setAttribute("class", "message-delete");
    b.id = "mod-ban";
    b.setAttribute("class", "message-ban");
    b.innerText = "Ban";
    var deluser = document.createElement("span")
    deluser.setAttribute("class", "message-delete-user");
    deluser.id = "mod-delete";
    deluser.innerText = "Delete";
    var img = document.createElement("img");
    img.src = "https://animechatbox.xyz:4441/user/?user=" + user + "&ts=" + new Date().getTime();
    img.id = 'profileimg';
    img.setAttribute("class", "rounded-full shadow border-solid border-2 border-gray-300 border-2 h-12 w-12")
    var u = document.createElement("span");
    u.setAttribute("class", "user");
    u.innerText = user;
    var msg = document.createElement("span");
    msg.setAttribute("class", "text");
    msg.innerHTML = message;
    element.appendChild(time);
    modb.appendChild(deluser);
    modb.appendChild(b);
    modb.appendChild(delmsg);
    element.appendChild(modb);
    element.appendChild(img);
    element.appendChild(u);
    element.appendChild(msg);
    document.getElementById("box").appendChild(element);
    $(deluser).on("click", function(){
        var parent = $(this).parent();
        var parent = $(parent).parent();
        var u = $(parent).data("user");
        console.log(u)
        var m = {
            "deleteuser": 1,
            "user": u
        }
        var s = JSON.stringify(m);
        sendJson(s);
    });
    $(delmsg).on("click", function(){
        var parent = $(this).parent();
        var parent = $(parent).parent();
        var id = $(parent).data("msgid");
        var m = {
            "delete": 1,
            "mid": id
        }
        var s = JSON.stringify(m);
        sendJson(s);
    });
    $(b).on("click", function(){
      var parent = $(this).parent();
      var parent = $(parent).parent();
      var u = $(parent).data("user");
      var id = $(parent).data("uuid");
      var s = JSON.stringify({"ban": 1, "uid": id, "target": u})
      sendJson(s);
    });
    showOwnerButtons();
    showModButtons();
}

function addBanlist(name, id) {
    var div = document.createElement("div");
    div.setAttribute("class", "banned my-3");
    div.setAttribute("data-ban-user", name);
    div.setAttribute("data-ban-id", id);
    var user = document.createElement("span");
    user.setAttribute("class", "mx-1 my-1 shadow");
    user.innerText = name;
    var button = document.createElement("span");
    button.setAttribute("class", "unban text-white bg-green-300 border-2 border-solid border-green-200 py-1 px-1 shadow mx-1 hover:bg-green-500");
    button.innerText = "Unban";
    div.appendChild(user);
    div.appendChild(button);
    var bl = document.getElementById("banlist");
    bl.appendChild(div);
    $(button).on("click", function() {
        var parent = $(this).parent()
        var name = $(parent).data("ban-user");
        var id = $(parent).data("ban-id");
        var m = {
            "unban": 1,
            "target": name,
            "uid": id
        }
        var s = JSON.stringify(m);
        sendJson(s);
    })
}
function removeBan(user) {
     $(".banned").filter(function() {
         return $(this).data("ban-user") == user;
     }).remove();
}
function removeById(id){
    $(".message").filter(function(){
        return $(this).data("msgid") == id;
    }).remove();
}
function removeByUser(user) {
    $(".message").filter(function(){
        return $(this).data("user") == user;
    }).remove();
}
function removeUl(user) {
    $(".userlist-entry").filter(function(){
        return $(this).data("ul-user") == user;
    }).remove();
}
function addUserlist(user) {
    var div = document.createElement("div");
    div.setAttribute("class", "ownerbuttons my-1");
    var addmod = document.createElement("span");
    addmod.setAttribute("class", "ob px-1 py-1 bg-green-400 text-white shadow rounded-lg border-solid border-2 border-green-300 hover:bg-green-500");
    var removemod = document.createElement("span");
    removemod.setAttribute("class", "ob bg-green-400 text-white px-1 py-1 shadow rounded-lg border-solid border-2 border-green-300 hover:bg-green-500");
    addmod.innerText = "Add Mod";
    removemod.innerText = "Remove Mod";
    div.appendChild(addmod);
    div.appendChild(removemod);
    var entry = document.createElement("div");
    entry.setAttribute("class", "userlist-entry");
    entry.setAttribute("data-ul-user", user);
    entry.innerText = user;
    entry.appendChild(div)

    var userlist = document.getElementById("ul");
    userlist.appendChild(entry)
    $(addmod).on("click", function() {
      var user = $(this).parent().parent().data("ul-user");
      var m = {
          "mod": 1,
          "mode":"add",
          "target": user
        }
      var s = JSON.stringify(m);
      console.log(s);
      sendJson(s);
    });
    $(removemod).on("click", function() {
      var parent = $(this).parent().parent();
      var user = $(parent).data("ul-user");
      console.log(user)
      var m = {
        "mod": 1,
        "mode": "remove",
        "target": user
      }
      var s = JSON.stringify(m);
      console.log(s)
      sendJson(s);
    });
}
function removeMod(user) {
    $(".mod").filter(function(){
        return $(this).data("ul-user") == user;
    }).removeClass("mod");
}
function addMod(user) {
    $(".userlist-entry").filter(function(){
        return $(this).data("ul-user") == user;
    }).addClass("mod");
}
function formatTime(ts) {
    var date = new Date(ts * 1000);
    return date.toLocaleString();
}
(function(){
    isLoggedIn = false;
    username = null;
    isJoinedRoom = false;
    ws = new WebSocket("wss://animechatbox.xyz/");
    ws.onopen = function() {
      console.log("WebSocket: connected");
      if (get_cookie("email") && get_cookie("password")) {
          $("#submit-login-btn").click();
      }

    }
    ws.onmessage = function(e){
        var j = JSON.parse(e.data);
        if (j.login) {
            isLoggedIn = true;
            $("#log-btn").text("Logout");
            isOwner = false;
            isMod = false;
            $("#create-room-btn").show();
            $("#reg-btn").hide();
            $("#forgot-btn").hide();
            $("#join-btn").show();
            $("#box-2").hide();
            $("#settings-btn").show();
            $("#status-login").text("");
            var r = get_cookie("room");
            if (r){
                room = r.toLowerCase();
            } else {
                r = "help";
                room = r;
            }
            var c = JSON.stringify({"join": 1, "room": r});
            sendJson(c);

        }
        if(j.login == 0){
            $("#status-login").text(j.message);
            username = undefined;
        }
        if (j.created) {
          $("#status-create").text(j.message);
        }
        if(j.created == 0) {
          $("#status-create").text(j.message);
        }
        if (j.registered){
            $("#box-2").hide();
            $("#status-register").text(j.message);
        }
        if(j.registered == 0) {
            $("#status-register").text(j.message);
        }
        if(j.joined) {
            count = 0;
            clearMessages();
            $("body").css({"background-image": "url(https://animechatbox.xyz:4441/room/?room="+room+"&ts=" + new Date().getTime()+")"});
            var his = {"history": 1, "limit": 500, "start_at": 0};
            var mods = {"mod": 1, "mode": "list"};
            var ul = {"userlist": 1};
            var title = JSON.stringify({"reqtitle": 1})
            var description = JSON.stringify({"reqdescription": 1})
            var bl = {"banlist": 1};
            var h = JSON.stringify(his);
            var m = JSON.stringify(mods);
            var u = JSON.stringify(ul);
            var b = JSON.stringify(bl);
            sendJson(h);
            sendJson(m);
            sendJson(u);
            sendJson(b);
            sendJson(title);
            sendJson(description);
            isJoinedRoom = true;
            isMod = false;
            isOwner = false;
            $("#status-join").text("");
            $("#msg").show()
            $("#ul").html("");
            $("#banlist").html("");
            $("#userlist-btn").show();
            $("#count").text(0);
            hideModButtons();
            console.log("hideModButtons():")
            hideOwnerButtons();
            $("#box-2").hide();
        }
        if(j.joined == 0) {
            room = "";
           $("#status-join").text(j.message);
        }
        if(j.msg) {
            var name = j.user;
            var mid = j.mid;
            var id = j.uid;
            var ts = formatTime(j.time);
            var body = j.body;
            addMessage(name, id, mid, ts, body);
            var div = document.getElementById("box");
            div.scrollTop = div.scrollHeight;
        }
        if (j.msg == 0) {
            $("#alert-text").text(j.message);
            $("#alert").show();
        }
        if(j.ul){
            count++;
            addUserlist(j.ul);
            $("#count").text(count);
        }
        if(j.settitle){$("#title").html(j.title); $("#room-title").val(j.title)}
        if (j.setdescription){$("#description").html(j.description); $("#room-description").val(j.description)}
        if (j.history) {
            var name = j.user;
            var id = j.uid;
            var mid = j.mid;
            var ts = formatTime(j.time);
            var body = j.body;
            addMessage(name, id, mid, ts, body);
            var div = document.getElementById("box");
            div.scrollTop = div.scrollHeight;
        }
        if (j.deleteuser) {
            removeByUser(j.user);
        }
        if(j.deleted){
            var id = j.mid;
            removeById(id);
        }
        if (j.left){
            count--;
            removeUl(j.user);
            $("#count").text(count);
        };
        if(j.modded) {
            if (j.user == username) {
                isMod = true;
                showModButtons();
            }
            addMod(j.name);
        }
        if(j.join) {
            if (!j.user == username) {
                addUserlist(j.user);
                count++;
                $("#count").text(count);
            }
        }
        if(j.mods) {
            var owner = j.mods[j.mods.length -1].owner;
            if (owner == username) {
                isOwner = true;
                showOwnerButtons();
            }
            for (var i=0; i<j.mods.length; i++) {
                if(j.mods[i] == username) {
                    isMod = true;
                    showModButtons();
                }
                addMod(j.mods[i])
            }
        }
        if(j.demodded) {
            if(j.user == username) {
                isMod = false;
                hideModButtons();
            }
            removeMod(j.user);
        }
        if(j.banned) {
            $("#msg").hide();
            $("#alert-text").text("you are banned from this room");
            $("#alert").show();
        }
        if (j.banlist) {
            var name = j.user;
            var id = j.uid;
            addBanlist(name, id);
        }
        if(j.ban) {
            var name = j.target;
            var id = j.uid;
            addBanlist(name, id);
        }
        if(j.unban) {
            removeBan(j.target);
            $("#msg").show();
        }
	    if (j.chatbg){
            $("body").css({"background-image": "url("+j.url+"&ts="+ new Date().getTime()+")"});
        }
        if (j.verified == 0){
            $("#alert-text").text(j.message);
            $("#alert").show();
        }
        if(j.listrooms){
            addMessage("_SYSTEM_", "SYSTEM", "SYSTEM", new Date().getTime(), j.room);
        }
    }
    ws.onclose = function() {
        console.log("WebSocket: closed")
        $("html").html("<p align='center'><b>Server Disconnected Refreshing</b></p>")
        window.setTimeout(function(){window.location.href = window.location.href + "?" + new Date().getTime();}, 3000);
        ws.close();
    }
})();
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log("ready")
};
