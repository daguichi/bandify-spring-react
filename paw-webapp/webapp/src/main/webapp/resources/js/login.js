function loginFormCheck(){
    document.getElementById("invalidMail").style.display='none'
    document.getElementById("invalidPassword").style.display='none'

    password=document.getElementById("password").value;
    email=document.getElementById("email").value;
    validForm=true;
    if(email.length<=0 || email.length>=250 ){
        document.getElementById("invalidMail").style.display='block'
        validForm=false;

    }
    if(password.length<=0 || password.length>=50){
        document.getElementById("invalidPassword").style.display='block'

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