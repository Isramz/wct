$("#signin").validate({
    highlight: function(input) {
        $(input)
            .parents(".form-line")
            .addClass("error");
    },
    unhighlight: function(input) {
        $(input)
            .parents(".form-line")
            .removeClass("error");
    },
    errorPlacement: function(error, element) {
        $(element)
            .parents(".inner-addon")
            .append(error)
            .find("label")
            .css("color", "red");
        $(element)
            .parents(".select")
            .append()
            .find("label")
            .css("color", "red");
    }
});

function signIn() {
    if (!$("#signin").valid()) {
        return;
    }

    var regno = document.getElementById("regno").value;
    var passwd = document.getElementById("passwd").value;
    var parameters = "&regno=" + regno + "&passwd=" + passwd.toUpperCase();
    $.ajax({
        type: "post",
        url: "signin.php",
        data: parameters,
        success: function(response) {
            var {
                error_code,
                msg
            } = JSON.parse(response);
            if (error_code == 0) {
                window.location.href = "MainPage.html";
            } else {
                alert(msg);
            }
        }
    });
}

function displayadarno(id) {
    //console.log($('#'+id).val());
    $("#adhar").hide();
    if ($("#" + id).val() == "008") $("#adhar").show();
}

function loadSignUp() {
    $("#sign_in").load("sign-up.html?v=3", function() {
        $("#otpform").hide(); //sendotpform
        $("#sendotpform").hide();
        $.ajax({
            type: "post",
            url: "getstatesanduniv.php",
            success: function(response) {
                response = JSON.parse(response);
                //console.log(response.state);
                var opstate = "<option value=''>--SELECT--</option>";
                for (var i = 0; i < response.state.length; i++) {
                    var state = response.state[i];
                    opstate +=
                        "<option value='" +
                        state.fstate +
                        "'>" +
                        state.fstate +
                        "</option>";
                }
                $("#state").html(opstate);
                universityResp = response.university;

                $("#state").change(function() {
                    var univ = this.value;
                    var matchuniv = universityResp.filter(function(el) {
                        return el.fstate == univ;
                    });
                    var opstate = "<option value=''>--SELECT--</option>";
                    for (var i = 0; i < matchuniv.length; i++) {
                        var university = matchuniv[i];
                        opstate +=
                            "<option value='" +
                            university.funivcode +
                            "'>" +
                            university.funivname +
                            "</option>";
                    }
                    $("#univ").html(opstate);
                });

                var fewSeconds = 30;
                $("#sendotp").click(function() {
                    // Ajax request
                    var btn = $(this);
                    btn.prop("disabled", true);
                    setTimeout(function() {
                        btn.prop("disabled", false);
                    }, fewSeconds * 1000);
                });
            }
        });
    });
}

function loadForgotPasswd() {
    $("#sign_in").load("forgotPassword.html", function() {
        $(".card1").css("margin-top", "25%");
    });
}

function acceptNumbersOnlyForModule(evt) {
    var charCode;
    if (window.event) charCode = window.event.keyCode;
    //if IE
    else charCode = evt.which; //if firefox
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

function charKeydown(evt) {
    var charCode;
    if (window.event) charCode = window.event.keyCode;
    //for IE
    else charCode = evt.which; //for firefox
    if (charCode == 32)
        //for &lt;space&gt; symbol
        return true;
    if (charCode > 31 && charCode < 65)
        //for characters before 'A' in ASCII Table
        return false;
    if (charCode > 90 && charCode < 97)
        //for characters between 'Z' and 'a' in ASCII Table
        return false;
    if (charCode > 122)
        //for characters beyond 'z' in ASCII Table
        return false;
    return true;
}