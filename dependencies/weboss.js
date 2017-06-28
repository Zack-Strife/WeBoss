$(document).ready(function(){
    $('.title').click(function(e){
        e.preventDefault();

        $('.title-div').hide();
        $('.loader-div').show();
    });

    $('.loader-div').click(function(){
        $('.title-div').show();
        $('.loader-div').hide();
    });

    var accessToken = "0c95040d65bf43cc94e71b5dd31f1a2f";
    var baseUrl = "https://api.api.ai/v1/";
    $(document).ready(function() {
        $("#input").keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault();
                send();
            }
        });
        $("#rec").click(function(event) {
            switchRecognition();
        });
    });
    var recognition;
    function startRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.onstart = function(event) {
            updateRec();
        };
        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
            }
            setInput(text);
            stopRecognition();
        };
        recognition.onend = function() {
            stopRecognition();
        };
        recognition.lang = "fr-FR";
        recognition.start();
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
        updateRec();
    }
    function switchRecognition() {
        if (recognition) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }
    function setInput(text) {
        $("#input").val(text);
        send();
    }
    function updateRec() {
        $("#rec").text(recognition ? "Stop" : "Speak");
    }
    function send() {
        var text = $("#input").val();
        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20150910",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({ query: text, lang: "fr", sessionId: Date.now() }),
            success: function(data) {
                setResponse(data.result.fulfillment.speech);
            },
            error: function() {
                setResponse("Internal Server Error");
            }
        });
        var x = document.getElementById("snackbar")
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    function setResponse(val) {
        $("#snackbar").text(val);
    }
})