<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %> <%@ taglib
prefix="form" uri="http://www.springframework.org/tags/form" %> <%@ page
contentType="text/html;charset=UTF-8" language="java" %> <%@ taglib
prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Questrial"
    />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><spring:message code="home.title"/></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="public/styles/home.css" />
    <style>
      body {
        font-family: "Questrial", sans-serif;
        /* gray-100 */
        --tw-bg-opacity: 1;
        background-color: rgb(243 244 246 / var(--tw-bg-opacity));
      }
      .auditions-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 1rem;
      }
      .auditions-content > h2 {
        font-size: 3rem;
        line-height: 1;
        font-weight: 700;
        padding: 1rem;
        margin: 1rem;
      }
      .posts {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0.75rem;
        justify-content: space-around;
      }
    </style>
  </head>
  <body>
    <!-- Navbar -->
    <jsp:include page="navbar2.jsp">
      <jsp:param name="navItem" value="${2}" />
      <jsp:param name="name" value="Bandify" />
    </jsp:include>

    <!-- Auditions content -->
    <div class="auditions-content">
      <h2 id="posts">
        <spring:message code="home.auditionsSection" />
      </h2>
      <%--Publicaciones de audiciones--%>
      <div class="posts">
        <c:forEach var="audition" items="${auditionList}" varStatus="loop">
          <c:set
            var="lookingFor"
            value="${audition.lookingFor}"
            scope="request"
          />
          <c:set
            var="musicGenres"
            value="${audition.musicGenres}"
            scope="request"
          />
          <jsp:include page="postCard.jsp">
            <jsp:param name="id" value="${audition.id}" />
            <jsp:param name="postCard" value="${1}" />
            <jsp:param name="auditionDate" value="${audition.timeElapsed}" />
            <jsp:param name="auditionTitle" value="${audition.title}" />
            <jsp:param name="auditionEmail" value="${audition.email}" />
            <jsp:param
              name="auditionLocation"
              value="${audition.location.name}"
            />
            <jsp:param
              name="auditionDescription"
              value="${audition.description}"
            />
          </jsp:include>
        </c:forEach>
      </div>
    </div>
  </body>
</html>
