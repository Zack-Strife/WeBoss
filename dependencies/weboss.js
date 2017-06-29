$(document).ready(function(){
    $('.loader-container-static').click(function(e){
        e.preventDefault();

        $('.footer-div').hide();
        $('.loader-div').show();
    });

    $('.loader-div').click(function(){
        $('.footer-div').show();
        $('.loader-div').hide();
    });

    var accessToken = "8e7fd77ba1924863acd80b41bf189694";
    var baseUrl = "https://api.api.ai/v1/";
    var synth = window.speechSynthesis;

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
        recognition.lang = "en-US";
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
        switch (recognition){
            case null:
                $('.footer-div').show();
                $('.loader-div').hide();
                break;
            case true:
                $('.footer-div').hide();
                $('.loader-div').show();
                break;
        }
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
            data: JSON.stringify({ query: text, lang: "en", sessionId: Date.now() }),
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
        if ('' === val){
            val = 'I didn\'t understand what you said';
        }
        $("#snackbar").text(val);

        var utterThis = new SpeechSynthesisUtterance(val);
        voices = synth.getVoices();
        utterThis.voice = voices[0];
        synth.speak(utterThis);
    }
})