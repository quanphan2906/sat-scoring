<signup>
    <div id="register-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">SAT Scoring App</div>
        </div>
        <div class="margin-top-12px" style="margin-left: 450px; margin-bottom: 8px">
            <button id="log-in">Log in</button>
            <button class="margin-left-24px">Sign up</button>
        </div>
    </div>

    <div id="register-wrapper">
        <div id="student-register-container" class="flex-row margin-top-24px">
            <img class="register-img" src="../assets/students.jpg" alt="" style="height: 400px; width: auto; margin-left: 96px;">
            <div class="flex-col" style="margin-left: 96px">
                <div class="font-20px margin-bot-12px" style="margin-left: 133px;">Sign up here!</div>
                <form id="register-form" action="" class="flex-col margin-top-24px" style="margin-left: 133px;">
                    <div class="flex-row flex-space-between">

                        <div>
                            <input class="input" type="text" name="firstName" placeholder="First name" class="">
                            <div class="error" id="firstName-error"></div>
                        </div>

                        <div style="margin-left: 43px;">
                            <input class="input" type="text" name="lastName" placeholder="Last name">
                            <div class="error" id="lastName-error"></div>
                        </div>

                    </div>

                    <input class="input margin-top-12px" type="email" name="email" placeholder="email@gmail.com">
                    <div class="error" id="email-error"></div>

                    <input class="input margin-top-12px" type="password" name="password" placeholder="Password">
                    <div class="error" id="password-error"></div>

                    <input class="input margin-top-12px" type="password" name="confirmPassword" placeholder="Confirm password">
                    <div class="error" id="confirmPassword-error"></div>
                    
                    <div class="flex-space-between">
                        <div id="already-have-account" class="margin-top-12px pointer" style="margin-left: 1px;">Already have account? Login!</div>
                        <button class="button-primary btn center margin-top-12px" style="margin-right: 0px">Register</button>
                    </div>
                    
                    <div class="margin-top-12px form-error" id="form-error"></div>
                </form>
            </div>
        </div>
    </div>
</signup>