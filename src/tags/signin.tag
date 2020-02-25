<signin>
    <div id="register-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px" style="margin-left: 450px; margin-bottom: 8px">
            <button id="to-login-page">Log in</button>
            <button id="to-signup-page" class="margin-left-24px">Sign up</button>
        </div>
    </div>

    <div id="login-wrapper">
        <div id="student-login-container" class="flex-row margin-top-24px" style="margin-bottom: 72px;">
            <img class="login-img" src="../assets/students.jpg" alt="" style="width: 40%; margin-left: 96px;">
            <div class="flex-col" style="margin-left: 60px; margin-top: 96px;">
                <div class="font-20px" style="margin-left: 133px;">Login page!</div>
                <form id="login-form" action="" class="flex-col margin-top-24px" style="margin-left: 133px;">
                    <input class="input" type="email" name="email" placeholder="email@gmail.com" style="width: 320px">
                    <div class="error" id="email-error"></div>

                    <input class="input margin-top-12px" type="password" name="password" placeholder="Password">
                    <div class="error" id="password-error"></div>
                    
                    <button class="button-primary btn center margin-top-12px" style="margin-right: 0px">Log in</button>
                    
                    <div class="margin-top-12px form-success" id="form-success"></div>
                    <div class="margin-top-12px form-error" id="form-error"></div>
                </form>
            </div>
        </div>
    </div>
</signin>