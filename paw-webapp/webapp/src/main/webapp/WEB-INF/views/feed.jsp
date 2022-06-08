<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title><spring:message code="title.feed" /></title>
    <c:import url="../config/generalHead.jsp"/>
    <c:import url="../config/materializeHead.jsp"/>
    <link rel="stylesheet" href="<c:url value="/resources/css/feed.css" />"/>
</head>
<body>
<jsp:include page="../components/navbar.jsp">
    <jsp:param name="navItem" value="${8}"/>
    <jsp:param name="name" value="Bandify"/>
</jsp:include>
<main class="feed-main">
    <div class="left-side-feed">
        <jsp:include page="../components/userCardFeed.jsp">
            <jsp:param name="userId" value="${user.id}"/>
            <jsp:param name="location" value="${user.location.name}"/>
            <jsp:param name="userName" value="${user.name}" />
            <jsp:param name="userSurname" value="${user.surname}"/>
            <jsp:param name="isBand" value="${user.band}" />
        </jsp:include>
    </div>

    <div class="right-side-feed">
        <div style="width: 90%">
            <div class="post-box shadow">
                <spring:message code="artists.img.alt" var="artistImgAlt"/>
                <img class="artist-img-post-box"
                     src="<c:url value='/user/${user.id}/profile-image'/>" alt="${artistImgAlt}"/>
                <button class="text-button">
                    <span class="text-button-span"><spring:message code="feed.postSomething" /></span>
                </button>
            </div>

            <hr class="rounded">

            <spring:message code="loremIpsum" var="loremIpsum"/>
            <jsp:include page="../components/feedPostCard.jsp">
                <jsp:param name="userId" value="1"/>
                <jsp:param name="name" value="Jack"/>
                <jsp:param name="surname" value="Harlow"/>
                <jsp:param name="createdAt" value="Today"/>
                <jsp:param name="text" value="${loremIpsum}"/>
            </jsp:include>
            <jsp:include page="../components/feedPostCard.jsp">
                <jsp:param name="userId" value="2"/>
                <jsp:param name="name" value="JetsonMadeAnotherOne"/>
                <jsp:param name="surname" value=""/>
                <jsp:param name="createdAt" value="Today"/>
                <jsp:param name="text" value="${loremIpsum}"/>
            </jsp:include>

        </div>
    </div>


</main>
<jsp:include page="../components/footer.jsp">
    <jsp:param name="name" value="Bandify"/>
</jsp:include>
</body>
</html>
