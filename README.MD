### passport 관련 자료
---

https://velog.io/@jakeseo_me/%EB%B2%88%EC%97%AD-passport-local%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%98%EB%8A%94-%EB%AA%A8%EB%93%A0-%EA%B2%83#%EB%B3%B4%ED%98%B8%EB%90%9C-%EB%9D%BC%EC%9A%B0%ED%8A%B8%EC%97%90-%EC%A0%91%EA%B7%BC%ED%96%88%EC%9D%84-%EB%95%8C

https://woowacourse.github.io/tecoble/post/2021-05-22-cookie-session-jwt/

<br>

### 해쉬함수 
---

https://www.youtube.com/watch?v=67UwxR3ts2E

<br>

### sessions and cookie 

<br>

✔ IOS나 안드로이드 앱을 만들 때 이것들은 쿠키를 갖지 않기 때문에 token을 사용해 구현한다

request를 할 때마다 브라우저는 알아서 그 request에 cookie를 덧붙이게 된다.

즉 express-session middleware가 브라우저에 cookie를 보내고 브라우저는 cookie로 뭘 할지, 어디에 넣을지 모든 걸 알게된다.
게다가 브라우저는 우리가 매번 backend localhost에 있는 url로 requeset를 보낼 때마다 cookie가 request랑 같이 전송된다는 것도 알고 있다.

그렇다면 cookie에 무슨 정보를 넣을 수 있을까?
어떤 정보든 넣을 수 있다.
우리가 넣을 것은 session ID이다.

왜냐면 브라우저와 backend와의 연결이 평생 보장되지 않기때문이다. => 우리는 http를 사용하고 http는 stateless이기 때문이다.
그러므로 우리는 사용자에게 session ID를 준다.
그 session ID를 넣을 곳이 바로 cookie이다.

즉 cookie와 session은 별개의 개념이다.

cookie는 단지 정보를 주고 받는 방법이고, 그게 다이다.
cookie의 좋은점은 자동적으로 처리되는 것이다. cookie를 받고, 보내는 과정에서 사용자는 아무것도
안해도 되고 별개의 코드를 작성할 필요도 없다. 왜냐면 우린 http 표준을 따르고 있기 때문이다.

또 다른 하나는 session ID인데, 이건 cookie에 저장된다.
왜냐면 cookie는 session ID를 전송하는데 사용되기 때문이다. 

어쨌든 session ID가 브라우저의 cookie안에 저장되고, backend에도 저장된다는게 요점이다.
backend는 사용되고 있는 모든 session ID를 유지하는데, 여기에 몇 가지 문제가 있다(memory의 관리되 휘발적이다, session id을 db에 저장하여 해결)

로그인한 사용자만 session db에 저장하는 것이 좋다 => db에 필요없는 데이터를 저장하지 않아 자원의 낭비를 줄임

ex) 10만명의 익명 방문자가 온다면 모두 세션을 만들어 저장하는게 좋은가? 그렇다면 db를 유지하기 위해 많은 비용이 들 것이다

=>로그인한 유저만 쿠키를 준다 
 	
	세션 설정 코드

	resave: false,
    	saveUninitialized: false, => 세션이 수정이 안된다면 초기화 하지 않는다. 세션을 수정하는 곳은? 
			         로그인 로직에서 req.session.user=user, req.session.loggedIn= true 부분이다.
			         즉, 로그인을 성공 했을 때 세션을 DB에 저장하고 쿠키를 넘겨주도록 로직이 구현된다


https://nomadcoders.co/wetube/lectures/2721

<br>

### nodemailer 관련 자료
---
<br>

https://miryang.dev/2019/04/25/nodejs-page-3/

https://techlog.io/Server/Node-js/node-js%EC%97%90%EC%84%9C-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EC%9D%B8%EC%A6%9D%EC%9D%84-%ED%86%B5%ED%95%9C-%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EC%B4%88%EA%B8%B0%ED%99%94-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0/

https://www.codegrepper.com/code-examples/javascript/javascript+date+minus+seconds

<br>

### oauth github
---

<br>

https://github.com/login/oauth/authorize?client_id=7fc39f9d6a798fcc4ec4&scope=user:email

https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps

<br>

---

### kakao oauth 

<br>

https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=f4789bf5226f1ab3dfa37ab7bd789532&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fkakao%2Ffinish&prompt=login

https://devhaks.github.io/2019/05/31/oauth2/


### swagger 
---
<br>

https://overcome-the-limits.tistory.com/entry/%ED%98%91%EC%97%85-%ED%98%91%EC%97%85%EC%9D%84-%EC%9C%84%ED%95%9C-swagger-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-feat-nodejs

https://velog.io/@yongh8445/Node-Express-Swagger-%EC%97%B0%EB%8F%99

https://joooohee.tistory.com/10