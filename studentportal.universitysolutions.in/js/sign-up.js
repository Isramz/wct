function validateRegno() {
    if (!$("#validateform").valid()) {
        return;
    }
    var univcode = $("#univ").val();
    var parameters = `&univ=${$("#univ").val()}
        &regno=${$("#regno").val()}`;
    $.ajax({
        type: "post",
        url: "validateRegno.php",
        data: parameters,
        success: function(response) {
            var {
                status,
                result
            } = JSON.parse(response);
            if (status == "invalid") {
                swal({
                    title: "Invalid Reg. number / Roll number",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#5495ff",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
            } else if (status == "success") {
                var {
                    fname,
                    ffather,
                    fmother,
                    fregno
                } = result;
                if (univcode == "001") {
                    $("#aperinfo")
                        .html(`<table class="table no-border" style="font-weight:600;font-size:14px">
              <tr style="color:#ea0000;">
                <td width="35%" >NEW REG. NO.</td><td width="2%"> : </td>
                <td> ${fregno}</td>
              </tr>
              <tr>
                <td width="35%">Student Name</td><td width="2%"> : </td><td> ${fname}</td>
              </tr>
              <tr>
                <td width="35%">Father Name</td><td width="2%"> : </td><td> ${ffather}</td>
              </tr>
              <tr>
                <td width="35%">Mother Name</td><td width="2%"> : </td><td> ${fmother}</td>
              </tr>
            </table>`);
                } else {
                    $("#aperinfo")
                        .html(`<table class="table no-border" style="font-weight:600;font-size:14px">
              <tr>
                <td width="35%">Student Name</td><td width="2%"> : </td><td> ${fname}</td>
              </tr>
              <tr>
                <td width="35%">Father Name</td><td width="2%"> : </td><td> ${ffather}</td>
              </tr>
              <tr>
                <td width="35%">Mother Name</td><td width="2%"> : </td><td> ${fmother}</td>
              </tr>
            </table>`);
                }

                $(".card1").css("margin-top", "0%");
                $("#hrule").css("display", "none");
                // $("#sign-up-scroll").slimScroll({
                //   height: "700px"
                // });
                $("#perinfo").css("display", "block");
                $("#sendpasswd").css("display", "none");
                $("#sendotpform").show();
            }
        }
    });
}

function validateInfo() {
    if (!$("#sendotpform").valid()) {
        return;
    }
    var parameters = `&mobile=${$("#mobile").val()}&email=${$("#email").val()}
        &univ=${$("#univ").val()}
        &regno=${$("#regno").val()}&dob=${$("#dob").val()}
        &password=${$("#password").val()}&adharno=${$("#adharno").val()}
        &parmobile=${$("#parmobile").val()}`; //password
    $.ajax({
        type: "post",
        url: "validateInfo.php",
        data: parameters,
        success: function(response) {
            var {
                status,
                result
            } = JSON.parse(response);
            if (status == "invalid") {
                var {
                    fmobexist,
                    femailexist,
                    fregexist
                } = result;
                var message;
                var id;
                if (fmobexist >= "1") {
                    message = "This mobile number is already registered!!";
                    id = "mobile";
                } else if (femailexist >= "1") {
                    message = "This email id is already registered!!";
                    id = "email";
                } else if (fregexist >= "1") {
                    message = "This Reg. number / Roll number is already registered!!";
                    id = "regno";
                }
                swal({
                        title: message,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#5495ff",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    },
                    function(isConfirm) {
                        if (isConfirm) swal.close();
                        document.getElementById(id).focus();
                    }
                );
            } else if (status == "invalidreg") {
                swal({
                    title: "Invalid Reg. number / Roll number",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#5495ff",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
            } else if (status == "success") {
                $.ajax({
                    type: "post",
                    url: "sendMobEmailOTP.php",
                    data: parameters,
                    success: function(response) {
                        var {
                            status,
                            sms,
                            msg
                        } = JSON.parse(response);
                        if (sms == "Sent.") {
                            swal({
                                title: "OTP Sent to your mobile and email Seperately",
                                text: "Enter mobile OTP, Email OTP and proceed",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#5495ff",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                            $("#sendotp").html("Re-Send OTP");
                            $("#mobile").attr("disabled", "true");
                            $("#email").attr("disabled", "true");
                            $("#state").attr("disabled", "true");
                            $("#univ").attr("disabled", "true");
                            $("#regno").attr("disabled", "true");
                            $("#dob").attr("disabled", "true");
                            $("#password").attr("disabled", "true"); //cpassword
                            $("#cpassword").attr("disabled", "true");
                            $("#otpform").show();
                        } else {
                            swal({
                                title: msg,
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#5495ff",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        }
                    }
                });
            }
        }
    });
}

function signup() {
    if (!$("#otpform").valid()) {
        return;
    }
    var parameters = `&mobile=${$("#mobile").val()}
        &motp=${$("#motp").val()}&eotp=${$("#eotp").val()}`;
    $.ajax({
        type: "post",
        url: "signup.php",
        data: parameters,
        success: function(response) {
            var {
                status
            } = JSON.parse(response);
            if (status == "success") {
                swal({
                        title: "You have registered successfully to student portal",
                        text: "Click OK to continue",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#5495ff",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    },
                    function() {
                        //window.location.href = 'sign-in.html';
                        signInWithSignup($("#mobile").val(), $("#password").val());
                    }
                );
            } else {
                swal({
                    title: "Invalid OTP. Try resend OTP.",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#5495ff",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
            }
        }
    });
}

function signInWithSignup(regno, passwd) {
    var parameters = "&regno=" + regno + "&passwd=" + passwd.toUpperCase();
    $.ajax({
        type: "post",
        url: "signin.php",
        data: parameters,
        success: function(response) {
            if (response === "invalid") {
                alert("Invalid Login");
            } else {
                window.location.href = "MainPage.html";
            }
        }
    });
}

/*
var mobile;
var regno;
function sendotps()
{
    //$("#otpmsg").append('<img src="loding.gif" height="40" width="40"> SENDING OTP');
    var parameters = `&mobile=${$('#mobile').val()}&email=${$('#email').val()}
        &univ=${$('#univ').val()}
        &regno=${$('#regno').val()}&dob=${$('#dob').val()}
        &password=${$('#password').val()}&adharno=${$('#adharno').val()}`;

    $.ajax({
        type: 'post',
        url: 'sendMobEmailOTP.php',
        data:parameters,
        success: function(response)
        {
            var {status, sms, email} = JSON.parse(response);
            if(sms == 'Sent.' && email == 'success')
            {
                swal({
                    title: "OTP Sent to your mobile and email seperately",
                    text: "Click OK and enter mobile and email OTP and proceed",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#5495ff",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
                $("#sendotp").html('Re-Send OTP');
                $('#mobile').attr('disabled', 'true');
                $('#email').attr('disabled', 'true');
                $('#state').attr('disabled', 'true');
                $('#univ').attr('disabled', 'true');
                $('#regno').attr('disabled', 'true');
                $('#dob').attr('disabled', 'true');
                $('#password').attr('disabled', 'true');//cpassword
                $('#cpassword').attr('disabled', 'true');
            }
        }
    });

}
function showOtpStatus(response)
{
    $("#otpmsg").html("");
    response = $.trim(response);
    if(response == 'sent')
    {
        swal({
            title: "OTP Sent to your mobile.",
            text: "Enter mobile OTP for next step of Registeration.",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#5495ff",
            confirmButtonText: "OK",
            closeOnConfirm: false
        });
        $("#sendpasswd").html('Re-Send OTP');
    }
    else
    {
        $("#otpmsg").html(response);
        $("#otpmsg").css('color', 'red');
    }
}


function showPassword(response)
{
    if(response == "inserted")
    {
        swal({
            title: "Registeration link has been sent to your Email.",
            text: "Click on the link for next step of Registeration",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#5495ff",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }, function () {
            window.location.href = 'index.html';
        });
    }
    else
    {
        $("#confirm").html("");
        swal({
            title: "Invalid OTP / OTP expired!!. Try resend OTP.",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#5495ff",
            confirmButtonText: "OK",
            closeOnConfirm: false
        })
        //swal("Invalid OTP / OTP expired!!. Try resend OTP.", "warning");//
    }
}

function loadmaster()
{
    $("#success").hide();
}

function sendEmail()
{
    var emailid = document.getElementById("email").value;
    var parameters = "&email="+emailid+"&regno="+regno;
    $.ajax({
        type: 'post',
        url: 'sendEmail.php',
        data:parameters,
        success: function(response)
        {
            if(response == 'inserted')
            {
                $("#email").prop('disabled', true);
                $("#sendemailbtn").prop('disabled', true);
                $("#msg").html('signup was successfull check your email inbox');
            }
        }
    });
}
*/