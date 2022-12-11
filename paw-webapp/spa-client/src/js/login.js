function loginFormCheck(){
    let invalidMail=document.getElementById("invalidMail")
    let invalidPassword=document.getElementById("invalidPassword")

    invalidMail.style.display='none'
    invalidPassword.style.display='none'

    let password=document.getElementById("password").value;
    let email=document.getElementById("email").value;
    let validForm=true;

    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(!validRegex.test(email)){
        validForm=false;
        invalidMail.style.display='block'

    }

    if(email.length<=0 || email.length>=250 ){
        invalidMail.style.display='block'
        validForm=false;

    }
    if(password.length<=0 || password.length>=25){
        invalidPassword.style.display='block'

        validForm=false;
    }
    if(typeof password!='string'||typeof email != 'string'){
        validForm=false;
    }
    if(!validForm){
        snackbarMessage()
    }
    return validForm;
}