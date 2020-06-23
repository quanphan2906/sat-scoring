<submit>
    <div id="submit-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">SAT Scoring App</div>
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
        <div>
            <div class="font-20px text-center">{opts.name}</div>
            <div class="font-16px text-center"><i>Class: {opts.className}</i></div>
            <div class="font-16px text-center"><i>Type: {opts.type}</i></div>
            <div class="text-center margin-top-24px flex-row" style="margin-bottom: 72px;">
                <button value="" each="{section in opts.sections}" class="section-option margin-left-12px margin-top-12px">{section.sectionName}</button>
            </div>
            <div id="result" class="font-20px margin-top-24px text-center">
                Your result: 0%
            </div>
        </div>
        <div>
            <img src="{opts.fileUrls}" alt="" width="300px" height="300px">
        </div>
    </div>

    <div class="line" style="margin-top: 24px;"></div>

    <div class="margin-top-24px">
        <div class="text-center font-20px">Reading</div>
        <div id="answers-list" class="flex-row center margin-top-12px text-center"></div>
    </div>

    <div class="flex-center margin-top-24px margin-bot-24px">
        <button id="check-btn" class="center btn-primary">Let's check</button>
    </div>
</submit>