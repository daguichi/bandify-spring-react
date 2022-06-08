<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title><spring:message code="title.feedPostCard"/></title>
    <link rel="stylesheet" href="<c:url value="/resources/css/feedPostCard.css" />"/>
</head>
<body>
    <div class="feed-post-card shadow">
        <div class="feed-post-card-header">
            <div class="feed-post-card-header-left">
                <div>
                    <c:url value="/user/${param.userId}" var="profileUrl" />
                    <spring:message code="artists.img.alt" var="artistImgAlt"/>
                    <img class="feed-post-card-header-left-avatar"
                            src="<c:url value='/user/${param.userId}/profile-image'/>" alt="${artistImgAlt}"/>
                </div>
            </div>
            <div class="feed-post-card-header-right">
                <div class="feed-post-card-header-right-name">
                    <span class="feed-post-card-header-right-name-text">
                        <c:out value="${param.name}"/>
                        <c:out value="${param.surname}"/>
                    </span>
                </div>
                <div class="feed-post-card-header-right-time">
                    <span class="feed-post-card-header-right-time-text">
                        <c:out value="${param.createdAt}"/>
                    </span>
                </div>
            </div>
        </div>
        <div class="feed-post-card-content">
            <div class="feed-post-card-content-text">
                <c:out value="${param.text}"/>
            </div>
        </div>
    </div>
</body>
</html>
