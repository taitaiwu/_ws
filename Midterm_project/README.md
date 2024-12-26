# 期中作業
資工二 吳佳泰 111210520

---
## 關於作業
* 此作業檔案有:
    * 前端 : templates資料夾內7個檔案([index.html](templates/index.html)、[signup.html](templates/signup.html)、[login.html](templates/login.html)、[classroom.html](templates/classroom.html)、[reserve.html](templates/reserve.html)、[history.html](templates/history.html)、[admin.html](templates/admin.html))
    * 後端 : [main.py](main.py)
* 前端部分使用Html、CSS、JavaScript和Bootstrap。讓ChatGPT先搭出程式碼框架和網頁模板，再把裡面的東西用[Bootstrap](https://bootstrap5.hexschool.com/)修改成我想要的樣子，字體使用[Google fonts](https://fonts.google.com/)
* 後端部分使用FastAPI(Python)。基本上獨立完成，過程參考[FastAPI](https://fastapi.tiangolo.com/zh/#_6)學習頁面及iT邦幫忙上面的文章教學，過程有使用ChatGPT來除錯
* 待改善的地方:
    * 網頁安全性 : 使用分板來紀錄每一位user的登入，可能會造成漏洞甚至使網頁crash
    * 教室預約可以加上課表，以及預約時間可以排除掉原本的上課時間
    * 管理介面還有一些東西需要完成和改善(可能有一些Bug)
    * 可再新增忘記密碼等功能

## 參考資料及教材

* ChatGPT 問答紀錄(回答內容僅供參考，**並非完全正確**) : [連結1](https://chatgpt.com/share/6727c745-91dc-800b-81b4-d777af93422d)、[連結2](https://chatgpt.com/share/6767c44d-9d70-800b-81a1-97a704dda528)、[連結3](https://chatgpt.com/share/6767c473-c614-800b-8c44-6af3e473f2e0)
* [Bootstrap 六角學院](https://bootstrap5.hexschool.com/)
* [FastAPI](https://fastapi.tiangolo.com/zh/#_6)
* [陳鍾誠. (2024, November 25). 網站設計 -- 從前端到後端 (html2server). GitHub.](https://github.com/cccbook/html2server)
* [黃裕二. (2024, May 8). 做出高質感網站，必須知道的網頁字體應用. 造九頑五.](https://make9.tw/wordpress/teaching/%E5%81%9A%E5%87%BA%E9%AB%98%E8%B3%AA%E6%84%9F%E7%B6%B2%E7%AB%99%EF%BC%8C%E5%BF%85%E9%A0%88%E7%9F%A5%E9%81%93%E7%9A%84%E7%B6%B2%E9%A0%81%E5%AD%97%E9%AB%94%E6%87%89%E7%94%A8/)
* [Nesso . (2023, October 5). FastAPI 入門30天. IT邦幫忙.](https://ithelp.ithome.com.tw/users/20152669/ironman/6306)
* [zhu424  . (2023, October 15). FastAPI 如何 Fast ？ 框架入門、實例、重構與測試. IT邦幫忙.](https://ithelp.ithome.com.tw/users/20152669/ironman/6306)
* [开放原子开发者工作坊. (2020, April 19). SQLAlchemy数据处理、query可用参数和filter过滤条件. CSDN 博客.](https://blog.csdn.net/ForsetiRe/article/details/105621425)
* [Linn. (2020, September 25). 初探JavaScript - JS 三種彈跳視窗(Popup)的寫法. IT邦幫忙.](https://ithelp.ithome.com.tw/articles/10243643)