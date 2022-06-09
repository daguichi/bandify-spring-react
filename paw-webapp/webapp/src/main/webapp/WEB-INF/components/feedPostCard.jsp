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
            <c:if test="${not empty param.youtubeUrl}">
                <div class="feed-post-card-content-ytvideo">
                    <iframe width="560" height="315"
                            src="${param.youtubeUrl}" title="${param.youtubeTitle}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                    </iframe>
                </div>
            </c:if>
            <c:if test="${not empty param.spotifyUrl}">
                <div class="feed-post-card-content-spotify">
                    <iframe style="border-radius:12px"
                            src="${param.spotifyUrl}" width="100%" height="80"
                            allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">

                    </iframe>
                </div>
            </c:if>
            <c:if test="${not empty param.soundcloudUrl}">
                <div class="feed-post-card-content-soundcloud">
                    <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/978526087&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/highway2009" title="Highway2009" target="_blank" style="color: #cccccc; text-decoration: none;">Highway2009</a> · <a href="https://soundcloud.com/highway2009/highway-jetsonmade-another-plane" title="Highway &amp; jetsonmade - Another Plane" target="_blank" style="color: #cccccc; text-decoration: none;">Highway &amp; jetsonmade - Another Plane</a></div>
                </div>
            </c:if>
        </div>
    </div>
</body>
</html>
