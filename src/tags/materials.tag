<materials>
    <div id="register-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 400px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div class="dropdown">
                <div id="email" class="drop-title" style="margin-top: 12px;">{opts.userEmail}</div>
                <div class="dropdown-content">
                    <a href="/upload">Upload materials</a>
                    <a href="/materials">Materials page</a>
                    <a href="/overview">Overview</a>
                </div>
            </div>
            <button id="sign-out" class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <!--  <div class="flex-row" style="height: 240px;">
        <div id="slogan-container" class="flex-center">
            <div class="color-white font-20px" style="text-align: center">Ready to ace some SAT tests?</div>
        </div>
    </div>  -->
    <div class="flex-row" style="flex-wrap: nowrap;">   

        <div class="flex-col margin-top-24px" style="margin-left: 72px;">
            <button id="upload-btn" class="btn-primary margin-bot-24px">Upload materials</button>
            <div class="line" style="margin-bottom: 24px;"></div>
            <div class="font-20px margin-bot-24px">Choose a type</div>
            <div class="border-right box-shadow-standard fit-content margin-bot-24px flex-row">
                <div class="fit-content pointer" style="margin: 8px;">
                    <img src="../assets/reading.jpg" alt="" class="sections-img">
                    <div class="material-type margin-top-12px font-16px center text-center fit-content">Reading</div>
                </div>
            </div>
            <div class="border-standard box-shadow-standard fit-content margin-bot-24px">            
                <div class="fit-content pointer" style="margin: 8px;">
                    <img src="../assets/writing.jpg" alt="" class="sections-img">
                    <div class="material-type margin-top-12px font-16px text-center">Writing</div>
                </div>
            </div>
            <div class="border-standard box-shadow-standard fit-content margin-bot-24px">
                <div class="fit-content pointer" style="margin: 8px;">
                    <img src="../assets/maths.jpg" alt="" class="sections-img">
                    <div class="material-type margin-top-12px font-16px text-center">Maths</div>
                </div>
            </div>
            <div class="border-standard box-shadow-standard fit-content margin-bot-24px border-right">
                <div class="fit-content pointer" style="margin: 8px;">
                    <img src="../assets/practice tests.jpg" alt="" class="sections-img">
                    <div class="material-type margin-top-12px font-16px text-center">Pratice tests</div>
                </div>
            </div>
        </div>

        <div class="line-straight" style="margin-left: 72px; margin-right: 48px;"></div>

        <div id="material-list-wrapper" class="flex-col margin-top-24px">
            <div class="flex-row">
                <input id="search-bar" type="text" placeholder="Search" class="center" style="margin-left: 300px; width: 220px; margin-right: 0px;">
                <button id="search-bar-btn" class="btn-primary center" style="width: fit-content; margin-left: 12px;">Go</button>
            </div>
            
            <div id="loader"></div>
            
            <div id="material-list-container" style="width: inherit;" class="flex-row margin-top-24px">
                <div each="{material in opts.materialsWithType}" class="border-standard box-shadow-standard fit-content margin-top-24px" style="margin-left: 24px">
                    <div style="width: 150px; height: 100px; margin: 8px;" class="flex-col">
                        <div class="margin-top-12px font-20px text-center">{material.name}</div>
                        <button class="edit-info margin-top-12px" style="margin-left: 4px; padding-right: 4px; padding-left: 8px;" materialName={material.name}>Edit information</button>
                    </div>
                </div> 
            </div>
        </div>

    </div>

</materials>