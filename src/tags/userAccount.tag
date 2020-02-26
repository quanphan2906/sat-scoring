<useraccount>
    <div id="submit-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 400px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div class="dropdown">
                <div id="email" class="drop-title" style="margin-top: 12px;">{opts.userEmail}</div>
                <div class="dropdown-content">
                    <a href="/userAccount">Account Information</a>
                </div>
            </div>
            <button id="sign-out" class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <div class="flex-space-evenly">
        <div id="personal-information" class="flex-center">
            <div class="font-16px"><b>Email</b> {opts.data.email}</div>
            <div class="flex-col" style="margin-top: 8px;">
                <div class="font-16px"><b>Classes</b></div>
                <div class="flex-row" style="flex-wrap: wrap; margin-top: 4px;">
                    <button class="class-name" each="{class in opts.classNamesFirebase}" style="margin-left: 8px;">{class}</button>
                </div>
            </div>
            <button id="delete-btn" class="margin-top-24px center bg-color-danger color-white" style="width: 164px;">Delete account</button>
        </div>
        <div style = "width: 800px; height: 400px">
            <canvas id="result-chart" width="100" height="100"></canvas>
        </div>

    </div>

    <div class="line" style="margin-top: 24px;"></div>

    <div id="old-test-wrapper" style="width: 100%;" class="flex-col margin-bot-24px">
        <div class="margin-top-24px font-20px" style="align-self: center;">Review</div>
        <div each="{test in opts.data.oldTests}" class="border-standard center margin-top-24px" style="width: 70%;">
            <div class="old-test-container flex-row fit-content" style="flex-wrap: nowrap;">
                <div><img class="material-imgs" testName="{test.name}" src="../assets/img-placeholder.jpg" width="100px" height="100px" style="margin: 12px;"></div>
                <div class="flex-col" style="margin: 12px;">
                    <div class="font-16px">{test.name}</div>
                    <div class="font-12px"><i>Type: {test.type}</i></div>
                    <div class="font-14px margin-top-12px">
                        Wrong answers: <span each="{answer in test.wrongAnswers}">  {answer}  </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex-center mx-modal" id="delete-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;">
                <div class="font-20px margin-bot-24px">You are deleting your account. Are you sure?</div>
                <button id="confirm-delete-btn" class="bg-color-danger color-white">Yes, I am done with SAT</button>
                <button id="unconfirm-delete-btn" class="btn-primary">Get me back to safety</button>
            </div>
        </div>
    </div>
</useraccount>