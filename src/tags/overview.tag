<overview>
    <div class="flex-row border-standard">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">SAT Scoring App</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 360px; margin-bottom: 8px">
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

    <div id="content-wrapper" class="flex-row" style="margin-top: 48px; flex-wrap: nowrap;">

        <div id="overview-wrapper" style="margin-left: 96px;" class="flex-col">
            <div class="margin-top-12px"><b>Current number of students</b> {opts.studentsTotal}</div>
            <div class="margin-top-12px"><b>Current number of classes</b> {opts.classesTotal}</div>
            <button id="btn-create-class" class="margin-top-24px bg-color-warning color-black">Create class</button>
        </div>

        <div class="line-straight" style="margin-left: 54px;"></div>

        <div id="class-list-wrapper" style="margin-left: 54px;" class="flex-col">
            <div id="class-list-container" style="margin-top: 48px; width: inherit;" class="flex-row">
                <div each="{class in opts.classesInfo}" id="class-wrapper" class="border-standard fit-content margin-left-12px margin-bot-12px">
                    <div id="class-container" class="fit-content" style="margin: 8px;">
                        <div class="fit-content font-20px">{class.name}</div>
                        <div class="fit-content font-16px"><i>{class.schedule.day} {class.schedule.time}</i></div>
                        <button class="more-info-btn font-12px margin-top-12px" style="font-size: 8px; padding-bottom: 34px;" className="{class.name}">More information</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div class="flex-center mx-modal" id="modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form id="create-class-form" action="" class="flex-col">
                    <div class="font-20px margin-bot-24px">Let's create a class!</div>
                    <input name="className" type="text" placeholder="Class's name (Ex: J071)" style="width: 400px; margin-bottom: 0px;">
                    <div id="className-error" style="margin: 4px 0px 12px 1px" class="form-error fit-content"></div>

                    <input name="scheduleDay" type="text" placeholder="Learning day (Ex: 246)" style="margin-bottom: 0px;">
                    <div id="scheduleDay-error" style="margin: 4px 0px 12px 1px" class="form-error fit-content"></div>

                    <input name="scheduleTime" type="text" placeholder="Learning time (Ex: 8.30pm)" style="margin-bottom: 0px;">
                    <div id="scheduleTime-error" style="margin: 4px 0px 12px 1px" class="form-error fit-content"></div>

                    
                    <div class="fit-content" style="margin-bottom: 4px;"><i class="font-12px opacity-50">Emails MUST be separated by COMMAS (,)</i></div>
                    <input name="emails" type="text" placeholder="Students' emails (ex: billgates@gmail.com)" style="margin-bottom: 24px;" multiple>

                    <button class="btn-primary">Create class</button>
                    <button id="unconfirm-delete-class-btn" class="btn-primary color-black">Nah! Maybe later</button>
                    <div id="form-error" class="form-error margin-top-12px margin-bot-24px">
                    </div>
                </form>
            </div>
        </div>
    </div>
</overview>