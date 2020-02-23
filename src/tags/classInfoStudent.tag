<classinfostudent>
    <div id="class-info-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 360px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div id="email" style="margin-top: 12px;">{opts.userEmail}</div>
            <button id="sign-out" class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <div id="content-wrapper" class="flex-row" style="margin-top: 48px; flex-wrap: nowrap;">

        <div id="overview-wrapper" style="margin-left: 96px;" class="flex-col">
            <div class="font-24px">{opts.name}</div>
            <div class="margin-bot-24px"><i class="font-18px">{opts.schedule.day} {opts.schedule.time}</i></div>
            <div class="margin-top-12px font-14px"><b>Current number of students</b> {opts.students.total}</div>
        </div>

        <div class="line-straight" style="margin-left: 54px;"></div>

        <div id="class-list-wrapper" style="margin-left: 54px;" class="flex-col">
            <div id="student-list-container" style="margin-top: 48px; width: inherit;" class="flex-row">
                <div each="{student in opts.students.data}" class="student-wrapper border-standard fit-content margin-left-12px margin-bot-12px">
                    <div class="student-container fit-content" style="margin: 8px;">
                        <div class="fit-content font-20px">{student.name}</div>
                        <div class="fit-content margin-top-12px"><b>Email</b> {student.email}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="line" style="margin-top: 48px;"></div>
    <div id="material-list-wrapper" class="flex-col">
        <div class="font-24px margin-top-24px" style="align-self: center;">Materials</div>
        <div id="material-list-container" class="flex-row" style="margin-top: 24px;">
            <div each="{id, material in opts.materials}" class="border-standard box-shadow-standard fit-content margin-bot-24px" style="margin-left: 48px">
                <div style="width: 150px; height: 100px; margin: 8px;" class="flex-col">
                    <div class="margin-top-12px font-20px text-center">{material}</div>
                    <button class="submit-answer-btn margin-top-12px" style="margin-left: 4px; padding-right: 4px; padding-left: 8px;" materialName="{material}" className="{opts.name}">Submit answers!</button>
                </div>
            </div>
        </div>
    </div>
</classinfostudent>