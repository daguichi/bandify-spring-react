<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>

<head>
    <c:import url="../config/generalHead.jsp"/>
    <link rel="stylesheet" href="<c:url value="${pageContext.request.contextPath}/resources/css/forms.css" />"/>
    <link rel="stylesheet" href="<c:url value="${pageContext.request.contextPath}/resources/css/alerts.css" />"/>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/formchecks.js"></script>
    <style>
        .register-content {
            display: flex;
            justify-content: center;
            padding: 24px;
        }

        .box {
            background-color: #efefef;
            opacity: 0.9;
            width: 60%;
            padding: 0.5rem 1.5rem;
            border-color: #6c0c8436;
            border-radius: 0.75rem;
            border-width: 1px;
            border-style: dotted;
            font-size: 1.25rem;
            line-height: 1.5rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
<!-- Navbar -->
<jsp:include page="../components/navbar.jsp">
    <jsp:param name="navItem" value="${1}"/>
    <jsp:param name="name" value="Bandify"/>
</jsp:include>

<div class="register-content">
    <c:url value="/registerBand" var="registerUrl"/>
    <form:form
            modelAttribute="userBandForm"
            action="${registerUrl}"
            method="post"
            acceptCharset="utf-8"
            class="box"
    >
        <div>
            <form:label class="form-label" path="email">
                <spring:message code="register.form.email"/>
            </form:label>
            <spring:message code="register.form.emailplaceholder" var="emailplaceholder"/>
            <form:input type="text" id="email" maxlength="50" placeholder="${emailplaceholder}" class="form-input" path="email"/>
            <form:errors path="email"  element="p" cssClass="error"> </form:errors>
        </div>

        <div>
            <form:label class="form-label" path="password">
                <spring:message code="register.form.password"/>
            </form:label>
            <spring:message code="register.form.passwordplaceholder" var="passwordplaceholder"/>
            <form:input type="password" id="password" maxlength="50" placeholder="${passwordplaceholder}" class="form-input"
                        path="password"/>
            <form:errors path="password" element="p" cssClass="error"> </form:errors>
        </div>

        <div>
            <form:label class="form-label" path="name">
                <spring:message code="register.form.band_name"/>
            </form:label>
            <spring:message code="register.form.nameplaceholder" var="nameplaceholder"/>
            <form:input id="name" type="text" maxlength="50" placeholder="${nameplaceholder}" class="form-input" path="name"/>
            <form:errors path="name" element="p" cssClass="error"> </form:errors>
        </div>

        <div class="end-button-div">
            <button
                    type="submit"
                    onclick="return registerbandCheck()"
                    class="purple-button"
            >
                <spring:message code="register.postButton"/>
            </button>
        </div>
    </form:form>
</div>
<div id="snackbar"><spring:message code="snackbar.message"/></div>


</body>
</html>