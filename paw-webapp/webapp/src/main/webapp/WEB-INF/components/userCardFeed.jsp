<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title><spring:message code="title.userCardFeed"/></title>
    <link rel="stylesheet" href="<c:url value="/resources/css/userCardFeed.css" />" />
</head>
<body>
<div class="artist-card shadow">
    <c:if test="${param.isBand}">
        <div class="imageDiv-band">
            <spring:message code="artists.img.alt" var="artistImgAlt"/>
            <img class="artist-img"
                 src="<c:url value='/user/${param.userId}/profile-image'/>" alt="${artistImgAlt}"/>
        </div>
    </c:if>
    <c:if test="${!param.isBand}">
        <div class="imageDiv-artist">
            <spring:message code="artists.img.alt" var="artistImgAlt"/>
            <img class="artist-img"
                 src="<c:url value='/user/${param.userId}/profile-image'/>" alt="${artistImgAlt}"/>
        </div>
    </c:if>

    <div class="artist-content">
        <div>
            <c:url value="/user/${param.userId}" var="profileUrl" />
            <a href="${profileUrl}">
                <p class="artist-name">
                    <c:out value="${param.userName}" />
                    <c:out value="${param.userSurname}"/>
                </p>
            </a>

            <p class="artist-description">
                <c:if test="${param.isBand}">
                    <span class="account-type-label-band">
                        <spring:message code="register.band_word"/>
                    </span>
                </c:if>
                <c:if test="${!param.isBand}">
                    <span class="account-type-label-artist">
                        <spring:message code="register.artist_word"/>
                    </span>
                </c:if>
            </p>
        </div>
    </div>


</div>
</body>
</html>
