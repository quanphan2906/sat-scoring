<classinfoassistant>
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
            <div class="margin-top-12px font-14px"><b>Current number of students</b> {opts.students.total} </div>
            <button id="add-student-btn" class="bg-color-warning color-white color-black margin-top-24px">Add student</button>
            <button id="delete-class-btn" class="bg-color-danger color-white" style="margin: 8px;">Delete class</button>
        </div>

        <div class="line-straight" style="margin-left: 54px;"></div>

        <div id="class-list-wrapper" style="margin-left: 54px;" class="flex-col">
            <div id="student-list-container" style="margin-top: 48px; width: inherit;" class="flex-row">
                <div each="{student in opts.students.data}" class="student-wrapper border-standard fit-content margin-left-12px margin-bot-12px">
                    <div class="student-container fit-content" style="margin: 8px;">
                        <div class="fit-content font-20px">{student.name}</div>
                        <div class="fit-content margin-top-12px"><b>Email</b> {student.email}</div>
                        <button class="remove-student-from-class fit-content margin-top-12px bg-color-danger color-white fit-content" studentEmail="{student.email}">Remove this student</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="line" style="margin-top: 48px;"></div>
    <div id="material-list-wrapper" class="flex-col">
        <div class="font-24px margin-top-24px" style="align-self: center;">Materials</div>
        <div id="material-list-container" class="flex-row" style="margin-top: 24px;">

            <div each="{sections, materialName in opts.wrongAnswers}" class="border-standard box-shadow-standard fit-content margin-bot-24px center" style="margin-left: 48px; width: 50%;">
                <div class="old-test-container flex-row fit-content" style="flex-wrap: nowrap;">

                    <img src="../assets/img-placeholder.jpg" alt="" width="100px" height="100px" style="margin: 12px;">

                    <div class="flex-col" style="margin: 12px;">
                        <div class="font-16px">{materialName}</div>

                        <div each="{wrongAnswersData, sectionName in sections}">
                            <div><b>{sectionName}</b> <span class="margin-left-12px"></span> <span each="{answer in wrongAnswersData}">{answer}, </span></div>
                            <!--  <div class="font-14px margin-bot-12px">
                                Wrong answers: 
                            </div>  -->
                        </div>

                    </div>

                </div>
            </div>

        </div>
        <button id="add-material-btn" class="btn-primary margin-top-24px fit-content" style="align-self: center;">Add material</button>
    </div>

    <div class="flex-center mx-modal" id="add-student-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form action="" class="flex-col" id="add-student-form">
                    <div class="font-20px margin-bot-24px">Let's add some students!</div>
                    <input name="email" type="text" placeholder="Students' accounts (ex: billgates@gmail.com)">
                    <button name="btnAdd" class="btn-primary">Add student</button>
                    <button name="btnNoAddAnymore" class="btn-warning">Nah, maybe later!</button>
                    <div id="add-student-form-error-container"></div>
                </form>
            </div>
        </div>
    </div>
    
    <div class="flex-center mx-modal" id="delete-class-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form action="" class="flex-col">
                    <div class="font-20px">You are deleting class <b>{opts.name}</b></div>
                    <div class="font-14px opacity-50 margin-bot-12px">Are you sure?</div>
                    <button id="confirm-delete-class-btn" class="bg-color-danger color-white">Yes, delete this class</button>
                    <button id="unconfirm-delete-class-btn" class="btn-primary color-black">NO! Take me back to safety</button>
                </form>
            </div>
        </div>
    </div>

    <div class="flex-center mx-modal" id="remove-student-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form action="" class="flex-col">
                    <div class="font-20px">You are removing student <b id="student-email-container"></b></div>
                    <div class="font-14px opacity-50 margin-bot-12px">Are you sure?</div>
                    <button id="confirm-remove-student-btn" class="bg-color-danger color-white fit-content" style="align-self: center;" className="{opts.name}">Yes, remove this student</button>
                    <button id="unconfirm-remove-student-btn" class="btn-primary color-black fit-content" style="align-self: center;">NO! Take me back to safety</button>
                </form>
            </div>
        </div>
    </div>

    <div class="flex-center mx-modal" id="add-material-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form action="" class="flex-col" id="add-material-form">
                    <div class="font-20px margin-bot-24px">Let's add some materials!</div>
                    <input name="materialName" type="text" placeholder="Material's name">
                    <button name="btnAdd" class="btn-primary">Add material</button>
                    <button name="btnNoAddAnymore" class="btn-warning">Nah, maybe later!</button>
                    <div id="add-material-form-error-container"></div>
                </form>
            </div>
        </div>
    </div>

</classinfoassistant>