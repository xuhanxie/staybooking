package com.laioffer.staybooking.filter;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)  // 这个filter是最高优先级
public class CorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        // 以下是来回应前端发来的跨域访问请求，通过下列几行代码表示后端支持跨域访问
        httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        httpServletResponse.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

        // 判断request的method是不是options，options请求并不含具体操作，只是判断后端支不支持跨域访问
        // 所以一旦判断是options，就表示ok，不需要继续过滤
        if ("OPTIONS".equalsIgnoreCase(httpServletRequest.getMethod())) {
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
        } else {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
    }
}

// Client -> Server
// 原先是HTTP GET (lat, lon, user, xxx)
// client -> 现在是先发HTTP OPTIONS()   -> Server -> server set responseHeader(1,2,3), set responseStatus(ok)
//  -> return response to Client
// Client(Browser) check response header, decide whether server supports CORS request.
// if not, return error to frontend code.
// if so, HTTP GET(lat, lon, user, xxx) -> Server -> CorsFilter 执行 else  -> do filter(jwt, user authorization, xxx)
// -> dispatch request to SearchController
// 如果在filter过程中失败，就返回 401 unauthorized
